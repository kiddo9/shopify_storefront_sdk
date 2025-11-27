import type { StoreConfig } from "../utils/config.js";
import axios from "axios";

class ShopifyClient {
  private endpoint;
  private token;
  constructor({ storeUrl, storefrontToken }: StoreConfig) {
    if (!storeUrl?.includes(".myshopify.com")) {
      throw new Error(`The store url ${storeUrl} is not supported by shopify`);
    }
    (this.endpoint = `https://${storeUrl}/api/2025-04/graphql.json`),
      (this.token = storefrontToken);
  }

  async query<T = any>(query: string, variables = {}): Promise<T> {
    try {
      const res = await axios.post(
        this.endpoint,
        {
          query,
          variables,
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": this.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data?.errors)
        throw new Error(JSON.stringify(res.data.errors, null, 2));
      return res.data?.data;
    } catch (error: any) {
      throw new Error(`Shopify Error: ${error.message}`);
    }
  }
}

export default ShopifyClient;
