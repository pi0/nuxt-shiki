// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
}).append({
  rules: {
    'vue/max-attributes-per-line': 0,
    'vue/require-default-prop': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  ignores: ['dist', 'node_modules'],
})
