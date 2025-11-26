# Shopify Storefront SDK

A modern and lightweight Node.js + TypeScript SDK for interacting with the **Shopify Storefront API** using GraphQL.  
This SDK provides a clean wrapper around Shopify queries, mutations, cart operations, blogs, articles, products, recommendations, and more — all generated with GraphQL Codegen for full type safety.

---

## 🚀 Features

- Full **TypeScript support**
- Strongly-typed GraphQL queries & mutations
- Supports:
  - Products
  - Product by ID / handle
  - Recommendations
  - Collections
  - Blogs & Articles
  - Customer Authentication
  - Cart operations (create, update, metafields, buyer identity)
- Built-in GraphQL Client (graphql-request)
- Easy to extend
- Works in Node.js, serverless, and edge runtimes

---

## 📦 Installation

```bash
npm install shopify-storefront-sdk
```

---

## 🛠️ Setup

```ts
import ShopifyStorefront from "shopify-storefront-sdk";

const client = new ShopifyStorefront({
  storeUrl: "your-store.myshopify.com",
  storefrontToken: "your-storefront-token",
});
```

---

## 🔍 Example: Fetch Products

```ts
const products = await client.getProducts({ first: 20 });
console.log(products);
```

---

## 🛒 Example: Create Cart

```ts
const cart = await client.cartCreate({
  input: {
    lines: [
      {
        quantity: 1,
        merchandiseId: "gid://shopify/ProductVariant/12345",
      },
    ],
  },
});
```

---

## 📚 Documentation

- All queries and mutations are strongly typed.
- Refer to `/src/graphql/` for definitions.

---

## 🤝 Contributing

See `CONTRIBUTING.md` for guidelines.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If this SDK helps you, please ⭐ the repository!
# shopify_storefront_sdk
