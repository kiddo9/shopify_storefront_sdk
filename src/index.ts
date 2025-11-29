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
  GetSingleArticleQueryVariables,
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
} from "./generated/shopify.js";

class ShopifyStorefront {
  private client;
  constructor(config: StoreConfig) {
    this.client = new ShopifyClient(config);
  }

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

  async getProductById({ id, metafields }: GetProductByIdQueryVariables) {
    const data: GetProductByIdQuery =
      await this.client.query<GetProductByIdQuery>(GetProductByIdDocument, {
        id,
        metafields,
      } as GetProductByIdQueryVariables);
    return data;
  }

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

  async getProductByHandle({ handle }: GetProductByHandleQueryVariables) {
    const data: GetProductByHandleQuery =
      await this.client.query<GetProductByHandleQuery>(
        GetProductByHandleDocument,
        { handle } as GetProductByHandleQueryVariables
      );
    return data;
  }

  async getAllProductType({ first }: GetAllProductTypesQueryVariables) {
    const data: GetAllProductTypesQuery =
      await this.client.query<GetAllProductTypesQuery>(
        GetAllProductTypesDocument,
        { first } as GetAllProductTypesQueryVariables
      );
    return data;
  }

  async getCollections({ first, after }: GetCollectionsQueryVariables) {
    const data: GetCollectionsQuery =
      await this.client.query<GetCollectionsQuery>(GetCollectionsDocument, {
        first,
        after,
      } as GetCollectionsQueryVariables);
    return data;
  }

  async createUser({
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

  async loginUser({ email, password }: CustomerAccessTokenCreateInput) {
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

  async verifyUserToken({ token }: GetCustomerQueryVariables) {
    const data: GetCustomerQuery = await this.client.query<GetCustomerQuery>(
      GetCustomerDocument,
      { token } as GetCustomerQueryVariables
    );
    return data;
  }

  async customerRecover({ email }: CustomerRecoverMutationVariables) {
    const data: CustomerRecoverMutation =
      await this.client.query<CustomerRecoverMutation>(
        CustomerRecoverDocument,
        { email } as CustomerRecoverMutationVariables
      );
    return data;
  }

  async customerUpdate({
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

  async getCart({ cartId, first }: GetCartQueryVariables) {
    const data: GetCartQuery = await this.client.query<GetCartQuery>(
      GetCartDocument,
      { cartId, first } as GetCartQueryVariables
    );
    return data;
  }

  async createCart({ input, first }: CartCreateMutationVariables) {
    const data: CartCreateMutation =
      await this.client.query<CartCreateMutation>(CartCreateDocument, {
        input,
        first,
      } as CartCreateMutationVariables);
    return data;
  }

  async cartLinesAdd({ cartId, lines }: CartLinesAddMutationVariables) {
    const data: CartLinesAddMutation =
      await this.client.query<CartLinesAddMutation>(CartLinesAddDocument, {
        cartId,
        lines,
      } as CartLinesAddMutationVariables);
    return data;
  }

  async cartLinesRemove({ cartId, lineIds }: CartLinesRemoveMutationVariables) {
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

  async cartLinesUpdate({
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

  async cartBuyerIdentityUpdate({
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

  async cartMetafieldsSet({ metafields }: CartMetafieldsSetMutationVariables) {
    const data: CartMetafieldsSetMutation =
      await this.client.query<CartMetafieldsSetMutation>(
        CartBuyerIdentityUpdateDocument,
        {
          metafields,
        } as CartMetafieldsSetMutationVariables
      );
    return data;
  }

  async getBlogs({ first }: GetBlogsQueryVariables) {
    const data: GetBlogsQuery = await this.client.query<GetBlogsQuery>(
      GetBlogsDocument,
      {
        first,
      } as GetBlogsQueryVariables
    );
    return data;
  }

  async getBlog({ first, handle }: GetBlogQueryVariables) {
    const data: GetBlogQuery = await this.client.query<GetBlogQuery>(
      GetBlogsDocument,
      {
        first,
        handle,
      } as GetBlogQueryVariables
    );
    return data;
  }

  async getArticles({ first }: GetArticlesQueryVariables) {
    const data: GetArticlesQuery = await this.client.query<GetArticlesQuery>(
      GetArticlesDocument,
      {
        first,
      } as GetArticlesQueryVariables
    );
    return data;
  }

  async getArticle({
    blogHandle,
    articleHandle,
  }: GetSingleArticleQueryVariables) {
    const data: GetArticlesQueryVariables =
      await this.client.query<GetArticlesQueryVariables>(
        GetSingleArticleDocument,
        { blogHandle, articleHandle } as GetSingleArticleQueryVariables
      );
    return data;
  }

  async getCustomerOrders({
    customerAccessToken,
    first,
  }: GetCustomerOrdersQueryVariables) {
    const data: GetCustomerOrdersQuery =
      await this.client.query<GetCustomerOrdersQuery>(
        GetCustomerOrdersDocument,
        { customerAccessToken, first } as GetCustomerOrdersQueryVariables
      );
    return data;
  }

  async customQuery(query: string, variables: object) {
    const data = await this.client.query(query, variables);
    return data;
  }
}

export default ShopifyStorefront;

if (typeof module !== "undefined") {
  module.exports = ShopifyStorefront;
}
