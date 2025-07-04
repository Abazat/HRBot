<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  authStore.initializeAuth()
  themeStore.initializeTheme()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <RouterView />
  </div>
</template>

<style>
#app {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>