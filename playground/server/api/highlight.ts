import { loadShiki, getQuery } from '#imports'

export default defineEventHandler(async (event) => {
  const shiki = await loadShiki()
  const { code = '// code', lang } = getQuery(event)
  return shiki.highlight(code as string, { lang: lang as string })
})
