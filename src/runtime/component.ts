import { defineComponent, h, ref, getCurrentInstance } from 'vue'
import type { PropType, Ref } from 'vue'
import { useShikiHighlighted } from './utils'
import type { BundledLanguage } from 'shiki'
import type { UseHighlightOptions } from './types'

export default defineComponent({
  props: {
    code: String,
    lang: String as PropType<BundledLanguage>,
    highlightOptions: Object as PropType<UseHighlightOptions>,
    as: { type: String, default: 'pre' },
    unwrap: { type: Boolean, default: undefined },
  },
  async setup(props) {
    const el = ref() as Ref<HTMLElement>

    const hydratedCode = process.client
      ? getCurrentInstance()?.vnode?.el?.innerHTML
      : undefined

    const highlighted = await useShikiHighlighted(() => props.code, {
      lang: () => props.lang,
      highlighted: hydratedCode,
      unwrap: props.unwrap ?? props.as === 'pre',
      ...props.highlightOptions,
    })

    return { el, highlighted }
  },
  render() {
    return h(this.as, {
      innerHTML: this.highlighted,
      ref: 'el',
    })
  },
})
