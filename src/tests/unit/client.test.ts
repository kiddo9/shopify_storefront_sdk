import { describe, it, expect, vi, beforeEach } from "vitest";
import ShopifyStorefront from "../../index.js";
import {
  ShopifyInvalidRequestError,
  ShopifyNetworkError,
  ShopifyGraphQLError,
  ShopifyUserError,
} from "../../utils/errors.js";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("Shopify SDK Unit Tests", () => {
  const MOCK_DOMAIN = "test-store.myshopify.com";
  const MOCK_TOKEN = "mock-token-123";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Initialization", () => {
    it("should throw ShopifyInvalidRequestError if domain is missing", () => {
      expect(() => {
        new ShopifyStorefront({ storeUrl: "", storefrontToken: MOCK_TOKEN });
      }).toThrow(ShopifyInvalidRequestError);
    });

    it("should throw ShopifyInvalidRequestError if domain is invalid", () => {
      expect(() => {
        new ShopifyStorefront({ storeUrl: "invalid-url.com", storefrontToken: MOCK_TOKEN });
      }).toThrow(ShopifyInvalidRequestError);
    });

    it("should throw ShopifyInvalidRequestError if token is missing", () => {
      expect(() => {
        new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: "" });
      }).toThrow(ShopifyInvalidRequestError);
    });

    it("should initialize successfully with valid config", () => {
      const client = new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: MOCK_TOKEN });
      expect(client).toBeDefined();
    });
  });

  describe("API Versioning", () => {
    it("should default to the 2025-01 API version if none is provided", async () => {
      const client = new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: MOCK_TOKEN });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} }),
      });
      
      await client.customQuery("query { shop { name } }", {});
      
      expect(fetchMock).toHaveBeenCalledWith(
        `https://${MOCK_DOMAIN}/api/2025-01/graphql.json`,
        expect.objectContaining({ method: "POST" })
      );
    });

    it("should use a custom API version if provided", async () => {
      const client = new ShopifyStorefront({ 
        storeUrl: MOCK_DOMAIN, 
        storefrontToken: MOCK_TOKEN,
        apiVersion: "unstable"
      });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: {} }),
      });
      
      await client.customQuery("query { shop { name } }", {});
      
      expect(fetchMock).toHaveBeenCalledWith(
        `https://${MOCK_DOMAIN}/api/unstable/graphql.json`,
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  describe("Error Handling", () => {
    let client: ShopifyStorefront;

    beforeEach(() => {
      // Reduce retries in tests to avoid slowing them down
      client = new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: MOCK_TOKEN, maxRetries: 0 });
    });

    it("should throw ShopifyNetworkError when fetch fails (e.g. network down)", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Network connection lost"));

      await expect(
        client.customQuery("query { shop { name } }", {})
      ).rejects.toThrow(ShopifyNetworkError);
    });

    it("should throw ShopifyInvalidRequestError for 400 responses", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request"
      });

      await expect(
        client.customQuery("query { shop { name } }", {})
      ).rejects.toThrow(ShopifyInvalidRequestError);
    });

    it("should throw ShopifyGraphQLError when Shopify returns top-level errors", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          errors: [{ message: "Unauthorized Request" }],
        })
      });

      await expect(
        client.customQuery("query { shop { name } }", {})
      ).rejects.toThrow(ShopifyGraphQLError);
    });

    it("should throw ShopifyUserError when a mutation returns nested userErrors", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customerCreate: {
              customer: null,
              userErrors: [{ field: ["email"], message: "Email has already been taken" }],
            },
          },
        })
      });

      await expect(
        client.customQuery("mutation { customerCreate { userErrors { message } } }", {})
      ).rejects.toThrow(ShopifyUserError);
    });

    it("should return the correct data on a successful response", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            shop: { name: "Test Store" },
          },
        })
      });

      const response = await client.customQuery<any>("query { shop { name } }", {});
      expect(response.shop.name).toBe("Test Store");
    });
  });

  describe("Auto-Retries", () => {
    it("should successfully retry on a 429 rate limit response", async () => {
      const client = new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: MOCK_TOKEN, maxRetries: 2 });
      
      // First attempt: Rate Limited
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests"
      });

      // Second attempt: Success
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { shop: { name: "Success After Retry" } },
        })
      });

      const response = await client.customQuery<any>("query { shop { name } }", {});
      
      expect(response.shop.name).toBe("Success After Retry");
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
