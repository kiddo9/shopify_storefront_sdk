# 📦 Shopify Storefront SDK (Node.js + TypeScript)

[![CI](https://github.com/kiddo9/shopify_storefront_sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/kiddo9/shopify_storefront_sdk/actions/workflows/ci.yml)

A fully typed, lightweight, and developer-friendly **Node.js SDK for the Shopify Storefront GraphQL API**.  
Built with TypeScript, designed to help developers move faster when building Shopify headless storefronts.

✔ Fully typed queries & responses  
✔ Simple, intuitive API  
✔ Pre-built operations (Products, Carts, Customers, Blogs, Articles…)  
✔ Works with Node.js, Next.js, Remix, Cloudflare Workers & more  
✔ Supports custom GraphQL queries  
✔ Automatic code generation

---

## 🔧 Installation

```bash
npm install shopify_storefront_sdk
# or
yarn add shopify_storefront_sdk
# or
pnpm add shopify_storefront_sdk

```

## 🚀 Quick Start

```ts
import ShopifyStorefront from "shopify-storefront-sdk";
// or
const { default: ShopifyStorefront } = require("shopify_storefront_sdk");

const shopify = new ShopifyStorefront({
  domain: process.env.SHOPIFY_STORE_DOMAIN!,
  token: process.env.SHOPIFY_STOREFRONT_TOKEN!,
});

// Fetch a product
const product = await client.getProductById({
  id: "id",
  metafields: [],
});

console.log(product.title);
```

---

## 📘 Features

- **Typed SDK methods**:

  - Products (ID, handle, collections)
  - Recommendations
  - Blogs & articles
  - Carts (create/get/update)
  - Customers (create, login, recovery flow)

- **Consistent error handling**
- **Supports custom queries**

---

## 🧩 SDK API Overview

### Initialize Client

```ts
const shopify = new ShopifyStorefront({
  domain: "yourstore.myshopify.com",
  token: "your-storefront-access-token",
  apiVersion: "2025-01", // Optional: defaults to 2025-01. Can be set to "unstable" or future versions.
  maxRetries: 3,         // Optional: Automatically retries on rate limits (429/503). Defaults to 3.
});
```

---

### Verify Webhooks

Easily verify incoming Shopify Webhooks using our static helper method (useful for API routes):

```ts
const isValid = ShopifyStorefront.verifyWebhook(
  rawBodyBuffer, 
  req.headers['x-shopify-hmac-sha256'], 
  process.env.SHOPIFY_WEBHOOK_SECRET
);

if (!isValid) throw new Error("Unauthorized");
```

---

### Pagination

Automatically fetch all pages of a GraphQL connection without manually managing cursors:

```ts
const allProducts = await shopify.autoPaginate(
  (cursor) => shopify.getProducts({ first: 250, after: cursor }),
  (response) => response.products
);

// allProducts is now a flat array of Product nodes!
```

### Shop Info

Retrieve general store configuration such as name, description, and currency settings:

```ts
const shop = await shopify.getShopInfo();
console.log(shop.shop.name);
```

---

### Products

#### Get product by ID

```ts
await shopify.getProductById({
  id: "id",
  metafields: [],
});
```

#### Get product by handle

```ts
await shopify.getProductByHandle({
  handle: "",
});
```

#### Recommendations

```ts
await shopify.getProductRecommendations({
  productId: "",
});
```

---

### ⚡ Advanced Caching

Repeatedly fetching the same data (like Store Info or Product details) can waste network time and hit Shopify rate limits. The SDK comes with a powerful, flexible caching layer.

```ts
import { ShopifyStorefront, InMemoryCache } from 'shopify_storefront_sdk';

const shopify = new ShopifyStorefront({
  domain: "yourstore.myshopify.com",
  token: "your-storefront-access-token",
  cache: new InMemoryCache(), // Automatically caches GraphQL Queries
  defaultCacheTtl: 60         // Cache duration in seconds (default is 60)
});

// 1st Call: Hits the network (~200ms)
const shopInfo1 = await shopify.getShopInfo(); 

// 2nd Call: Instantly returns from memory (~0ms)
const shopInfo2 = await shopify.getShopInfo(); 
```

**Note:** The SDK intelligently ignores mutations. `createCart` or `addCartLines` will *never* be cached.

You can also use your own cache (like Redis) by passing an object that matches the `ShopifyCache` interface (`get(key)`, `set(key, value, ttl)`).

---

### 🛒 Cart Manager (Recommended)

Managing a Cart manually can be tedious. The SDK includes a stateful `CartManager` that automatically handles cart creation in the background:

```ts
// Initialize with no ID to lazily create a cart, or pass an existing ID.
const cart = shopify.cart();

// Will automatically call createCart() in the background!
await cart.addLines([{ merchandiseId: "gid://...", quantity: 1 }]);

// The newly created cart ID is safely stored
console.log(cart.id); 

// Easily fetch the latest state
const state = await cart.get();
```

---

### Manual Cart Operations

#### Create a cart

```ts
await shopify.createCart({
  input: {
    lines: [
      {
        quantity: 1,
        merchandiseId: "",
      },
    ],
  },
  first: 20,
});
```

---

### 👤 Customer Session Manager

Passing the `customerAccessToken` into every method manually can be repetitive. Use the stateful `CustomerSession` to automatically bind the token to all operations for that user:

```ts
// 1. Log the customer in
const auth = await shopify.loginCustomer({ email: "...", password: "..." });
const token = auth.customerAccessTokenCreate.customerAccessToken.accessToken;

// 2. Initialize a Customer Session for that user
const session = shopify.customer(token);

// 3. Effortlessly manage their account!
const isValid = await session.verify();
const orders = await session.getOrders({ first: 10 });
await session.update({ customer: { firstName: "John" } });
```

---

## 📁 Project Structure

```
/src
  /client
  /utils
  /graphql       → .graphql operations
  /generated      → Auto-generated code
  index.ts        → SDK export
```

---

## 🛠 Development Setup

```bash
git clone https://github.com/kiddo9/shopify_storefront_sdk.git
cd shopify_storefront_sdk
npm install
```

Create a `.env` file:

```
SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=xxxx
```

---

## 🔨 Build

```bash
npm run prepare
```

Outputs:

```
dist/cjs/index.js
dist/index.js
dist/index.d.ts
```

---

## 🧪 Testing

```bash
npm run dev:test
# after build:
npm run test
```

---

## 🌐 Requirements

- Node.js 18+
- Storefront API token
- Public or development Shopify store

---

## 🤝 Contributing

Pull requests are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit & push
4. Submit a PR

---

## 📜 License

MIT License — free for commercial and personal use.

---

## ⭐ Support

If this SDK saves you time, please star ⭐ the repository—
it helps others discover it and motivates future improvements!

---

