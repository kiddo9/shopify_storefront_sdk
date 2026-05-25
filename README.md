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
});
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

### Carts

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

```

```
