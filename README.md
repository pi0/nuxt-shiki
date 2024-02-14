# nuxt-shiki

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/nuxt-shiki)](https://npmjs.com/package/nuxt-shiki)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-shiki)](https://npmjs.com/package/nuxt-shiki)

<!-- /automd -->

[Nuxt](https://nuxt.com/) + [Shiki](https://shiki.style/) syntax highlighter!

## Features

- Configurable themes and languages
- Full lazy loading
- Optimized integration with shiki/core

> [!IMPORTANT]
> This module is under development!

## Quick Setup

Add Nuxt module:

```bash
npx nuxi module add nuxt-shiki
```

That's it! You can now use nuxt-shiki in your Nuxt app ✨

## Utils

<!-- automd:jsdocs src=./src/runtime/index -->

### `loadShiki()`

Lazy-load shiki instance.

You can use this utility both in `server/` and vue app code.

**Example:**

```vue
<script setup>
const shiki = await loadShiki();
const html = shiki.codeToHtml("const a = 1;", { lang: "javascript" });
</script>
```

**Example:**

```ts
// server/api/highlight.ts
import { loadShiki, getQuery } from "#imports";

export default defineEventHandler(async (event) => {
  const shiki = await loadShiki();
  const { code = "// code", lang, theme } = getQuery(event);
  return shiki.codeToHtml(code, { lang, theme });
});
```

### `useHighlighted(code, options)`

Return a lazy highlighted code ref (only usable in Vue)

**Example:**

```vue
<script setup>
const code = ref('const foo = "bar";');
const highlighted = useHighlighted(code);
</script>
```

<!-- /automd -->

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```
