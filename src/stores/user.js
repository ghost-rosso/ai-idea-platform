import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const role = ref(localStorage.getItem('userRole') || 'guest')
  const username = ref('')

  const isAdmin = () => role.value === 'admin'
  
  const login = (userRole, name) => {
    role.value = userRole
    username.value = name
    localStorage.setItem('userRole', userRole)
  }
  
  const logout = () => {
    role.value = 'guest'
    localStorage.removeItem('userRole')
  }

  return { role, username, isAdmin, login, logout }
})