/**
 * ========================= SHOPIFY SDK TEST GUIDE =========================
 *
 * To run tests successfully, ensure the following:
 *
 * 1. Your `.env` file contains:
 *      - SHOPIFY_STORE_DOMAIN
 *      - SHOPIFY_STOREFRONT_TOKEN
 *
 * 2. Your Shopify store has at least one published product.
 *
 * 3. You have an active internet connection.
 *
 * ---------------------------------------------------------------------------
 * ABOUT THIS SDK
 * ---------------------------------------------------------------------------
 *
 * This Node.js Shopify Storefront SDK is designed to help developers build
 * storefront applications faster by providing:
 *
 * - Pre-built GraphQL queries for common Shopify operations
 *   (products, collections, carts, customer creation, blogs, articles, and more)
 * - A clean, strongly-typed API wrapper
 * - Automatic request handling + improved developer experience
 *
 * Using this SDK can speed up development by up to **30%**, reduce boilerplate,
 * and simplify communication with Shopify Storefront API.
 *
 * ---------------------------------------------------------------------------
 * This test file demonstrates how to use the SDK in real-world scenarios.
 * ============================================================================
 */

import ShopifyStoreFront from "../index.js";
import * as dotenv from "dotenv";
dotenv.config();

const { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } = process.env;

// Instantiate the SDK once
const client = new ShopifyStoreFront({
  storeUrl: String(SHOPIFY_STORE_DOMAIN),
  storefrontToken: String(SHOPIFY_STOREFRONT_TOKEN),
});

