import type { HighlighterCore, HighlighterCoreOptions } from 'shiki/core'

type ShikiInstance = HighlighterCore & {
  $defaults: { theme: string; lang: string }
  $config: HighlighterCoreOptions & {
    defaultTheme: string
    defaultLang: string
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __nuxt_shiki__: ShikiInstance | Promise<ShikiInstance>
}

/**
 * Lazy-load shiki instance.
 *
 * You can use this utility both in `server/` and vue app code.
 *
 * @example
 *
 * ```vue
<script setup>
const shiki = await loadShiki();
const html = shiki.codeToHtml('const hello = "shiki";', {
  ...$shiki.$defaults,
  lang: "javascript",
});
</script>
 * ```
 *
 * @example
 *
 * ```ts
// server/api/highlight.ts

export default defineEventHandler(async (event) => {
  const shiki = await loadShiki();
  return shiki.codeToHtml('const hello = "shiki"', { ...$shiki.$defaults });
});
 * ```
 */
export async function loadShiki(): Promise<ShikiInstance> {
  if (globalThis.__nuxt_shiki__) {
    return globalThis.__nuxt_shiki__
  }
  globalThis.__nuxt_shiki__ = _loadShiki()
  globalThis.__nuxt_shiki__ = await globalThis.__nuxt_shiki__
  return globalThis.__nuxt_shiki__
}

async function _loadShiki(): Promise<ShikiInstance> {
  const [{ loadWasm, getHighlighterCore }, { loadShikiConfig }] =
    await Promise.all([
      import('shiki/core'),
      import('shiki-config.mjs' as string),
    ])

  const [$config] = await Promise.all([
    loadShikiConfig(),
    loadWasm(import('shiki/wasm' as string)),
  ])

  const highlighter = await getHighlighterCore($config).then((h) => ({
    $config,
    $defaults: $config.defaults,
    ...h,
  }))

  return highlighter
}
