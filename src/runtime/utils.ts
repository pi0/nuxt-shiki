import type { BundledLanguage } from 'shiki'
import { ref, watchEffect, watch, toRef, type Ref } from 'vue'
import type { HighlightOptions, ShikiHighlighter } from './types'
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
    // @ts-expect-error - import the virtual module by bare specifier so bundlers treat it as external/aliased
    import('shiki-options.mjs').then(m => (m.shikiOptions ?? (m as any).default?.shikiOptions ?? m)),
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
  code: string | undefined | Ref<string | undefined>,
  options: HighlightOptions & { highlighted?: string } = {},
) {
  const _code = toRef(code)

  if ('themes' in options && !options.themes) {
    delete options.themes
  }

  if (import.meta.server) {
    const highlighter = await getShikiHighlighter()
    return ref(highlighter.highlight(_code.value || '', options))
  }

  const highlighted = ref(options.highlighted || '')

  if (highlighted.value) {
    const unwatch = watch(_code, () => {
      unwatch()
      init()
    })
  }
  else {
    await init()
  }

  function init() {
    getShikiHighlighter().then((highlighter) => {
      watchEffect(() => {
        highlighted.value = highlighter.highlight(_code.value || '', options)
      })
    })
  }

  return highlighted
}

/**
 * Dynamically loading languages when options.dynamic is true.
 *
 * @example
 * ```vue
 * <script setup>
 * const highlighter = await getShikiHighlighter()
 * await loadShikiLanguages(highlighter, "tsx", "vue");
 * </script>
 * ```
 */
export async function loadShikiLanguages(
  highlighter: ShikiHighlighter,
  ...langs: string[]
) {
  const { bundledLanguages } = await import('shiki/langs')
  const loadedLanguages = highlighter.getLoadedLanguages()
  await Promise.all(
    langs
      .filter(lang => !loadedLanguages.includes(lang))
      .map(lang => bundledLanguages[lang as BundledLanguage])
      .filter(Boolean)
      .map(dynamicLang => new Promise<void>((resolve) => {
        dynamicLang().then((loadedLang) => {
          highlighter.loadLanguage(loadedLang).then(() => resolve())
        })
      }),
      ),
  )
}