// Test function
async function runTests() {
  try {
    /**
     * the Products method gives access to enter the amount of data you need. it includes first, last,after, before and query
     */
    console.log("\n===== TEST → getProducts() =====");
    const products = await client.getProducts({ first: 10 });
    console.log(JSON.stringify(products, null, 2));

    console.log("\n===== TEST → getProductById() =====");
    const product = await client.getProductById({
      id: products?.products?.edges[0]?.node?.id ?? "",
      metafields: [],
    });
    console.log(JSON.stringify(product, null, 2));

    console.log("\n===== TEST → getProductByHandle() =====");
    const byHandle = await client.getProductByHandle({
      handle: products?.products?.edges[0]?.node?.handle ?? "",
    });
    console.log(JSON.stringify(byHandle, null, 2));

    console.log("\n===== TEST → getAllProductType() =====");
    const types = await client.getAllProductType({ first: 50 });
    console.log(JSON.stringify(types, null, 2));

    console.log("\n===== TEST → getProductTags() =====");
    const productRecommendations = await client.getProductRecommendations({
      productId: products?.products?.edges[0]?.node?.id ?? "",
    });
    console.log(JSON.stringify(productRecommendations, null, 2));

    console.log("\n===== TEST → getBlogs() =====");
    const blogs = await client.getBlogs({ first: 10 });
    console.log(JSON.stringify(blogs, null, 2));

    console.log("\n===== TEST → getBlogByHandle() =====");
    const blog = await client.getBlog({
      first: 10,
      handle: blogs?.blogs?.edges[0]?.node?.handle ?? "",
    });
    console.log(JSON.stringify(blogs, null, 2));

    console.log("\n===== TEST → getArticles() =====");
    const articles = await client.getArticles({ first: 10 });
    console.log(JSON.stringify(articles, null, 2));

    console.log("\n===== TEST → getArticles() =====");
    const article = await client.getArticle({
      blogHandle: blogs?.blogs?.edges[0]?.node?.handle ?? "",
      articleHandle: articles?.articles?.edges[0]?.node?.handle ?? "",
    });
    console.log(JSON.stringify(article, null, 2));

    console.log("\n===== TEST → userCreate() =====");
    const user = await client.createUser({
      email: "testuser@example.com",
      password: "Testing123!",
      firstName: "SDK",
      lastName: "User",
      phone: "00000000000",
    });
    console.log(JSON.stringify(user, null, 2));

    console.log("\n===== TEST → userLogin() =====");
    const userLogin = await client.loginUser({
      email: "testuser@example.com",
      password: "Testing123!",
    });
    console.log(JSON.stringify(userLogin, null, 2));

    console.log("\n===== TEST → userLoginTokenVerify() =====");
    const userLoginTokenVerify = await client.verifyUserToken({
      token: String(
        userLogin?.customerAccessTokenCreate?.customerAccessToken?.accessToken
      ),
    });
    console.log(JSON.stringify(userLoginTokenVerify, null, 2));

    console.log("\n===== TEST → cartCreate() =====");
    const cart = await client.createCart({
      input: {
        lines: [
          {
            quantity: 1,
            merchandiseId:
              products?.products?.edges[0]?.node?.variants?.edges[0]?.node
                ?.id ?? "",
          },
        ],
      },
      first: 20,
    });
    console.log(JSON.stringify(cart, null, 2));

    console.log("\n===== TEST → cartBuyerIdentity() =====");
    const buyerIdentity = await client.cartBuyerIdentityUpdate({
      cartId: String(cart?.cartCreate?.cart?.id),
      buyerIdentity: {
        customerAccessToken:
          userLogin?.customerAccessTokenCreate?.customerAccessToken
            ?.accessToken ?? "",
        email: userLoginTokenVerify?.customer?.email ?? "",
        phone: userLoginTokenVerify?.customer?.phone ?? "",
      },
    });
    console.log(JSON.stringify(buyerIdentity, null, 2));

    console.log("\n===== TEST → getCart() =====");
    const existingCart = await client.getCart({
      cartId: String(cart?.cartCreate?.cart?.id),
      first: 20,
    });
    console.log(JSON.stringify(existingCart, null, 2));

    console.log("\n===== TEST → CartLineAdd() =====");
    const addToCart = await client.cartLinesAdd({
      cartId: String(cart?.cartCreate?.cart?.id),
      lines: [
        {
          quantity: 1,
          merchandiseId:
            products?.products?.edges[0]?.node?.variants?.edges[0]?.node?.id ??
            "",
        },
      ],
    });
    console.log(JSON.stringify(addToCart, null, 2));

    console.log("\n===== TEST → CartLineUpdate() =====");
    const updatedCart = await client.cartLinesUpdate({
      cartId: String(cart?.cartCreate?.cart?.id),
      first: 20,
      lines: [
        {
          quantity: 2,
          merchandiseId:
            existingCart?.cart?.lines?.edges[0]?.node?.merchandise?.id ?? "",
          id: existingCart?.cart?.lines?.edges[0]?.node?.id ?? "",
        },
      ],
    });
    console.log(JSON.stringify(updatedCart, null, 2));

    console.log("\n===== TEST → CartLineRemove() =====");
    const removeFromCart = await client.cartLinesRemove({
      cartId: String(cart?.cartCreate?.cart?.id),
      lineIds: [String(existingCart?.cart?.lines?.edges[0]?.node?.id)],
    });
    console.log(JSON.stringify(removeFromCart, null, 2));

    console.log("\n===== TEST → requestPasswordReset() =====");
    const resetReq = await client.customerRecover({
      email: "testuser@example.com",
    });
    console.log(JSON.stringify(resetReq, null, 2));

    console.log("\n===== TEST → customerOrderList() =====");
    const orderList = await client.getCustomerOrders({
      customerAccessToken: String(
        userLogin?.customerAccessTokenCreate?.customerAccessToken?.accessToken
      ),
      first: 50,
    });
    console.log(JSON.stringify(orderList, null, 2));

    console.log("\n===== TEST → customeQuery() =====");
    const customQuery = await client.customQuery(
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
    console.log(JSON.stringify(customQuery, null, 2));

    console.log("Test completed successfully");
  } catch (error) {
    console.error("\n❌ TEST ERROR:");
    console.error(error);
  }
}

runTests();
