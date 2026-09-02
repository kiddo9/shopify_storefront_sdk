import type { StoreConfig } from "../utils/config.js";
import type { ShopifyCache } from "../utils/cache.js";
import * as crypto from "node:crypto";
import {
  ShopifyNetworkError,
  ShopifyGraphQLError,
  ShopifyInvalidRequestError,
  ShopifyUserError
} from "../utils/errors.js";

class ShopifyClient {
  private endpoint: string;
  private token: string;
  private maxRetries: number;
  private cache: ShopifyCache | undefined;
  private cacheTtl: number;
  
  constructor({ storeUrl, storefrontToken, apiVersion = "2025-01", maxRetries = 3, cache, defaultCacheTtl = 60 }: StoreConfig) {
    if (!storeUrl || !storeUrl.includes(".myshopify.com")) {
      throw new ShopifyInvalidRequestError(`The store URL "${storeUrl}" is invalid or not supported by Shopify.`);
    }
    if (!storefrontToken) {
      throw new ShopifyInvalidRequestError("A valid storefront access token must be provided.");
    }
    this.endpoint = `https://${storeUrl}/api/${apiVersion}/graphql.json`;
    this.token = storefrontToken;
    this.maxRetries = maxRetries;
    this.cache = cache;
    this.cacheTtl = defaultCacheTtl;
  }

  /**
   * Generates a deterministic hash for a GraphQL query and its variables.
   */
  private generateCacheKey(query: string, variables: any): string {
    return crypto.createHash("sha256").update(query + JSON.stringify(variables || {})).digest("hex");
  }

  async query<T = any>(query: string, variables = {}): Promise<T> {
    const isMutation = query.trim().startsWith("mutation");
    let cacheKey = "";

    // 1. Check Cache (Only for Queries, never Mutations)
    if (this.cache && !isMutation) {
      cacheKey = this.generateCacheKey(query, variables);
      const cachedResponse = await this.cache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    let attempt = 0;

    while (attempt <= this.maxRetries) {
      try {
        const res = await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": this.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables,
          })
        });

        if (!res.ok) {
          // Handle Rate Limits (429) or Server Errors (503) by throwing so we can retry
          if (res.status === 429 || res.status === 503) {
            throw new ShopifyNetworkError(`Shopify returned HTTP ${res.status}: Rate Limited or Service Unavailable`);
          }

          // Handle other HTTP errors
          if (res.status >= 400 && res.status < 500) {
            throw new ShopifyInvalidRequestError(`Shopify returned a client error: HTTP ${res.status}`);
          }
          throw new ShopifyNetworkError(`Shopify Server Error: HTTP ${res.status}`);
        }

        const data: any = await res.json();

        // 2. Handle top-level GraphQL Errors
        if (data?.errors && data.errors.length > 0) {
          throw new ShopifyGraphQLError(
            data.errors[0]?.message || "GraphQL API returned errors",
            data.errors
          );
        }

        // 3. Scan for nested User Errors (commonly found in mutations)
        if (data?.data) {
          this.checkForUserErrors(data.data);
        }

        // 4. Save to Cache
        if (this.cache && !isMutation && data?.data) {
          await this.cache.set(cacheKey, data.data, this.cacheTtl);
        }

        return data?.data;
      } catch (error: any) {
        // If it's a structural/GraphQL/User error, or a 4xx error (except 429), re-throw immediately.
        if (
          error instanceof ShopifyGraphQLError ||
          error instanceof ShopifyInvalidRequestError ||
          error instanceof ShopifyUserError
        ) {
          throw error;
        }

        // If it's a network error or 429/503 and we have retries left, wait and retry.
        if (attempt < this.maxRetries) {
          attempt++;
          // Exponential backoff: 500ms, 1000ms, 2000ms...
          const backoff = Math.pow(2, attempt) * 500;
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }

        // Out of retries or unexpected error
        throw new ShopifyNetworkError(`Network Error: ${error.message}`);
      }
    }

    throw new ShopifyNetworkError("Maximum retries exceeded");
  }

  /**
   * Helper function to recursively check for `userErrors` inside the GraphQL response data.
   */
  private checkForUserErrors(data: any) {
    if (!data || typeof data !== "object") return;

    for (const key of Object.keys(data)) {
      const value = data[key];
      if (value && typeof value === "object") {
        if ("userErrors" in value && Array.isArray(value.userErrors) && value.userErrors.length > 0) {
          throw new ShopifyUserError(
            value.userErrors[0]?.message || "A user error occurred during the mutation",
            value.userErrors
          );
        } else if ("customerUserErrors" in value && Array.isArray(value.customerUserErrors) && value.customerUserErrors.length > 0) {
          throw new ShopifyUserError(
            value.customerUserErrors[0]?.message || "A customer user error occurred",
            value.customerUserErrors
          );
        } else {
          this.checkForUserErrors(value);
        }
      }
    }
  }
}

export default ShopifyClient;
