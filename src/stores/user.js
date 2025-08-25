import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref(localStorage.getItem('token'))
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  // 模拟登录API
  const mockLogin = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.username === '13800000000' && data.password === '123456') {
          const res = {
            token: 'mock_token_' + Math.random().toString(36).substr(2),
            user: {
              username: data.username,
              role: data.username === '13800000000' ? 'admin' : 'user'
            }
          }
          resolve(res)
        } else {
          reject(new Error('手机号或密码错误'))
        }
      }, 800)
    })
  }

  // 模拟注册API
  const mockRegister = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 800)
    })
  }

  // 登录方法
  const login = async (data) => {
    try {
      const res = await mockLogin(data)
      token.value = res.token
      userInfo.value = res.user
      
      localStorage.setItem('token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(res.user))
      
      return res
    } catch (error) {
      logout()
      throw error
    }
  }

  // 注册方法
  const register = async (data) => {
    const res = await mockRegister(data)
    return res
  }

  // 退出登录
  const logout = () => {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  return { 
    token,
    userInfo,
    login,
    register,
    logout
  }
})