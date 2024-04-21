import { ref, watch, toValue, type MaybeRefOrGetter } from 'vue'
import type { UseHighlightOptions, ShikiHighlighter } from './types'
import { createHighlighter } from './shiki'

/**
 * Lazy-load shiki instance.
 *
 * You can use this utility both in `server/` and vue app code.
 *
 * @example
 * ```vue
 * <script setup>
 * const highlighter = await getShikiHighlighter()
 * const html = highlighter.highlight(`const hello = 'shiki'`, { lang: 'js' })
 * </script>
 * ```
 *
 * @example
 * ```ts
 * // server/api/highlight.ts
 * export default defineEventHandler(async (event) => {
 *   const highlighter = await getShikiHighlighter()
 *   return highlighter.highlight(`const hello = 'shiki'`, { lang: 'js' })
 * })
 * ```
 */
export async function getShikiHighlighter(): Promise<ShikiHighlighter> {
  return createHighlighter(
    import('shiki-options.mjs').then((m) => m.shikiOptions),
    '_internal',
  )
}

/**
 * Return a lazy highlighted code ref (only usable in Vue)
 *
 * @example
 * ```vue
 * <script setup>
 * const code = ref(`const hello = 'shiki'`)
 * const highlighted = await useShikiHighlighted(code)
 * </script>
 * ```
 */
export async function useShikiHighlighted(
  code: MaybeRefOrGetter<string | undefined>,
  options: UseHighlightOptions = {},
) {
  if ('themes' in options && !options.themes) {
    delete options.themes
  }

  if (import.meta.server) {
    const highlighter = await getShikiHighlighter()
    return ref(highlighter.highlight(toValue(code) || '', {
      ...options,
      lang: toValue(options.lang),
      theme: toValue(options.theme),
    }))
  }

  const highlighted = ref(options.highlighted || '')
  const immediate = Boolean(highlighted.value)

  watch([
    () => toValue(code),
    () => toValue(options.lang),
    () => toValue(options.theme),
  ], async ([_code, lang, theme]) => {
    const highlighter = await getShikiHighlighter()
    highlighted.value = highlighter.highlight(_code || '', {
      ...options,
      lang,
      theme,
    })
  }, {
    immediate,
  })

  return highlighted
}
