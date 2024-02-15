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
  <main>
    <div class="editor">
      <textarea v-model="code" />
    </div>
    <div class="highlighted-code">
      <Shiki id="editor" contenteditable :code="code" lang="ts" />
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
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

.highlighted-code {
  overflow: auto;
  background-color:; /* Darker background for highlighted code */
  border-left: 1px solid #555; /* Border between code editor and highlighted code */
}

code {
  display: block;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace; /* Monospace font */
  font-size: 16px;
  padding: 10px;
}
</style>
