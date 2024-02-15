import { defineComponent, h, ref, toRef, getCurrentInstance } from 'vue'
import type { Ref } from 'vue'
import { useHighlighted } from '#imports'

export default defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    as: {
      type: String,
      default: 'div',
    },
  },
  async setup(props) {
    const el = ref() as Ref<HTMLElement>

    const hydratedCode = process.client
      ? getCurrentInstance()?.vnode?.el?.innerHTML
      : undefined

    const highlighted = await useHighlighted(toRef(props, 'code'), {
      lang: props.lang,
      highlighted: hydratedCode,
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
