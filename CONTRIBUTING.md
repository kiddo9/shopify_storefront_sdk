# Contributing Guide

Thank you for considering contributing to the Shopify Storefront SDK!

We welcome all community involvement from bug fixes to new features.

---

## 🧪 1. Clone & Install

```bash
git clone https://github.com/kiddo9/shopify_storefront_sdk.git
cd shopify_storefront_sdk
npm install
```

---

## 🧱 2. Build the Project

```bash
npm run build
```

---

## 🧪 3. Run Tests

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Shopify credentials to the `.env` file.
3. Run the tests:
   ```bash
   npm test
   ```

---

## 🌱 4. Create a New Branch

Follow this naming format:

```
feat/my-feature
fix/bug-name
chore/update-readme
```

---

## 🔀 5. Submit a Pull Request

- Go to GitHub → “Create Pull Request”
- Describe your change clearly
- Link issues if applicable
- Ensure the GitHub Actions CI passes

---

## 🧹 6. Code Style

- Use Prettier and ESLint
- Write TypeScript (not JS)
- Commit messages must be clear

---

## 🤝 Thanks for contributing!
