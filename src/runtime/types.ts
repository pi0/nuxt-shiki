import type { CodeToHastOptions, HighlighterCore } from 'shiki'
import type { HighlighterCoreOptions } from 'shiki/core'

export type ShikiInstance = HighlighterCore & {
  highlight: (code: string, options: Partial<CodeToHastOptions>) => string
}

export type ShikiConfig = {
  coreOptions: HighlighterCoreOptions
  highlightOptions: CodeToHastOptions
}
