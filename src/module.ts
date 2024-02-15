import {
  defineNuxtModule,
  createResolver,
  addImports,
  addTemplate,
  useNitro,
  addServerImports,
  addComponent,
} from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";
import type { BundledLanguage, BundledTheme } from "shiki";
import { name, version } from "../package.json";

export interface ModuleOptions {
  /** Themes */
  themes: BundledTheme[];
  /** Languages */
  langs: BundledLanguage[];
  /** Default theme */
  theme: BundledTheme;
  /** Default language */
  lang: BundledLanguage;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "shiki",
  },
  defaults: {
    themes: [],
    langs: [],
    theme: "github-light",
    lang: "javascript",
  },
  setup(options, nuxt) {
    // @ts-ignore
    const resolver = createResolver(import.meta.url);

    // (not needed after Nitro 2.9)
    addUnwasmSupport(nuxt);

    // Add component
    addComponent({
      filePath: resolver.resolve("./runtime/Shiki.vue"),
      name: "Shiki",
    });

    // Add imports
    addImports([
      {
        name: "loadShiki",
        from: resolver.resolve("./runtime/loadShiki"),
      },
      {
        name: "useHighlighted",
        from: resolver.resolve("./runtime/useHighlighted"),
      },
    ]);

    addServerImports([
      {
        name: "loadShiki",
        from: resolver.resolve("./runtime/loadShiki"),
      },
    ]);

    // Shiki config
    const themes = Array.from(new Set([options.theme, ...options.themes]));
    const langs = Array.from(new Set([options.lang, ...options.langs]));

    // Add config template
    const template = addTemplate({
      filename: "shiki-config.mjs",
      getContents: () => {
        return `
export async function loadShikiConfig() {
  return {
    defaults: {
      lang: "${options.lang}",
      theme: "${options.theme}",
    },
    themes: await Promise.all([
      ${themes
        .map((theme) => `import("shiki/themes/${theme}.mjs"),`)
        .join("\n")}
    ]),
    langs: await Promise.all([
      ${langs.map((lang) => `import("shiki/langs/${lang}.mjs"),`).join("\n")}
    ]),
  };
}`;
      },
    });
    // TODO: It shouldn't be this hard to have a shared/working virtual module
    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {};
    nuxt.options.nitro.virtual["shiki-config.mjs"] = template.getContents;
    if (!nuxt.options.dev) {
      nuxt.options.alias["shiki-config.mjs"] = "#build/shiki-config.mjs";
    }
  },
});

function addUnwasmSupport(nuxt: Nuxt) {
  nuxt.hook("ready", () => {
    const nitro = useNitro();
    const addWasmSupport = (_nitro: typeof nitro) => {
      if (nitro.options.experimental?.wasm) {
        return;
      }
      _nitro.options.externals = _nitro.options.externals || {};
      _nitro.options.externals.inline = _nitro.options.externals.inline || [];
      _nitro.options.externals.inline.push((id) => id.endsWith(".wasm"));
      _nitro.hooks.hook("rollup:before", async (_, rollupConfig) => {
        const { rollup: unwasm } = await import("unwasm/plugin");
        rollupConfig.plugins = rollupConfig.plugins || [];
        (rollupConfig.plugins as any[]).push(
          unwasm({
            ...(_nitro.options.wasm as any),
          })
        );
      });
    };
    addWasmSupport(nitro);
    nitro.hooks.hook("prerender:init", (prerenderer) => {
      addWasmSupport(prerenderer);
    });
  });
}
