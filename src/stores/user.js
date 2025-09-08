import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref(localStorage.getItem('token'))
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  // 计算属性：是否是管理员（超级简化版）
  const isAdmin = ref(userInfo.value?.username === 'admin')

  // 模拟登录API - 简化版
  const mockLogin = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 只有admin用户是管理员，其他都是普通用户
        if (data.username === 'admin' && data.password === 'admin123') {
          const res = {
            token: 'mock_token_admin',
            user: {
              username: 'admin',
              role: 'admin'
            }
          }
          resolve(res)
        } 
        // 普通用户登录
        else if (data.username && data.password) {
          const res = {
            token: 'mock_token_user_' + Math.random().toString(36).substr(2, 6),
            user: {
              username: data.username,
              role: 'user'
            }
          }
          resolve(res)
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 500) // 更短的延迟
    })
  }

  // 模拟注册API - 简化版
  const mockRegister = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.username && data.password) {
          resolve({ 
            success: true,
            message: '注册成功'
          })
        } else {
          reject(new Error('注册信息不完整'))
        }
      }, 500)
    })
  }

  // 登录方法
  const login = async (data) => {
    try {
      const res = await mockLogin(data)
      token.value = res.token
      userInfo.value = res.user
      isAdmin.value = res.user.username === 'admin' // 更新管理员状态
      
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
    userInfo.value = null
    isAdmin.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  return { 
    token,
    userInfo,
    isAdmin, // 导出isAdmin
    login,
    register,
    logout
  }
})