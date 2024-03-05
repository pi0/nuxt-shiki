import type { CodeToHastOptions } from 'shiki'
import type { ShikiConfig, ShikiInstance } from './types'

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
 * ```vue
 * <script setup>
 * const shiki = await loadShiki()
 * const html = shiki.highlight(`const hello = 'shiki'`, { lang: 'js' })
 * </script>
 * ```
 *
 * @example
 * ```ts
 * // server/api/highlight.ts
 * export default defineEventHandler(async (event) => {
 *   const shiki = await loadShiki()
 *   return shiki.highlight(`const hello = 'shiki'`, { lang: 'js' })
 * })
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
      import('shiki-config.mjs' as string) as Promise<{
        loadShikiConfig: () => Promise<ShikiConfig>
      }>,
    ])

  const [$config] = await Promise.all([
    loadShikiConfig(),
    loadWasm(import('shiki/wasm' as string)),
  ])

  const highlighter = await getHighlighterCore($config.coreOptions).then(
    (h) => ({
      ...h,
      highlight: (
        code: string,
        highlightOptions: Partial<CodeToHastOptions>,
      ) => {
        return h.codeToHtml(code, {
          ...$config.highlightOptions,
          ...highlightOptions,
          lang: highlightOptions.lang || $config.highlightOptions.lang,
        })
      },
    }),
  )

  return highlighter
}
