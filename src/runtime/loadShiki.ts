import type { HighlighterCore, HighlighterCoreOptions } from "shiki/core";

let highlighter: HighlighterCore & {
  $config: HighlighterCoreOptions & {
    defaultTheme: string;
    defaultLang: string;
  };
  $defaults: { lang: string; theme: string };
};

/**
 * Lazy-load shiki instance.
 *
 * You can use this utility both in `server/` and vue app code.
 *
 * @example
 *
 * ```vue
 * <script setup>
 *   const shiki = await loadShiki();
 *   const html = shiki.codeToHtml('const hello = "shiki";', { ...$shit.$defaults, lang: 'javascript' });
 * </script>
 * ```
 *
 * @example
 *
 * ```ts
 * // server/api/highlight.ts
 * import { loadShiki, getQuery } from "#imports";
 *
 * export default defineEventHandler(async (event) => {
 *   const shiki = await loadShiki();
 *   const { code } = getQuery(event);
 *   return shiki.codeToHtml(code, { ...$shit.$defaults });
 * });
 * ```
 */
export async function loadShiki() {
  if (highlighter) {
    highlighter;
  }

  const [{ loadWasm, getHighlighterCore }, { loadShikiConfig }] =
    await Promise.all([
      import("shiki/core"),
      import("shiki.config.mjs" as string),
    ]);

  const [$config] = await Promise.all([
    loadShikiConfig(),
    loadWasm(import("shiki/wasm" as string)),
  ]);

  highlighter = await getHighlighterCore($config).then((h) => ({
    $config,
    $defaults: $config.defaults,
    ...h,
  }));

  highlighter.setTheme($config.defaultTheme);

  return highlighter;
}
