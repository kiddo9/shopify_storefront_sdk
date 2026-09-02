import { describe, it, expect, vi, beforeEach } from "vitest";
import ShopifyStorefront from "../../index.js";
import { InMemoryCache } from "../../utils/cache.js";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("Caching System", () => {
  const MOCK_DOMAIN = "test-store.myshopify.com";
  const MOCK_TOKEN = "mock-token-123";
  let cache: InMemoryCache;

  beforeEach(() => {
    vi.resetAllMocks();
    cache = new InMemoryCache();
  });

  it("should cache successful queries and prevent subsequent network requests", async () => {
    const client = new ShopifyStorefront({
      storeUrl: MOCK_DOMAIN,
      storefrontToken: MOCK_TOKEN,
      cache,
      defaultCacheTtl: 60,
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { shop: { name: "First Fetch" } },
      }),
    });

    // 1st call: Should hit the network (fetchMock called)
    const result1 = await client.customQuery<any>("query { shop { name } }", {});
    expect(result1.shop.name).toBe("First Fetch");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // 2nd call: Should return from cache (fetchMock NOT called again)
    const result2 = await client.customQuery<any>("query { shop { name } }", {});
    expect(result2.shop.name).toBe("First Fetch");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should NOT cache mutations", async () => {
    const client = new ShopifyStorefront({
      storeUrl: MOCK_DOMAIN,
      storefrontToken: MOCK_TOKEN,
      cache,
      defaultCacheTtl: 60,
    });

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { customerCreate: { customer: { id: "123" } } },
      }),
    });

    // 1st call
    await client.customQuery<any>("mutation { customerCreate(input: {}) { customer { id } } }", {});
    
    // 2nd call with exactly the same mutation
    await client.customQuery<any>("mutation { customerCreate(input: {}) { customer { id } } }", {});
    
    // Mutations should bypass the cache entirely
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should expire cache entries after the TTL", async () => {
    // Override Date.now for time travel
    const originalDateNow = Date.now;
    let mockedTime = 1000000;
    vi.spyOn(Date, "now").mockImplementation(() => mockedTime);

    const client = new ShopifyStorefront({
      storeUrl: MOCK_DOMAIN,
      storefrontToken: MOCK_TOKEN,
      cache,
      defaultCacheTtl: 1, // 1 second TTL
    });

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { data: "mocked" },
      }),
    });

    // Initial fetch
    await client.customQuery<any>("query { something }", {});
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Fast forward time by 2 seconds (exceeding 1s TTL)
    mockedTime += 2000;

    // Subsequent fetch should hit network again because cache expired
    await client.customQuery<any>("query { something }", {});
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Restore Date.now
    vi.restoreAllMocks();
  });
});
