import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-shiki', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
  })

  it('works with api route', async () => {
    const html = await $fetch('/api/highlight')
    expect(html).toMatchInlineSnapshot(
      `"<pre class="shiki shiki-themes min-light min-dark" style="background-color:#ffffff;--shiki-dark-bg:#1f1f1f;color:#24292eff;--shiki-dark:#b392f0" tabindex="0"><code><span class="line"><span style="color:#1976D2;--shiki-dark:#79B8FF">console</span><span style="color:#6F42C1;--shiki-dark:#B392F0">.log</span><span style="color:#24292EFF;--shiki-dark:#B392F0">(</span><span style="color:#22863A;--shiki-dark:#FFAB70">'hello'</span><span style="color:#24292EFF;--shiki-dark:#B392F0">);</span></span></code></pre>"`,
    )
  })

  it('ssr works <Shiki> component', async () => {
    const html = await $fetch('/')
    const body = html.match(/<div id="__nuxt">([\s\S]+)<\/div>/)?.[1]
    expect(body).toMatchInlineSnapshot(`"<pre><code class="shiki shiki-themes min-light min-dark" style="background-color:#ffffff;--shiki-dark-bg:#1f1f1f;color:#24292eff;--shiki-dark:#b392f0" tabindex="0"><span class="line"><span style="color:#1976D2;--shiki-dark:#79B8FF">console</span><span style="color:#6F42C1;--shiki-dark:#B392F0">.log</span><span style="color:#24292EFF;--shiki-dark:#B392F0">(</span><span style="color:#22863A;--shiki-dark:#FFAB70">'hello'</span><span style="color:#24292EFF;--shiki-dark:#B392F0">);</span></span></code></pre>"`)
  })

  // TODO: Client-side rendering
})
