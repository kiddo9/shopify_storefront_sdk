# 📦 Shopify Storefront SDK (Node.js + TypeScript)

A fully typed, lightweight, and developer-friendly **Node.js SDK for the Shopify Storefront GraphQL API**.  
Built with TypeScript, GraphQL Codegen, and graphql-request — designed to help developers move faster when building Shopify headless storefronts.

✔ Fully typed queries & responses  
✔ Simple, intuitive API  
✔ Pre-built operations (Products, Carts, Customers, Blogs, Articles…)  
✔ Works with Node.js, Next.js, Remix, Cloudflare Workers & more  
✔ Supports custom GraphQL queries  
✔ Automatic code generation

---

## 🔧 Installation

```bash
npm install shopify-storefront-sdk
# or
yarn add shopify-storefront-sdk
# or
pnpm add shopify-storefront-sdk

```

## 🚀 Quick Start

```ts
import { ShopifyStorefront } from "shopify-storefront-sdk";

const shopify = new ShopifyStorefront({
  domain: process.env.SHOPIFY_STORE_DOMAIN!,
  token: process.env.SHOPIFY_STOREFRONT_TOKEN!,
});

// Fetch a product
const product = await shopify.getProductById(
  "gid://shopify/Product/1234567890"
);

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

- **GraphQL Codegen built in**
- **Consistent error handling**
- **Supports custom queries**
- **Zero heavy dependencies**

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
await shopify.getProductById(productId);
```

#### Get product by handle

```ts
await shopify.getProductByHandle("my-product");
```

#### Recommendations

```ts
await shopify.getProductRecommendations(productId);
```

---

### Carts

#### Create a cart

```ts
await shopify.createCart({
  lines: [{ merchandiseId: "...", quantity: 1 }],
});
```

#### Get cart

```ts
await shopify.getCart(cartId);
```

---

### Customers

```ts
await shopify.createCustomer({ email, password });
await shopify.sendResetEmail(email);
await shopify.verifyToken(token);
```

---

### Blogs & Articles

```ts
await shopify.getBlog("news", 10);
```

---

## 📁 Project Structure

```
/src
  /queries        → .graphql operations
  /generated      → Auto-generated code
  index.ts        → SDK export

/codegen.yml       → Codegen config
/schema.graphql    → Shopify schema
```

---

## 🛠 Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/shopify-storefront-sdk.git
cd shopify-storefront-sdk
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
npm run build
```

Outputs:

```
dist/index.js
dist/index.cjs
dist/index.d.ts
```

---

## 🧪 Testing

```bash
npm run dev
# after build:
npm run test
```

---

## 🧬 Code Generation

Regenerate types & operations:

```bash
npm run generate
```

Scans:

```
src/queries/*.graphql
schema.graphql
```

Generates:

```
src/generated/
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

If you want, I can also generate:

✅ Better badges (npm version, downloads, license, TypeScript)
✅ CONTRIBUTING.md
✅ API documentation table
✅ Full GitHub project template (issues, PR templates, workflows)
```

```

```
