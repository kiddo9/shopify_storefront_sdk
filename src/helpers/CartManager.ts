import type ShopifyStorefront from "../index.js";
import type { CartLineInput, CartLineUpdateInput } from "../generated/shopify.js";

/**
 * A stateful high-level manager for a Shopify Cart.
 * Automatically handles lazy creation of the cart if an ID is not provided.
 */
export class CartManager {
  private sdk: ShopifyStorefront;
  public id: string | null;

  constructor(sdk: ShopifyStorefront, cartId?: string) {
    this.sdk = sdk;
    this.id = cartId || null;
  }

  /**
   * Ensures a cart exists. If not, it creates one and stores the ID.
   */
  private async ensureCart() {
    if (!this.id) {
      const res = await this.sdk.createCart({ input: {}, first: 250 });
      this.id = res.cartCreate?.cart?.id || null;
      if (!this.id) {
        throw new Error("Failed to create cart during lazy initialization.");
      }
    }
  }

  /**
   * Fetches the latest cart details.
   */
  async get(first: number = 250) {
    await this.ensureCart();
    return this.sdk.getCart({ cartId: this.id!, first });
  }

  /**
   * Adds line items to the cart. Creates the cart if it doesn't exist.
   */
  async addLines(lines: CartLineInput[]) {
    await this.ensureCart();
    return this.sdk.addCartLines({ cartId: this.id!, lines });
  }

  /**
   * Removes line items from the cart. Creates the cart if it doesn't exist.
   */
  async removeLines(lineIds: string[]) {
    await this.ensureCart();
    return this.sdk.removeCartLines({ cartId: this.id!, lineIds });
  }

  /**
   * Updates line items in the cart (e.g. modifying quantity).
   */
  async updateLines(lines: CartLineUpdateInput[], first: number = 250) {
    await this.ensureCart();
    return this.sdk.updateCartLines({ cartId: this.id!, lines, first });
  }
}
