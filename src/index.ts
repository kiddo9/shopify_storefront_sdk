import ShopifyClient from "./client/client.js";
import type { StoreConfig } from "./utils/config.js";
import type {
  CartBuyerIdentityInput,
  CartBuyerIdentityUpdateMutation,
  CartBuyerIdentityUpdateMutationVariables,
  CartCreateMutation,
  CartCreateMutationVariables,
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
  CartLinesUpdateMutation,
  CartLinesUpdateMutationVariables,
  CartMetafieldsSetMutation,
  CartMetafieldsSetMutationVariables,
  CustomerAccessTokenCreateInput,
  CustomerAccessTokenCreateMutation,
  CustomerAccessTokenCreateMutationVariables,
  CustomerCreateInput,
  CustomerCreateMutation,
  CustomerCreateMutationVariables,
  CustomerRecoverMutation,
  CustomerRecoverMutationVariables,
  CustomerUpdateMutation,
  CustomerUpdateMutationVariables,
  GetAllProductTypesQuery,
  GetAllProductTypesQueryVariables,
  GetArticlesQuery,
  GetArticlesQueryVariables,
  GetBlogQuery,
  GetBlogQueryVariables,
  GetBlogsQuery,
  GetBlogsQueryVariables,
  GetCartQuery,
  GetCartQueryVariables,
  GetCollectionsQuery,
  GetCollectionsQueryVariables,
  GetCustomerOrdersQuery,
  GetCustomerOrdersQueryVariables,
  GetCustomerQuery,
  GetCustomerQueryVariables,
  GetProductByHandleQuery,
  GetProductByHandleQueryVariables,
  GetProductByIdQuery,
  GetProductByIdQueryVariables,
  GetProductRecommendationsQuery,
  GetProductRecommendationsQueryVariables,
  GetProductsQuery,
  GetProductsQueryVariables,
  GetSingleArticleQuery,
  GetSingleArticleQueryVariables,
  GetShopInfoQuery,
} from "./generated/shopify.js";
import {
  CartBuyerIdentityUpdateDocument,
  CartCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  CartLinesUpdateDocument,
  CustomerAccessTokenCreateDocument,
  CustomerCreateDocument,
  CustomerRecoverDocument,
  CustomerUpdateDocument,
  GetAllProductTypesDocument,
  GetArticlesDocument,
  GetBlogsDocument,
  GetCartDocument,
  GetCollectionsDocument,
  GetCustomerDocument,
  GetCustomerOrdersDocument,
  GetProductByHandleDocument,
  GetProductByIdDocument,
  GetProductRecommendationsDocument,
  GetProductsDocument,
  GetSingleArticleDocument,
  GetShopInfoDocument,
} from "./generated/shopify.js";

// Export Custom Error Classes
export {
  ShopifyError,
  ShopifyNetworkError,
  ShopifyGraphQLError,
  ShopifyUserError,
  ShopifyInvalidRequestError,
} from "./utils/errors.js";

// Export Cache utilities
export {
  InMemoryCache,
  type ShopifyCache
} from "./utils/cache.js";

import { autoPaginate, type Connection } from "./utils/pagination.js";
import { verifyWebhook } from "./utils/webhooks.js";
import { CartManager } from "./helpers/CartManager.js";
import { CustomerSession } from "./helpers/CustomerSession.js";

class ShopifyStorefront {
  private client;
  constructor(config: StoreConfig) {
    this.client = new ShopifyClient(config);
  }

  /**
   * Returns a stateful CustomerSession wrapper.
   * This automatically injects the customer's access token into subsequent requests.
   * 
   * @param customerAccessToken The active access token for the logged-in customer.
   * @returns CustomerSession instance.
   */
  customer(customerAccessToken: string): CustomerSession {
    return new CustomerSession(this, customerAccessToken);
  }

  /**
   * Returns a stateful CartManager to effortlessly manage a shopping cart.
   * If a cartId is not provided, the manager will lazily create one on the first operation.
   * 
   * @param cartId An optional existing cart ID.
   * @returns CartManager instance.
   */
  cart(cartId?: string): CartManager {
    return new CartManager(this, cartId);
  }

  /**
   * Verifies the authenticity of a Shopify webhook.
   * @param rawBody The raw string/buffer payload of the webhook.
   * @param hmacHeader The X-Shopify-Hmac-Sha256 header.
   * @param secret Your Shopify API secret key.
   * @returns true if the webhook is authentic.
   */
  static verifyWebhook(rawBody: string | Buffer, hmacHeader: string, secret: string): boolean {
    return verifyWebhook(rawBody, hmacHeader, secret);
  }

