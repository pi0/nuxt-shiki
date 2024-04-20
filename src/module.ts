import {
  defineNuxtModule,
  createResolver,
  addImports,
  addTemplate,
  useNitro,
  addServerImports,
  addComponent,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { BundledLanguage, BundledTheme, CodeToHastOptions } from 'shiki'
import { name, version } from '../package.json'
import type { HighlightOptions } from './runtime/types'
import { genSafeVariableName } from 'knitwork'

export interface ModuleOptions {
  /** Themes */
  bundledThemes?: BundledTheme[]

  /** Languages */
  bundledLangs?: BundledLanguage[]

  /** Default theme */
  defaultTheme?:
    | BundledTheme
    | Record<'dark' | 'light' | (string & {}), BundledTheme>

  /** Default language */
  defaultLang?: BundledLanguage

  /** Is dynamic loading enabled */
  dynamic?: boolean

  /** Additional highlight options */
  highlightOptions?: HighlightOptions

  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, string>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'shiki',
  },
  defaults: {
    bundledLangs: ['typescript', 'javascript', 'json'],
    bundledThemes: ['min-light', 'min-dark'],
  },
  setup(options, nuxt) {
    // @ts-ignore
    const resolver = createResolver(import.meta.url)

    // (until nitro wasm support is in experimental state)
    addUnwasmSupport(nuxt)

    // Add component
    addComponent({
      filePath: resolver.resolve('./runtime/component'),
      name: 'Shiki',
    })

    // Add utils auto imports
    addImports([
      {
        name: 'getShikiHighlighter',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'useShikiHighlighted',
        from: resolver.resolve('./runtime/utils'),
      },
    ])
    addServerImports([
      {
        name: 'getShikiHighlighter',
        from: resolver.resolve('./runtime/utils'),
      },
    ])

    if (options.dynamic) {
      addImports([
        {
          name: 'loadShikiLanguages',
          from: resolver.resolve('./runtime/utils'),
        }
      ])
      addServerImports([
        {
          name: 'loadShikiLanguages',
          from: resolver.resolve('./runtime/utils'),
        }
      ])
    }

    // Shiki config
    const bundledThemes = Array.from(
      new Set([
        ...(options.bundledThemes || []),
        ...(typeof options.defaultTheme === 'string'
          ? [options.defaultTheme]
          : Object.values(options.defaultTheme || {})),
      ]),
    ).filter(Boolean)

    const bundledLangs = Array.from(
      new Set([...(options.bundledLangs || []), options.defaultLang]),
    ).filter(Boolean)

    const highlightOptions: CodeToHastOptions =
      !options.defaultTheme || typeof options.defaultTheme === 'string'
        ? {
            lang: options.defaultLang || bundledLangs[0] || 'javascript',
            theme: options.defaultTheme || bundledThemes[0] || 'min-dark',
            ...options.highlightOptions,
          }
        : {
            lang: options.defaultLang || bundledLangs[0] || 'javascript',
            themes: {
              ...options.defaultTheme,
              light:
                options.defaultTheme.light || bundledThemes[0] || 'min-light',
              dark:
                options.defaultTheme.dark ||
                bundledThemes[1] ||
                bundledThemes[0] ||
                'min-dark',
            },
            ...options.highlightOptions,
          }

    const template = addTemplate({
      filename: 'shiki-options.mjs',
      getContents: () => {
        return /* js */ `
${bundledThemes.map((theme) => /* js */ `import { default as _theme_${genSafeVariableName(theme)} } from "shiki/themes/${theme}.mjs";`).join('\n')}
${bundledLangs.map((lang) => /* js */ `import { default as _lang_${genSafeVariableName(lang!)} } from "shiki/langs/${lang}.mjs";`).join('\n')}

export const shikiOptions = {
  highlight: ${JSON.stringify(highlightOptions, null, 2)},
  core: {
    themes: [${bundledThemes.map((theme) => `_theme_${genSafeVariableName(theme)}`).join(', ')}],
    langs: [${bundledLangs.map((lang) => `_lang_${genSafeVariableName(lang!)}`).join(', ')}],
    langAlias: ${JSON.stringify(options.langAlias)},
  },
};
`
      },
    })

    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {}
    nuxt.options.nitro.virtual['shiki-options.mjs'] = template.getContents
    nuxt.options.alias['shiki-options.mjs'] = template.dst
  },
})

function addUnwasmSupport(nuxt: Nuxt) {
  nuxt.hook('ready', () => {
    const nitro = useNitro()
    const addWasmSupport = (_nitro: typeof nitro) => {
      if (nitro.options.experimental?.wasm) {
        return
      }
      _nitro.options.externals = _nitro.options.externals || {}
      _nitro.options.externals.inline = _nitro.options.externals.inline || []
      _nitro.options.externals.inline.push((id) => id.endsWith('.wasm'))
      _nitro.options.exportConditions!.push('unwasm')
      _nitro.options.externals.traceInclude!.push('shiki/dist/core.mjs')
      _nitro.hooks.hook('rollup:before', async (_, rollupConfig) => {
        const { rollup: unwasm } = await import('unwasm/plugin')
        rollupConfig.plugins = rollupConfig.plugins || []
        ;(rollupConfig.plugins as any[]).push(
          unwasm({
            ...(_nitro.options.wasm as any),
          }),
        )
      })
    }
    addWasmSupport(nitro)
    nitro.hooks.hook('prerender:init', (prerenderer) => {
      addWasmSupport(prerenderer)
    })
  })
}
