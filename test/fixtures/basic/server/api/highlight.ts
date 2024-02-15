import { loadShiki } from '#imports'

export default defineEventHandler(async () => {
  const shiki = await loadShiki()
  return shiki.codeToHtml("console.log('hello');", { ...shiki.$defaults })
})
