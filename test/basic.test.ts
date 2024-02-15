import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('works with api route', async () => {
    const html = await $fetch('/api/highlight')
    expect(html).include(
      `<span style="color:#24292E">console.</span><span style="color:#6F42C1">log</span>`,
    )
  })

  it('SSR works <Shiki> component', async () => {
    const html = await $fetch('/')
    expect(html).include(
      `<span style="color:#24292E">console.</span><span style="color:#6F42C1">log</span>`,
    )
  })
})
