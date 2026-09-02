import { describe, it, expect, beforeAll } from "vitest";
import ShopifyStoreFront from "../../index.js";
import * as dotenv from "dotenv";

dotenv.config();

const { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } = process.env;

// Only run these tests if the environment variables are present
const runLiveTests = !!(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);

describe.runIf(runLiveTests)("Shopify SDK Integration Tests", () => {
  let client: ShopifyStoreFront;

  // Shared state for the test chain
  let firstProductId: string;
  let firstProductHandle: string;
  let firstVariantId: string;
  
  let blogHandle: string;
  let articleHandle: string;

  let customerEmail = `testuser_${Date.now()}@example.com`;
  let customerPassword = "Testing123!";
  let customerAccessToken: string;

  let cartId: string;
  let lineItemId: string;

  beforeAll(() => {
    client = new ShopifyStoreFront({
      storeUrl: String(SHOPIFY_STORE_DOMAIN),
      storefrontToken: String(SHOPIFY_STOREFRONT_TOKEN),
    });
  });

  describe("Products & Collections", () => {
    it("should fetch products", async () => {
      const products = await client.getProducts({ first: 10 });
      expect(products).toBeDefined();
      expect(products.products?.edges).toBeInstanceOf(Array);
      
      const firstEdge = products.products?.edges[0];
      if (firstEdge) {
        firstProductId = firstEdge.node.id;
        firstProductHandle = firstEdge.node.handle;
        firstVariantId = firstEdge.node.variants?.edges[0]?.node.id || "";
      }
    });

    it("should fetch a product by ID", async () => {
      if (!firstProductId) return;
      const product = await client.getProductById({
        id: firstProductId,
        metafields: [],
      });
      expect(product?.product?.id).toBe(firstProductId);
    });

    it("should fetch a product by handle", async () => {
      if (!firstProductHandle) return;
      const product = await client.getProductByHandle({
        handle: firstProductHandle,
      });
      expect(product?.product?.handle).toBe(firstProductHandle);
    });

    it("should fetch all product types", async () => {
      const types = await client.getProductTypes({ first: 50 });
      expect(types?.products?.edges).toBeInstanceOf(Array);
    });

    it("should fetch product recommendations", async () => {
      if (!firstProductId) return;
      const recommendations = await client.getProductRecommendations({
        productId: firstProductId,
      });
      expect(recommendations?.productRecommendations).toBeInstanceOf(Array);
    });
  });

  describe("Blogs & Articles", () => {
    it("should fetch blogs", async () => {
      const blogs = await client.getBlogs({ first: 10 });
      expect(blogs?.blogs?.edges).toBeInstanceOf(Array);
      
      const firstBlog = blogs?.blogs?.edges[0]?.node;
      if (firstBlog) {
        blogHandle = firstBlog.handle;
      }
    });

    it("should fetch a specific blog", async () => {
      if (!blogHandle) return;
      const blog = await client.getBlog({ first: 10, handle: blogHandle });
      expect(blog?.blog?.handle).toBe(blogHandle);
    });

    it("should fetch articles", async () => {
      const articles = await client.getArticles({ first: 10 });
      expect(articles?.articles?.edges).toBeInstanceOf(Array);
      
      const firstArticle = articles?.articles?.edges[0]?.node;
      if (firstArticle) {
        articleHandle = firstArticle.handle;
      }
    });

    it("should fetch a specific article", async () => {
      if (!blogHandle || !articleHandle) return;
      const article = await client.getArticle({
        blogHandle: blogHandle,
        articleHandle: articleHandle,
      });
      expect(article).toBeDefined();
    });
  });

  describe("Customers", () => {
    it("should create a customer", async () => {
      const user = await client.createCustomer({
        email: customerEmail,
        password: customerPassword,
        firstName: "SDK",
        lastName: "User",
      });
      expect(user?.customerCreate?.customer?.firstName).toBe("SDK");
    });

    it("should login a customer", async () => {
      const login = await client.loginCustomer({
        email: customerEmail,
        password: customerPassword,
      });
      const token = login?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
      expect(token).toBeDefined();
      if (token) customerAccessToken = token;
    });

    it("should verify customer token", async () => {
      if (!customerAccessToken) return;
      const verify = await client.verifyCustomerToken({ token: customerAccessToken });
      expect(verify?.customer?.email).toBe(customerEmail);
    });

    it("should request customer recovery", async () => {
      const resetReq = await client.recoverCustomer({ email: customerEmail });
      expect(resetReq?.customerRecover?.customerUserErrors).toBeDefined();
    });

    it("should fetch customer orders", async () => {
      if (!customerAccessToken) return;
      const orders = await client.getCustomerOrders({
        customerAccessToken,
        first: 50,
      });
      expect(orders?.customer?.orders?.edges).toBeDefined();
    });
  });

  describe("Carts", () => {
    it("should create a cart", async () => {
      if (!firstVariantId) return;
      const cart = await client.createCart({
        input: {
          lines: [
            {
              quantity: 1,
              merchandiseId: firstVariantId,
            },
          ],
        },
        first: 20,
      });
      
      expect(cart?.cartCreate?.cart?.id).toBeDefined();
      if (cart?.cartCreate?.cart?.id) {
        cartId = cart.cartCreate.cart.id;
        lineItemId = cart.cartCreate.cart.lines?.edges[0]?.node?.id ?? "";
      }
    });

    it("should update cart buyer identity", async () => {
      if (!cartId || !customerAccessToken) return;
      const identity = await client.updateCartBuyerIdentity({
        cartId: cartId,
        buyerIdentity: {
          customerAccessToken: customerAccessToken,
          email: customerEmail,
          phone: "00000000000",
        },
      });
      expect(identity?.cartBuyerIdentityUpdate?.cart?.id).toBeDefined();
    });

    it("should fetch an existing cart", async () => {
      if (!cartId) return;
      const existingCart = await client.getCart({ cartId, first: 20 });
      expect(existingCart?.cart?.id).toBe(cartId);
    });

    it("should add lines to a cart", async () => {
      if (!cartId || !firstVariantId) return;
      const addToCart = await client.addCartLines({
        cartId,
        lines: [
          {
            quantity: 1,
            merchandiseId: firstVariantId,
          },
        ],
      });
      expect(addToCart?.cartLinesAdd?.cart?.id).toBeDefined();
    });

    it("should update lines in a cart", async () => {
      if (!cartId || !firstVariantId || !lineItemId) return;
      const updatedCart = await client.updateCartLines({
        cartId,
        first: 20,
        lines: [
          {
            id: lineItemId,
            quantity: 2,
            merchandiseId: firstVariantId,
          },
        ],
      });
      expect(updatedCart?.cartLinesUpdate?.cart?.id).toBeDefined();
    });

    it("should remove lines from a cart", async () => {
      if (!cartId || !lineItemId) return;
      const removedCart = await client.removeCartLines({
        cartId,
        lineIds: [lineItemId],
      });
      expect(removedCart?.cartLinesRemove?.cart?.id).toBeDefined();
    });
  });

  describe("Shop Info", () => {
    it("should fetch shop info using the dedicated method", async () => {
      const shopInfo = await client.getShopInfo();
      expect(shopInfo?.shop?.name).toBeDefined();
    });
  });

  describe("Custom Queries", () => {
    it("should successfully execute a custom query", async () => {
      const customQuery = await client.customQuery<any>(
        `query getShopInfo {
            shop {
              name
              description
              paymentSettings {
                currencyCode
                countryCode
                enabledPresentmentCurrencies
              }
            }
          }`,
        {}
      );
      expect(customQuery?.shop?.name).toBeDefined();
    });
  });
});
