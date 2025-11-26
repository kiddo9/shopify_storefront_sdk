import ShopifyStorefront from "../src/index.js";
import dotenv from "dotenv";
dotenv.config();

const { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } = process.env;

// Instantiate the SDK once
const client = new ShopifyStorefront({
  storeUrl: String(SHOPIFY_STORE_DOMAIN),
  storefrontToken: String(SHOPIFY_STOREFRONT_TOKEN),
});

async function runTests() {
  try {
    console.log("\n===== TEST → getProducts() =====");
    const products = await client.getProducts({ first: 10 });
    console.log(JSON.stringify(products, null, 2));

    console.log("\n===== TEST → getProductById() =====");
    const product = await client.getProductById({
      id: "gid://shopify/Product/1234567890",
      metafields: [],
    });
    console.log(JSON.stringify(product, null, 2));

    console.log("\n===== TEST → getProductByHandle() =====");
    const byHandle = await client.getProductByHandle({
      handle: "example-product",
    });
    console.log(JSON.stringify(byHandle, null, 2));

    console.log("\n===== TEST → getAllProductType() =====");
    const types = await client.getAllProductType({ first: 50 });
    console.log(JSON.stringify(types, null, 2));

    // console.log("\n===== TEST → getProductTags() =====");
    // const tags = await client.getProductTags({ first: 50 });
    // console.log(JSON.stringify(tags, null, 2));

    console.log("\n===== TEST → getBlogs() =====");
    const blogs = await client.getBlogs({ first: 10 });
    console.log(JSON.stringify(blogs, null, 2));

    console.log("\n===== TEST → getArticles() =====");
    const articles = await client.getArticles({ first: 10 });
    console.log(JSON.stringify(articles, null, 2));

    console.log("\n===== TEST → cartCreate() =====");
    const cart = await client.createCart({
      input: {
        lines: [
          {
            quantity: 1,
            merchandiseId: "gid://shopify/ProductVariant/1234567890",
          },
        ],
      },
      first: 20,
    });
    console.log(JSON.stringify(cart, null, 2));

    console.log("\n===== TEST → getCart() =====");
    const existingCart = await client.getCart({
      cartId: String(cart?.cartCreate?.cart?.id),
      first: 20,
    });
    console.log(JSON.stringify(existingCart, null, 2));

    console.log("\n===== TEST → userCreate() =====");
    const user = await client.createUser({
      email: "testuser@example.com",
      password: "Testing123!",
      firstName: "SDK",
      lastName: "User",
    });
    console.log(JSON.stringify(user, null, 2));

    console.log("\n===== TEST → requestPasswordReset() =====");
    const resetReq = await client.customerRecover({
      email: "testuser@example.com",
    });
    console.log(JSON.stringify(resetReq, null, 2));

    console.log("\n===== TEST → verifyCustomerToken() =====");
    const verifyToken = await client.verifyUserToken({
      token: "paste-real-token-here",
    });
    console.log(JSON.stringify(verifyToken, null, 2));
  } catch (error) {
    console.error("\n❌ TEST ERROR:");
    console.error(error);
  }
}

runTests();
