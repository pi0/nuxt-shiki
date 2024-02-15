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
const highlighted = await useHighlighted(code, { lang: props.lang });
</script>

<template>
  <!-- TODO: componet :is seems not working in SSR! -->
  <div v-html="highlighted" />
</template>
