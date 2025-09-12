import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref(localStorage.getItem('token'))
  const username = ref(localStorage.getItem('username') || '')
  
  // 超级简化的管理员判断：用户名为admin就是管理员
  const isAdmin = ref(username.value === 'admin')

  // 模拟用户数据库（存储在内存中）
  const mockUsers = ref([
    { username: 'admin', password: 'admin123' },
    { username: 'test', password: 'test123' }
  ])

  // 模拟登录API
  const mockLogin = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.value.find(u => 
          u.username === data.username && u.password === data.password
        )
        
        if (user) {
          resolve({
            token: 'mock_token_' + Math.random().toString(36).substr(2, 16),
            username: user.username
          })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 500)
    })
  }

  // 模拟注册API
  const mockRegister = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查用户名是否已存在
        const userExists = mockUsers.value.some(u => u.username === data.username)
        
        if (userExists) {
          reject(new Error('用户名已存在'))
          return
        }
        
        if (!data.username || !data.password) {
          reject(new Error('用户名和密码不能为空'))
          return
        }
        
        if (data.username.length < 3) {
          reject(new Error('用户名至少3个字符'))
          return
        }
        
        if (data.password.length < 6) {
          reject(new Error('密码至少6个字符'))
          return
        }
        
        // 添加到模拟数据库
        mockUsers.value.push({
          username: data.username,
          password: data.password
        })
        
        resolve({ 
          success: true,
          message: '注册成功'
        })
      }, 500)
    })
  }

  // 登录方法
  const login = async (data) => {
    try {
      const res = await mockLogin(data)
      token.value = res.token
      username.value = res.username
      isAdmin.value = res.username === 'admin'
      
      localStorage.setItem('token', res.token)
      localStorage.setItem('username', res.username)
      
      return res
    } catch (error) {
      logout()
      throw error
    }
  }

  // 注册方法
  const register = async (data) => {
    try {
      const res = await mockRegister(data)
      return res
    } catch (error) {
      throw error
    }
  }

  // 退出登录
  const logout = () => {
    token.value = null
    username.value = ''
    isAdmin.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }

  return { 
    token,
    username,
    isAdmin,
    login,
    register,
    logout
  }
})