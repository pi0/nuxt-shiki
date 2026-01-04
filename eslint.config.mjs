// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
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
