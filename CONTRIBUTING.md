# Contributing Guide

Thank you for considering contributing to the Shopify Storefront SDK! We welcome all community involvement from bug fixes to new features.

---

## 🏛️ Core Philosophy (The 5 Pillars)
Before writing code, please understand the SDK's architecture:
1. **Core Operations First**: We only wrap the core API natively (Products, Carts, Customers). We use `customQuery()` as an escape hatch for edge cases.
2. **Strict Type Safety**: Types are generated via GraphQL codegen, *never* manually written.
3. **Extreme Simplicity**: Minimal configuration and predictable `Verb-Noun` method naming (e.g., `createCart`, `updateCustomer`).
4. **Zero-Friction Extensibility**: `customQuery` is a first-class citizen.
5. **Open Source Centric**: Developer-friendly and highly documented.

---

## 🧪 1. Local Setup

```bash
git clone https://github.com/kiddo9/shopify_storefront_sdk.git
cd shopify_storefront_sdk
npm install
```

---

## ✍️ 2. Modifying the API (GraphQL Codegen)
**CRITICAL:** Do **NOT** manually edit `src/generated/shopify.ts`.

If you need to add a new Shopify API operation:
1. Add your query/mutation to `src/graphql/shopify.graphql`.
2. Run the code generator:
   ```bash
   npm run codegen
   ```
3. Add your strongly-typed wrapper method to `src/index.ts`.
4. Include TSDoc (`/** ... */`) comments for your new method.

---

## 🧪 3. Run Tests

We use Vitest. All PRs must include unit tests.

1. **Unit Tests** (Fast, Mocked):
   ```bash
   npm run test:unit
   ```
2. **Integration Tests** (Live):
   Create a `.env` file with `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN`.
   ```bash
   npm run test:integration
   ```

---

## 🧱 4. Build the Project

Ensure both ESM and CommonJS modules compile successfully:
```bash
npm run build
```

---

## 🌱 5. Create a New Branch

Follow this naming format:
```
feat/my-feature
fix/bug-name
docs/update-readme
```

---

## 🔀 6. Submit a Pull Request

- Ensure the GitHub Actions CI passes.
- Use the provided PR template.
- Link any relevant issues.

Thank you for your time and code!
