import { defineComponent, h, ref, toRef, getCurrentInstance } from 'vue'
import type { PropType, Ref } from 'vue'
import { useHighlighted } from '#imports'
import type { BundledLanguage, CodeToHastOptions } from 'shiki'

export default defineComponent({
  props: {
    code: String,
    lang: String as PropType<BundledLanguage>,
    highlightOptions: Object as PropType<Partial<CodeToHastOptions>>,
    as: { type: String, default: 'div' },
  },
  async setup(props) {
    const el = ref() as Ref<HTMLElement>

    const hydratedCode = process.client
      ? getCurrentInstance()?.vnode?.el?.innerHTML
      : undefined

    const highlighted = await useHighlighted(toRef(props, 'code'), {
      lang: props.lang,
      highlighted: hydratedCode,
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
