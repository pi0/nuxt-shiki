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

export interface ModuleOptions {
  /** Themes */
  bundledThemes?: BundledTheme[]

  /** Languages */
  bundledLangs?: BundledLanguage[]

  /** Default theme */
  defaultTheme?:
    | BundledTheme
    | Record<'dark' | 'light' | 'default' | (string & {}), BundledTheme>

  /** Default language */
  defaultLang?: BundledLanguage

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

    // (not needed after Nitro 2.9)
    addUnwasmSupport(nuxt)

    // Add component
    addComponent({
      filePath: resolver.resolve('./runtime/Shiki'),
      name: 'Shiki',
    })

    // Add imports
    addImports([
      {
        name: 'loadShiki',
        from: resolver.resolve('./runtime/loadShiki'),
      },
      {
        name: 'useHighlighted',
        from: resolver.resolve('./runtime/useHighlighted'),
      },
    ])

    addServerImports([
      {
        name: 'loadShiki',
        from: resolver.resolve('./runtime/loadShiki'),
      },
    ])

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
      typeof options.defaultTheme === 'string'
        ? {
            lang: options.defaultLang || bundledLangs[0] || 'javascript',
            theme: options.defaultTheme || bundledThemes[0] || 'min-dark',
            ...options.highlightOptions,
          }
        : {
            lang: options.defaultLang || bundledLangs[0] || 'javascript',
            themes: {
              ...options.defaultTheme,
              light: bundledThemes[0] || 'min-light',
              dark: bundledThemes[1] || bundledThemes[0] || 'min-dark',
            },
            ...options.highlightOptions,
          }

    const template = addTemplate({
      filename: 'shiki-config.mjs',
      getContents: () => {
        return `
export async function loadShikiConfig() {
  const [themes, langs] = await Promise.all([
    Promise.all([
${bundledThemes.map((theme) => `${' '.repeat(6)}import("shiki/themes/${theme}.mjs"),`).join('\n')}
    ]),
    Promise.all([
${bundledLangs.map((lang) => `${' '.repeat(6)}import("shiki/langs/${lang}.mjs"),`).join('\n')}
    ]),
  ]);
  return {
    highlightOptions: ${JSON.stringify(highlightOptions)},
    coreOptions: {
      themes,
      langs,
      langAlias: ${JSON.stringify(options.langAlias)},
    },
  };
}`
      },
    })

    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {}
    nuxt.options.nitro.virtual['shiki-config.mjs'] = template.getContents
    nuxt.options.alias['shiki-config.mjs'] = template.dst
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
