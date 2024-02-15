import { ref, effect, watch, type Ref } from "vue";
import type { CodeToHastOptions } from "shiki/core";
import { loadShiki } from "./loadShiki";

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
  code: Ref<string>,
  options: Partial<CodeToHastOptions>
) {
  if (import.meta.server) {
    const shiki = await loadShiki();
    return ref(
      shiki.codeToHtml(code.value, {
        ...shiki.$defaults,
        ...options,
      })
    );
  }

  const highlighted = ref(code.value);

  const unwatch = watch(code, () => {
    highlighted.value = code.value;
  });

  const init = () => {
    loadShiki().then((shiki) => {
      unwatch();
      effect(() => {
        highlighted.value = shiki.codeToHtml(code.value, {
          ...shiki.$defaults,
          ...options,
        });
      });
    });
  };

  init();

  return highlighted;
}
