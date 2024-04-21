# nuxt-shiki

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/nuxt-shiki)](https://npmjs.com/package/nuxt-shiki)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-shiki)](https://npmjs.com/package/nuxt-shiki)

<!-- /automd -->

[Nuxt](https://nuxt.com/) + [Shiki](https://shiki.style/) syntax highlighter!

## Features

- Configurable themes and languages
- Full lazy loading with auto hydration of highlighted code
- Treeshakable and optimized integration with shiki/core

> [!IMPORTANT]
> This module is under development!

## Quick setup

Add Nuxt module:

```bash
npx nuxi module add nuxt-shiki
```

That's it! You can now use nuxt-shiki in your Nuxt app ✨

## Options

Options can be configured using `shiki` key in `nuxt.config`:

```js
export default defineNuxtConfig({
  modules: ['nuxt-shiki'],
  shiki: {
    /* shiki options */
  },
})
```

Available options:

- `bundledThemes` and `bundledLangs` can be configured to set bundled themes and languages.
- `defaultTheme` and `defaultLang` can be configured to set default theme and language.
- `dynamic` can be configured to set whether languages are dynamically loaded. (in this way, all languages will be bundled)
- `langAlias` can be configured to set language aliases.
- `highlightOptions` can be configured to set highlight defaults.

## `<Shiki>` component

You can use `<Shiki>` component to highlight code in your Vue app:

```vue
<template>
  <Shiki lang="js" code="console.log('hello');" />
</template>
```

The component will render a `pre` tag with highlighted code inside.

You can use the `as` prop to render a different tag:

```vue
<template>
  <Shiki lang="js" code="console.log('hello');" as="span" />
</template>
```

If `unwrap` prop is set to `true` or `as` is `pre`, it will automatically unwrap the code props to top level.

Additionally you can use `highlightOptions` prop to set shiki highlight options.

## Utils

<!-- automd:jsdocs src=./src/runtime/utils -->

### `getShikiHighlighter()`

Lazy-load shiki instance.

You can use this utility both in `server/` and vue app code.

**Example:**

```vue
<script setup>
const highlighter = await getShikiHighlighter()
const html = highlighter.highlight(`const hello = 'shiki'`, { lang: 'js' })
</script>
```

**Example:**

```ts
// server/api/highlight.ts
export default defineEventHandler(async (event) => {
  const highlighter = await getShikiHighlighter()
  return highlighter.highlight(`const hello = 'shiki'`, { lang: 'js' })
})
```

### `loadShikiLanguages(highlighter)`

Dynamically loading languages when options.dynamic is true.

**Example:**

```vue
<script setup>
const highlighter = await getShikiHighlighter()
await loadShikiLanguages(highlighter, "tsx", "vue");
</script>
```

### `useShikiHighlighted(code, options)`

Return a lazy highlighted code ref (only usable in Vue)

**Example:**

```vue
<script setup>
const code = ref(`const hello = 'shiki'`)
const highlighted = await useShikiHighlighted(code)
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
