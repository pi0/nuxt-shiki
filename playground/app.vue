<script setup lang="ts">
const code = ref<string>(/*js*/ `
// Try editing in the left panel!
console.log('Hello, World!')
`)

onMounted(() => {
  const editor = document.querySelector('#editor')!
  // Challenge: Can we preserve the cursor position when the code changes? :D
  editor?.addEventListener('input', () => {
    code.value = editor.textContent || ''
  })
})
</script>

<template>
  <main class="dark">
    <div class="editor">
      <textarea v-model="code" />
    </div>
    <div class="highlighted-code">
      <Shiki
        id="editor"
        contenteditable
        :code="code"
        :themes="{ light: 'github-light', dark: 'github-dark' }"
        lang="ts"
      />
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
}
</style>

<style>
/* https://shiki.style/guide/dual-themes#class-based-dark-mode */
.dark .shiki,
.dark .shiki span {
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
  background-color: #1e1e1e; /* Dark background color */
  color: #ffffff; /* Text color */
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
  background-color: transparent; /* Transparent background for code editor */
  color: inherit; /* Inherit text color */
  font-family: 'Courier New', Courier, monospace; /* Monospace font */
  font-size: 16px;
  resize: none; /* Prevent textarea from being resized */
}

code {
  display: block;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace; /* Monospace font */
  font-size: 16px;
  padding: 10px;
}
</style>
