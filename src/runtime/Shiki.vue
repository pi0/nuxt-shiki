<script setup lang="ts">
import { useHighlighted } from "#imports";

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true
  },
  as: {
    type: String,
    default: 'pre'
  },
});
const code = computed(() => props.code)
const highlighted = useHighlighted(code, { lang: props.lang });
</script>

<template>
  <component
    :is="as"
    v-html="highlighted"
  />
</template>
