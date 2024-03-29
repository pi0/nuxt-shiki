import type { HighlightOptions, ShikiHighlighter, ShikiOptions } from './types'
import { unwrapTransformer } from './transforms'

const _importShikiCore = cached(() => import('shiki/core'))
const _importWasm = cached(() => import('shiki/wasm'))

export const createHighlighter = cached<ShikiHighlighter>(
  async (_shikiOptions: MaybePromise<ShikiOptions>) => {
    const [{ getHighlighterCore }, wasm, shikiOptions] = await Promise.all([
      _importShikiCore(),
      _importWasm(),
      _shikiOptions,
    ])

    const highlighter = (await getHighlighterCore({
      ...shikiOptions.core,
      loadWasm: wasm,
    })) as ShikiHighlighter

    highlighter.highlight = (
      code: string,
      highlightOptions: HighlightOptions,
    ) => _highlight(code, highlightOptions, highlighter, shikiOptions)

    return highlighter
  },
  (args) => {
    const globalCache: Record<string, CacheStore<ShikiHighlighter>> = ((
      globalThis as any
    )['__nuxt_shiki_cache'] ??= {})
    const key: string = args[1] || 'default'
    return (globalCache[key] ??= {})
  },
)

// -- highlight util with defaults --

function _highlight(
  code: string,
  highlightOptions: HighlightOptions,
  highlighter: ShikiHighlighter,
  shikiOptions: ShikiOptions,
): string {
  return highlighter.codeToHtml(code, {
    ...shikiOptions.highlight,
    ...highlightOptions,
    lang: highlightOptions.lang || shikiOptions.highlight.lang,
    transformers: [
      ...(highlightOptions.unwrap ? [unwrapTransformer] : []),
      ...(highlightOptions.transformers || []),
    ],
  })
}

// ---- cache utils ---

type Fn<T> = (...args: any[]) => T
type MaybePromise<T> = T | Promise<T>
type CacheStore<T> = {
  promise?: T | Promise<T>
  value?: T
}
function cached<T>(
  fn: Fn<MaybePromise<T>>,
  getStore?: (args: Parameters<typeof fn>) => CacheStore<T>,
): Fn<MaybePromise<T>> {
  const _store: CacheStore<T> | undefined = getStore ? undefined : {}
  return function (...args: any[]) {
    const store = _store || getStore!(args)
    if (store.value !== undefined) {
      return store.value
    }
    if (store.promise) {
      return store.promise
    }
    const res = fn(...args)
    if (res instanceof Promise) {
      store.promise = res.then((value) => {
        store.value = value
        delete store.promise
        return value
      })
      return store.promise
    }
    return store.promise!
  }
}
