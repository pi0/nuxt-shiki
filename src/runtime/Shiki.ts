import { defineComponent, h } from "vue";
import { useHighlighted } from "#imports";

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
      default: "div",
    },
  },
  async setup(props) {
    const highlighted = await useHighlighted(props.code, { lang: props.lang });
    return { highlighted };
  },
  render() {
    return h(this.as, {
      innerHTML: this.highlighted,
    });
  },
});
