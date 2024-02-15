import { ref, watchEffect, watch, isRef, type Ref } from 'vue'
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
  options: Partial<CodeToHastOptions> & { highlighted?: string } = {},
) {
  const _code = isRef(code) ? code : ref(code)

  if ('themes' in options && !options.themes) {
    delete options.themes // shiki bug?
  }

  if (import.meta.server) {
    const shiki = await loadShiki()
    return ref(
      shiki.codeToHtml(_code.value, {
        ...shiki.$defaults,
        ...options,
      }),
    )
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
        highlighted.value = shiki.codeToHtml(_code.value, {
          ...shiki.$defaults,
          ...options,
        })
      })
    })
  }

  return highlighted
}
