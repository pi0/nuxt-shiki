import { ref, effect, watch, type Ref } from 'vue'
import type { CodeToHastOptions } from 'shiki/core'
import { loadShiki } from './loadShiki'

/**
 * Return a lazy highlighted code ref (only usable in Vue)
 *
 * @example
 *
 * ```vue
<script setup>
const code = ref('const hello = "shiki";');
const highlighted = await useHighlighted(code);
</script>
 * ```
 */
export async function useHighlighted(
  code: string | Ref<string>,
  options: Partial<CodeToHastOptions>,
) {
  const _code = ref(code)

  if (import.meta.server) {
    const shiki = await loadShiki()
    return ref(
      shiki.codeToHtml(_code.value, {
        ...shiki.$defaults,
        ...options,
      }),
    )
  }

  const highlighted = ref(_code.value)

  const unwatch = watch(_code, () => {
    highlighted.value = _code.value
  })

  const init = () => {
    loadShiki().then((shiki) => {
      unwatch()
      effect(() => {
        highlighted.value = shiki.codeToHtml(_code.value, {
          ...shiki.$defaults,
          ...options,
        })
      })
    })
  }

  init()

  return highlighted
}
