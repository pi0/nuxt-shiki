<script setup lang="ts">
import { useHighlighted, toRef } from "#imports";

const props = defineProps({
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
});
const code = toRef(props, "code");
const highlighted = useHighlighted(code, { lang: props.lang });
</script>

<template>
  <!-- eslint-disable-next-line -->
  <component :is="as" v-html="highlighted" />
</template>