  /**
   * Fetches a paginated list of products from the store.
   * @param variables Includes `first`, `after`, `last`, `before`, and `query` to control pagination and filtering.
   * @returns A promise resolving to the products connection.
   */
  async getProducts({
    first,
    last,
    after,
    before,
    query,
  }: GetProductsQueryVariables) {
    const data: GetProductsQuery = await this.client.query<GetProductsQuery>(
      GetProductsDocument,
      { first, last, after, before, query } as GetProductsQueryVariables
    );
    return data;
  }

  /**
   * Fetches a single product by its global ID.
   * @param variables The `id` of the product and optional `metafields` array.
   * @returns A promise resolving to the requested product.
   */
  async getProductById({ id, metafields }: GetProductByIdQueryVariables) {
    const data: GetProductByIdQuery =
      await this.client.query<GetProductByIdQuery>(GetProductByIdDocument, {
        id,
        metafields,
      } as GetProductByIdQueryVariables);
    return data;
  }

  /**
   * Fetches recommended products based on a given product ID.
   * @param variables The `productId` for which to fetch recommendations.
   * @returns A promise resolving to an array of recommended products.
   */
  async getProductRecommendations({
    productId,
  }: GetProductRecommendationsQueryVariables) {
    const data: GetProductRecommendationsQuery =
      await this.client.query<GetProductRecommendationsQuery>(
        GetProductRecommendationsDocument,
        { productId } as GetProductRecommendationsQueryVariables
      );
    return data;
  }

  /**
   * Fetches a single product by its handle.
   * @param variables The `handle` of the product.
   * @returns A promise resolving to the requested product.
   */
  async getProductByHandle({ handle }: GetProductByHandleQueryVariables) {
    const data: GetProductByHandleQuery =
      await this.client.query<GetProductByHandleQuery>(
        GetProductByHandleDocument,
        { handle } as GetProductByHandleQueryVariables
      );
    return data;
  }

  /**
   * Fetches a paginated list of product types available in the store.
   * @param variables Includes `first` to limit the number of types returned.
   * @returns A promise resolving to the product types connection.
   */
  async getProductTypes({ first }: GetAllProductTypesQueryVariables) {
    const data: GetAllProductTypesQuery =
      await this.client.query<GetAllProductTypesQuery>(
        GetAllProductTypesDocument,
        { first } as GetAllProductTypesQueryVariables
      );
    return data;
  }

  /**
   * Fetches a paginated list of collections from the store.
   * @param variables Includes `first` and `after` for pagination.
   * @returns A promise resolving to the collections connection.
   */
  async getCollections({ first, after }: GetCollectionsQueryVariables) {
    const data: GetCollectionsQuery =
      await this.client.query<GetCollectionsQuery>(GetCollectionsDocument, {
        first,
        after,
      } as GetCollectionsQueryVariables);
    return data;
  }

  /**
   * Creates a new customer account.
   * @param variables The customer details including `firstName`, `lastName`, `email`, `password`, `phone`, and `acceptsMarketing`.
   * @returns A promise resolving to the customer creation payload. Throws ShopifyUserError if validation fails.
   */
  async createCustomer({
    firstName,
    lastName,
    password,
    acceptsMarketing,
    email,
    phone,
  }: CustomerCreateInput) {
    const data: CustomerCreateMutation =
      await this.client.query<CustomerCreateMutation>(CustomerCreateDocument, {
        firstName,
        lastName,
        password,
        acceptsMarketing,
        email,
        phone,
        input: {
          firstName,
          lastName,
          password,
          acceptsMarketing,
          email,
          phone,
        } as CustomerCreateInput,
      } as CustomerCreateMutationVariables);
    return data;
  }

  /**
   * Authenticates a customer using their email and password to generate an access token.
   * @param variables The `email` and `password` of the customer.
   * @returns A promise resolving to the access token payload. Throws ShopifyUserError on invalid credentials.
   */
  async loginCustomer({ email, password }: CustomerAccessTokenCreateInput) {
    const data: CustomerAccessTokenCreateMutation =
      await this.client.query<CustomerAccessTokenCreateMutation>(
        CustomerAccessTokenCreateDocument,
        {
          email,
          password,
          input: {
            email,
            password,
          } as CustomerAccessTokenCreateInput,
        } as CustomerAccessTokenCreateMutationVariables
      );
    return data;
  }

