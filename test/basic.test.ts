import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

describe("ssr", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
  });

  it("works with api route", async () => {
    const html = await $fetch("/api/highlight");
    expect(html).toMatchInlineSnapshot(`"<pre class="shiki github-light" style="background-color:#fff;color:#24292e" tabindex="0"><code><span class="line"><span style="color:#24292E">console.</span><span style="color:#6F42C1">log</span><span style="color:#24292E">(</span><span style="color:#032F62">'hello'</span><span style="color:#24292E">);</span></span></code></pre>"`);
  });

  it("works with <Shiki> component", async () => {
    const html = await $fetch("/");
    expect(html).toMatchInlineSnapshot(`
      "<!DOCTYPE html><html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="modulepreload" as="script" crossorigin href="/_nuxt/entry.BgjzQcPJ.js">
      <link rel="prefetch" as="script" crossorigin href="/_nuxt/core.BVsSBdSL.js">
      <link rel="prefetch" as="script" crossorigin href="/_nuxt/shiki-config.C-PKrRHa.js">
      <link rel="prefetch" as="script" crossorigin href="/_nuxt/wasm.DLHuTH8N.js">
      <link rel="prefetch" as="script" crossorigin href="/_nuxt/error-404.BFhwjAj0.js">
      <link rel="prefetch" as="script" crossorigin href="/_nuxt/vue.f36acd1f.Q0sDdZPV.js">
      <link rel="prefetch" as="script" crossorigin href="/_nuxt/error-500.bRTvPcYl.js">
      <script type="module" src="/_nuxt/entry.BgjzQcPJ.js" crossorigin></script></head><body><div id="__nuxt"><!--[--><!-- eslint-disable-next-line --><div></div><!--]--></div><script type="application/json" id="__NUXT_DATA__" data-ssr="true">[["Reactive",1],{"data":2,"state":3,"once":4,"_errors":5,"serverRendered":6,"path":7},{},{},["Set"],{},true,"/"]</script>
      <script>window.__NUXT__={};window.__NUXT__.config={public:{},app:{baseURL:"/",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script></body></html>"
    `);
  });
});
