import { loadShiki, getQuery } from '#imports'

export default defineEventHandler(async (event) => {
  const shiki = await loadShiki()
  const { code = '// code', lang, theme } = getQuery(event)
  return shiki.codeToHtml(code, { lang, theme })
})
