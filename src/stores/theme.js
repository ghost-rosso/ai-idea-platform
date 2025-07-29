// src/stores/theme.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute(
      'data-theme', 
      isDark.value ? 'dark' : 'light'
    )
  }
  
  return { isDark, toggleTheme }
})