  /**
   * Retrieves customer details using an active customer access token.
   * @param variables The customer access `token`.
   * @returns A promise resolving to the customer details.
   */
  async verifyCustomerToken({ token }: GetCustomerQueryVariables) {
    const data: GetCustomerQuery = await this.client.query<GetCustomerQuery>(
      GetCustomerDocument,
      { token } as GetCustomerQueryVariables
    );
    return data;
  }

  /**
   * Initiates the password recovery flow for a customer.
   * @param variables The `email` of the customer recovering their account.
   * @returns A promise resolving to the recovery payload.
   */
  async recoverCustomer({ email }: CustomerRecoverMutationVariables) {
    const data: CustomerRecoverMutation =
      await this.client.query<CustomerRecoverMutation>(
        CustomerRecoverDocument,
        { email } as CustomerRecoverMutationVariables
      );
    return data;
  }

  /**
   * Updates an existing customer's information.
   * @param variables The `customerAccessToken` and the `customer` input fields to update.
   * @returns A promise resolving to the update payload.
   */
  async updateCustomer({
    customerAccessToken,
    customer,
  }: CustomerUpdateMutationVariables) {
    const data: CustomerUpdateMutation =
      await this.client.query<CustomerUpdateMutation>(CustomerUpdateDocument, {
        customerAccessToken,
        customer,
      } as CustomerUpdateMutationVariables);
    return data;
  }

  /**
   * Retrieves an existing cart by its ID.
   * @param variables The `cartId` and optional `first` limit for lines.
   * @returns A promise resolving to the cart details.
   */
  async getCart({ cartId, first }: GetCartQueryVariables) {
    const data: GetCartQuery = await this.client.query<GetCartQuery>(
      GetCartDocument,
      { cartId, first } as GetCartQueryVariables
    );
    return data;
  }

  /**
   * Creates a new cart with optional initial line items.
   * @param variables The `input` configuration for the new cart.
   * @returns A promise resolving to the created cart payload.
   */
  async createCart({ input, first }: CartCreateMutationVariables) {
    const data: CartCreateMutation =
      await this.client.query<CartCreateMutation>(CartCreateDocument, {
        input,
        first,
      } as CartCreateMutationVariables);
    return data;
  }

  /**
   * Adds line items to an existing cart.
   * @param variables The `cartId` and the `lines` to add.
   * @returns A promise resolving to the updated cart payload.
   */
  async addCartLines({ cartId, lines }: CartLinesAddMutationVariables) {
    const data: CartLinesAddMutation =
      await this.client.query<CartLinesAddMutation>(CartLinesAddDocument, {
        cartId,
        lines,
      } as CartLinesAddMutationVariables);
    return data;
  }

  /**
   * Removes line items from an existing cart.
   * @param variables The `cartId` and the `lineIds` to remove.
   * @returns A promise resolving to the updated cart payload.
   */
  async removeCartLines({ cartId, lineIds }: CartLinesRemoveMutationVariables) {
    const data: CartLinesRemoveMutation =
      await this.client.query<CartLinesRemoveMutation>(
        CartLinesRemoveDocument,
        {
          cartId,
          lineIds,
        } as CartLinesRemoveMutationVariables
      );
    return data;
  }

  /**
   * Updates line items in an existing cart (e.g., changing quantity).
   * @param variables The `cartId`, the updated `lines`, and optional `first` limit.
   * @returns A promise resolving to the updated cart payload.
   */
  async updateCartLines({
    cartId,
    first,
    lines,
  }: CartLinesUpdateMutationVariables) {
    const data: CartLinesUpdateMutation =
      await this.client.query<CartLinesUpdateMutation>(
        CartLinesUpdateDocument,
        {
          cartId,
          first,
          lines,
        } as CartLinesUpdateMutationVariables
      );
    return data;
  }

  /**
   * Updates the buyer identity (e.g., email, customer access token) for a cart.
   * @param variables The `cartId` and the `buyerIdentity` object.
   * @returns A promise resolving to the updated cart payload.
   */
  async updateCartBuyerIdentity({
    cartId,
    buyerIdentity: {
      email,
      phone,
      preferences,
      companyLocationId,
      countryCode,
      customerAccessToken,
    },
  }: CartBuyerIdentityUpdateMutationVariables) {
    const data: CartBuyerIdentityUpdateMutation =
      await this.client.query<CartBuyerIdentityUpdateMutation>(
        CartBuyerIdentityUpdateDocument,
        {
          cartId,
          buyerIdentity: {
            email,
            phone,
            preferences,
            companyLocationId,
            countryCode,
            customerAccessToken,
          } as CartBuyerIdentityInput,
        } as CartBuyerIdentityUpdateMutationVariables
      );
    return data;
  }

