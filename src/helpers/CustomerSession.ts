import type ShopifyStorefront from "../index.js";
import type { CustomerUpdateInput } from "../generated/shopify.js";

/**
 * A stateful high-level manager for an authenticated Customer's session.
 * Automatically injects the customer access token into subsequent requests.
 */
export class CustomerSession {
  private sdk: ShopifyStorefront;
  public token: string;

  constructor(sdk: ShopifyStorefront, customerAccessToken: string) {
    this.sdk = sdk;
    this.token = customerAccessToken;
  }

  /**
   * Retrieves the customer details for this session.
   * Useful for verifying the token is still valid.
   */
  async verify() {
    return this.sdk.verifyCustomerToken({ token: this.token });
  }

  /**
   * Updates this customer's profile information.
   * @param customer The fields to update (e.g. firstName, lastName).
   */
  async update(customer: CustomerUpdateInput) {
    return this.sdk.updateCustomer({
      customerAccessToken: this.token,
      customer,
    });
  }

  /**
   * Fetches the order history for this authenticated customer.
   * @param first The number of orders to return (defaults to 250).
   */
  async getOrders(first: number = 250) {
    return this.sdk.getCustomerOrders({
      customerAccessToken: this.token,
      first,
    });
  }
}
