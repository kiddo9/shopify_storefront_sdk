import { describe, it, expect, vi, beforeEach } from "vitest";
import ShopifyStorefront from "../../index.js";

describe("CustomerSession", () => {
  const MOCK_DOMAIN = "test-store.myshopify.com";
  const MOCK_TOKEN = "mock-token-123";
  let shopify: ShopifyStorefront;

  beforeEach(() => {
    vi.resetAllMocks();
    shopify = new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: MOCK_TOKEN });
  });

  it("should initialize with the provided token", () => {
    const session = shopify.customer("customer-token-123");
    expect(session.token).toBe("customer-token-123");
  });

  it("should forward the token when verifying the customer", async () => {
    const session = shopify.customer("customer-token-123");
    const verifySpy = vi.spyOn(shopify, "verifyCustomerToken").mockResolvedValueOnce({} as any);

    await session.verify();

    expect(verifySpy).toHaveBeenCalledWith({ token: "customer-token-123" });
  });

  it("should forward the token and customer payload when updating the customer", async () => {
    const session = shopify.customer("customer-token-123");
    const updateSpy = vi.spyOn(shopify, "updateCustomer").mockResolvedValueOnce({} as any);

    await session.update({ firstName: "John", lastName: "Doe" });

    expect(updateSpy).toHaveBeenCalledWith({
      customerAccessToken: "customer-token-123",
      customer: { firstName: "John", lastName: "Doe" }
    });
  });

  it("should forward the token and first argument when fetching orders", async () => {
    const session = shopify.customer("customer-token-123");
    const getOrdersSpy = vi.spyOn(shopify, "getCustomerOrders").mockResolvedValueOnce({} as any);

    await session.getOrders(50);

    expect(getOrdersSpy).toHaveBeenCalledWith({
      customerAccessToken: "customer-token-123",
      first: 50
    });
  });

  it("should default to first: 250 when fetching orders if not specified", async () => {
    const session = shopify.customer("customer-token-123");
    const getOrdersSpy = vi.spyOn(shopify, "getCustomerOrders").mockResolvedValueOnce({} as any);

    await session.getOrders();

    expect(getOrdersSpy).toHaveBeenCalledWith({
      customerAccessToken: "customer-token-123",
      first: 250
    });
  });
});
