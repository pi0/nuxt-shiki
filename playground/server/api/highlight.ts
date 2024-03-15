import { getShikiHighlighter, getQuery } from '#imports'

export default defineEventHandler(async (event) => {
  const highlighter = await getShikiHighlighter()
  const { code = '// code', lang } = getQuery(event)
  return highlighter.highlight(code as string, { lang: lang as string })
})
