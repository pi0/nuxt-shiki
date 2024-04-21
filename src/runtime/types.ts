import type { MaybeRefOrGetter } from 'vue'
import type { BundledLanguage, BundledTheme, CodeToHastOptions, HighlighterCore } from 'shiki'
import type { HighlighterCoreOptions } from 'shiki/core'

export type HighlightOptions = Partial<CodeToHastOptions> & {
  /** unwrap pre > code to code */
  unwrap?: boolean
}

export type UseHighlightOptions = Omit<HighlightOptions, 'lang' | 'theme'> & {
  highlighted?: string
  lang?: MaybeRefOrGetter<BundledLanguage | undefined>
  theme?: MaybeRefOrGetter<BundledTheme | undefined>
}

export type ShikiHighlighter = HighlighterCore & {
  highlight: (code: string, options: HighlightOptions) => string
}

export type ShikiOptions = {
  core: HighlighterCoreOptions
  highlight: CodeToHastOptions
}
