import type { CodeToHastOptions, HighlighterCore } from 'shiki'
import type { HighlighterCoreOptions } from 'shiki/core'

export type HighlightOptions = Partial<CodeToHastOptions> & {
  /* unwrap pre > code to code */
  unwrap?: boolean
}

export type ShikiInstance = HighlighterCore & {
  highlight: (code: string, options: HighlightOptions) => string
}

export type ShikiConfig = {
  coreOptions: HighlighterCoreOptions
  highlightOptions: CodeToHastOptions
}
