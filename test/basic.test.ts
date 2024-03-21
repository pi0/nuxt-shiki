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
      `"<pre class="shiki min-light" style="background-color:#ffffff;color:#24292eff" tabindex="0"><code><span class="line"><span style="color:#1976D2">console</span><span style="color:#6F42C1">.log</span><span style="color:#24292EFF">(</span><span style="color:#22863A">'hello'</span><span style="color:#24292EFF">);</span></span></code></pre>"`,
    )
  })

  it('ssr works <Shiki> component', async () => {
    const html = await $fetch('/')
    const body = html.match(/<div id="__nuxt">([\s\S]+)<\/div>/)?.[1]
    expect(body).toMatchInlineSnapshot(`"<pre><code class="shiki min-light" style="background-color:#ffffff;color:#24292eff" tabindex="0"><span class="line"><span style="color:#1976D2">console</span><span style="color:#6F42C1">.log</span><span style="color:#24292EFF">(</span><span style="color:#22863A">'hello'</span><span style="color:#24292EFF">);</span></span></code></pre></div><div id="teleports">"`)
  })

  // TODO: Client-side rendering
})
