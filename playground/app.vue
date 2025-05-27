<script setup lang="ts">
const code = ref<string>(/*js*/ `
// Try editing in the left panel!
console.log('Hello, World!')
`)
</script>

<template>
  <main>
    <div class="editor">
      <textarea v-model="code" />
    </div>
    <div class="highlighted-code">
      <Shiki id="shiki" lang="js" :code="code" />
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
}
</style>

<style>
/* https://shiki.style/guide/dual-themes#query-based-dark-mode */
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }

  main {
    display: flex;
    height: 100vh;
    background-color: #1e1e1e;
    color: #ffffff;
  }
}

main {
  display: flex;
  height: 100vh;
}

.editor {
  overflow-x: hidden;
}

.editor,
.highlighted-code {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

textarea {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  color: inherit;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  resize: none;
}

code {
  display: block;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  padding: 10px;
}
</style>