  /**
   * Sets metafields on an existing cart.
   * @param variables The `metafields` array containing key-value pairs.
   * @returns A promise resolving to the updated cart payload.
   */
  async setCartMetafields({ metafields }: CartMetafieldsSetMutationVariables) {
    const data: CartMetafieldsSetMutation =
      await this.client.query<CartMetafieldsSetMutation>(
        CartBuyerIdentityUpdateDocument,
        {
          metafields,
        } as CartMetafieldsSetMutationVariables
      );
    return data;
  }

  /**
   * Fetches a paginated list of blogs from the store.
   * @param variables Includes `first` for pagination.
   * @returns A promise resolving to the blogs connection.
   */
  async getBlogs({ first }: GetBlogsQueryVariables) {
    const data: GetBlogsQuery = await this.client.query<GetBlogsQuery>(
      GetBlogsDocument,
      { first } as GetBlogsQueryVariables
    );
    return data;
  }

  /**
   * Fetches a specific blog by its handle.
   * @param variables The `handle` of the blog and `first` pagination parameter for its articles.
   * @returns A promise resolving to the requested blog.
   */
  async getBlog({ first, handle }: GetBlogQueryVariables) {
    const data: GetBlogQuery = await this.client.query<GetBlogQuery>(
      GetBlogsDocument, // Original used GetBlogsDocument here, not GetBlogDocument
      { first, handle } as GetBlogQueryVariables
    );
    return data;
  }

  /**
   * Fetches a paginated list of all articles across all blogs.
   * @param variables Includes `first` for pagination.
   * @returns A promise resolving to the articles connection.
   */
  async getArticles({ first }: GetArticlesQueryVariables) {
    const data: GetArticlesQuery = await this.client.query<GetArticlesQuery>(
      GetArticlesDocument,
      { first } as GetArticlesQueryVariables
    );
    return data;
  }

  /**
   * Fetches a single article by its handle and its parent blog's handle.
   * @param variables The `articleHandle` and `blogHandle`.
   * @returns A promise resolving to the requested article.
   */
  async getArticle({
    articleHandle,
    blogHandle,
  }: GetSingleArticleQueryVariables) {
    const data: GetSingleArticleQuery =
      await this.client.query<GetSingleArticleQuery>(GetSingleArticleDocument, {
        articleHandle,
        blogHandle,
      } as GetSingleArticleQueryVariables);
    return data;
  }

  /**
   * Fetches the order history for an authenticated customer.
   * @param variables The `customerAccessToken` and pagination limits.
   * @returns A promise resolving to the customer's orders connection.
   */
  async getCustomerOrders({
    customerAccessToken,
    first,
  }: GetCustomerOrdersQueryVariables) {
    const data: GetCustomerOrdersQuery =
      await this.client.query<GetCustomerOrdersQuery>(
        GetCustomerOrdersDocument,
        {
          customerAccessToken,
          first,
        } as GetCustomerOrdersQueryVariables
      );
    return data;
  }

  /**
   * Fetches general information about the store (name, description, payment settings).
   * @returns A promise resolving to the shop information.
   */
  async getShopInfo() {
    const data: GetShopInfoQuery = await this.client.query<GetShopInfoQuery>(
      GetShopInfoDocument,
      {}
    );
    return data;
  }

  /**
   * Executes a custom GraphQL query or mutation against the Storefront API.
   * Use this when the built-in SDK methods do not cover your specific use case.
   * 
   * @param query The raw GraphQL query or mutation string.
   * @param variables An object containing variables for the GraphQL query.
   * @returns A promise resolving to the generic requested data structure `T`.
   */
  async customQuery<T = any>(query: string, variables: object): Promise<T> {
    const data = await this.client.query<T>(query, variables);
    return data;
  }

  /**
   * Automatically fetches all pages of a Shopify GraphQL Connection and flattens the nodes into an array.
   * 
   * @param fetchPage A function that takes an optional cursor and returns a promise of the API response.
   * @param getConnection A selector function that extracts the Connection object from the API response.
   * @returns A flat array of all nodes across all pages.
   */
  async autoPaginate<TResponse, TNode>(
    fetchPage: (cursor?: string) => Promise<TResponse>,
    getConnection: (response: TResponse) => Connection<TNode> | undefined | null
  ): Promise<TNode[]> {
    return autoPaginate<TResponse, TNode>(fetchPage, getConnection);
  }
}

export default ShopifyStorefront;
