import type { CodeToHastOptions, HighlighterCore } from 'shiki'
import type { HighlighterCoreOptions } from 'shiki/core'

export type HighlightOptions = Partial<CodeToHastOptions> & {
  /** unwrap pre > code to code */
  unwrap?: boolean
}

export type ShikiHighlighter = HighlighterCore & {
  highlight: (code: string, options: HighlightOptions) => string
}

export type ShikiOptions = {
  core: HighlighterCoreOptions
  highlight: CodeToHastOptions
}
