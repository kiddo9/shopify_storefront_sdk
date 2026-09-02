import ShopifyStorefront, { InMemoryCache } from "shopify_storefront_sdk";

/**
 * Example: A simple Node.js script fetching products and managing a cart.
 */
async function run() {
  // 1. Initialize the SDK with the Advanced Cache
  const shopify = new ShopifyStorefront({
    storeUrl: process.env.SHOPIFY_STORE_DOMAIN!,
    storefrontToken: process.env.SHOPIFY_STOREFRONT_TOKEN!,
    cache: new InMemoryCache(),
    defaultCacheTtl: 60, // Cache read-queries for 1 minute
    maxRetries: 3,       // Auto-retry on rate limits (429)
  });

  console.log("Fetching Shop Info...");
  const shopInfo = await shopify.getShopInfo();
  console.log(`Connected to: ${shopInfo.shop.name}`);

  console.log("\nFetching Products...");
  const products = await shopify.getProducts({ first: 5 });
  products.products.edges.forEach((edge) => {
    console.log(`- ${edge.node.title}`);
  });

  console.log("\nManaging Cart...");
  // 2. Effortlessly create and manage a cart
  const cart = shopify.cart(); 
  
  console.log("Adding lines to new cart...");
  // This will lazily create the cart under-the-hood!
  await cart.addLines([{ merchandiseId: "gid://shopify/ProductVariant/123456789", quantity: 1 }]);
  
  console.log(`Successfully created cart with ID: ${cart.id}`);
}

run().catch(console.error);
