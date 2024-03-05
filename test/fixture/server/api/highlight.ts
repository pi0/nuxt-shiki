import { loadShiki } from '#imports'

export default defineEventHandler(async () => {
  const shiki = await loadShiki()
  return shiki.highlight("console.log('hello');", { lang: 'js' })
})
