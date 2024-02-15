export default defineNuxtConfig({
  modules: ['../src/module'],
  shiki: {
    themes: ['github-light', 'github-dark'],
    langs: ['typescript'],
  },
})
