export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when there is an issue with the network or the Shopify API is unreachable (e.g. timeouts, 5xx responses).
 */
export class ShopifyNetworkError extends ShopifyError {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyNetworkError";
  }
}

/**
 * Thrown when the GraphQL request is successfully made but Shopify returns top-level GraphQL errors.
 */
export class ShopifyGraphQLError extends ShopifyError {
  public readonly graphqlErrors: any[];

  constructor(message: string, graphqlErrors: any[]) {
    super(message);
    this.name = "ShopifyGraphQLError";
    this.graphqlErrors = graphqlErrors;
  }
}

/**
 * Thrown when a mutation returns user errors (e.g. invalid form data, missing fields)
 */
export class ShopifyUserError extends ShopifyError {
  public readonly userErrors: any[];

  constructor(message: string, userErrors: any[]) {
    super(message);
    this.name = "ShopifyUserError";
    this.userErrors = userErrors;
  }
}

/**
 * Thrown when the SDK configuration is invalid or the request is malformed (e.g. 400 Bad Request, 401 Unauthorized).
 */
export class ShopifyInvalidRequestError extends ShopifyError {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyInvalidRequestError";
  }
}
