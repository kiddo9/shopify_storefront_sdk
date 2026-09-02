import { describe, it, expect, vi, beforeEach } from "vitest";
import ShopifyStorefront from "../../index.js";
import { CartManager } from "../../helpers/CartManager.js";

describe("CartManager", () => {
  const MOCK_DOMAIN = "test-store.myshopify.com";
  const MOCK_TOKEN = "mock-token-123";
  let shopify: ShopifyStorefront;

  beforeEach(() => {
    vi.resetAllMocks();
    shopify = new ShopifyStorefront({ storeUrl: MOCK_DOMAIN, storefrontToken: MOCK_TOKEN });
  });

  it("should initialize with an existing cart ID", () => {
    const cart = shopify.cart("existing-cart-123");
    expect(cart.id).toBe("existing-cart-123");
  });

  it("should lazily create a cart if no ID is provided", async () => {
    const cart = shopify.cart();
    expect(cart.id).toBeNull();

    // Mock createCart on the SDK instance
    const createCartSpy = vi.spyOn(shopify, "createCart").mockResolvedValueOnce({
      cartCreate: { cart: { id: "new-cart-456" } }
    } as any);

    // Mock addCartLines
    const addCartLinesSpy = vi.spyOn(shopify, "addCartLines").mockResolvedValueOnce({} as any);

    await cart.addLines([{ merchandiseId: "variant-1", quantity: 1 }]);

    expect(createCartSpy).toHaveBeenCalledTimes(1);
    expect(addCartLinesSpy).toHaveBeenCalledWith({
      cartId: "new-cart-456",
      lines: [{ merchandiseId: "variant-1", quantity: 1 }]
    });
    expect(cart.id).toBe("new-cart-456");
  });

  it("should reuse the cart ID for subsequent operations", async () => {
    const cart = shopify.cart("existing-cart-123");
    
    const createCartSpy = vi.spyOn(shopify, "createCart");
    const getCartSpy = vi.spyOn(shopify, "getCart").mockResolvedValueOnce({} as any);

    await cart.get();

    // Should NOT have called createCart since an ID was provided
    expect(createCartSpy).not.toHaveBeenCalled();
    expect(getCartSpy).toHaveBeenCalledWith({ cartId: "existing-cart-123", first: 250 });
  });
});
