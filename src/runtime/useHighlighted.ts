import { ref, watchEffect, watch, toRef, type Ref } from 'vue'
import { loadShiki } from './loadShiki'
import type { HighlightOptions } from './types'

/**
 * Return a lazy highlighted code ref (only usable in Vue)
 *
 * @example
 * ```vue
 * <script setup>
 * const code = ref(`const hello = 'shiki'`)
 * const highlighted = await useHighlighted(code)
 * </script>
 * ```
 */
export async function useHighlighted(
  code: string | Ref<string>,
  options: HighlightOptions & { highlighted?: string } = {},
) {
  const _code = toRef(code)

  if ('themes' in options && !options.themes) {
    delete options.themes // shiki bug?
  }

  if (import.meta.server) {
    const shiki = await loadShiki()
    return ref(shiki.highlight(_code.value, options))
  }

  const highlighted = ref(options.highlighted || '')

  if (highlighted.value) {
    const unwatch = watch(_code, () => {
      unwatch()
      init()
    })
  } else {
    await init()
  }

  function init() {
    loadShiki().then((shiki) => {
      watchEffect(() => {
        highlighted.value = shiki.highlight(_code.value, options)
      })
    })
  }

  return highlighted
}
