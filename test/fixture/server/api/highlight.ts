import { getShikiHighlighter } from '#imports'

export default defineEventHandler(async () => {
  const highlighter = await getShikiHighlighter()
  return highlighter.highlight("console.log('hello');", { lang: 'js' })
})
