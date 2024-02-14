import { ref, effect, watch, type Ref } from "vue";

import { loadShiki } from "./loadShiki";

/**
 * Return a lazy highlighted code ref (only usable in Vue)
 *
 * @example
 *
 * ```vue
 * <script setup>
 * const code = ref('const foo = "bar";');
 * const highlighted = useHighlighted(code);
 * </script>
 * ```
 */
export function useHighlighted(code: Ref<string>, options) {
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
