<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const isLoginForm = ref(true)
const isLoading = ref(false)

// 表单数据
const formData = ref({
  username: '',
  password: ''
})

// 提示信息
const message = ref('')
const messageType = ref('')

// 清除提示信息
const clearMessage = () => {
  message.value = ''
  messageType.value = ''
}

// 监听输入变化，清除提示
watch([() => formData.value.username, () => formData.value.password], clearMessage)

// 验证用户名
const validateUsername = () => {
  if (!formData.value.username.trim()) {
    return '请输入用户名'
  }
  if (formData.value.username.length < 3) {
    return '用户名至少3个字符'
  }
  if (formData.value.username.length > 20) {
    return '用户名不能超过20个字符'
  }
  return null
}

// 验证密码
const validatePassword = () => {
  if (!formData.value.password) {
    return '请输入密码'
  }
  if (formData.value.password.length < 6) {
    return '密码至少6个字符'
  }
  return null
}

// 处理登录
const handleLogin = async (e) => {
  e.preventDefault()

  const usernameError = validateUsername()
  if (usernameError) {
    message.value = usernameError
    messageType.value = 'error'
    return
  }

  const passwordError = validatePassword()
  if (passwordError) {
    message.value = passwordError
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  try {
    await userStore.login(formData.value)
    message.value = '登录成功，正在跳转...'
    messageType.value = 'success'
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    message.value = error.message || '登录失败，请检查用户名和密码'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

// 处理注册
const handleRegister = async (e) => {
  e.preventDefault()

  const usernameError = validateUsername()
  if (usernameError) {
    message.value = usernameError
    messageType.value = 'error'
    return
  }

  const passwordError = validatePassword()
  if (passwordError) {
    message.value = passwordError
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  try {
    await userStore.register(formData.value)
    message.value = '注册成功！请登录'
    messageType.value = 'success'
    setTimeout(() => {
      isLoginForm.value = true
      formData.value.password = ''
      clearMessage()
    }, 1500)
  } catch (error) {
    message.value = error.message || '注册失败，请稍后再试'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

// 切换表单时清除信息
const switchForm = (toLogin) => {
  if (isLoading.value) return // 加载时禁止切换

  isLoginForm.value = toLogin
  formData.value.password = ''
  clearMessage()
}
</script>

<template>
  <div class="auth-container">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <img src="/images/logo.png" alt="LEON" class="logo-img">
        <h1 class="logo-text">AI灵感笔记</h1>
      </div>

      <!-- 提示信息 -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <!-- 登录表单 -->
      <form v-if="isLoginForm" @submit="handleLogin" id="loginForm">
        <div class="form-group">
          <input v-model="formData.username" type="text" class="form-control" placeholder="用户名" :disabled="isLoading">
        </div>
        <div class="form-group">
          <input v-model="formData.password" type="password" class="form-control" placeholder="密码"
            :disabled="isLoading">
        </div>
        <button type="submit" class="btn" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        <div class="switch-form">
          <a href="#" @click.prevent="switchForm(false)" :class="{ 'disabled-link': isLoading }">
            没有账号？立即注册
          </a>
        </div>

        <!-- 测试账号提示 -->
        <div class="test-account">
          测试账号：admin / admin123
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit="handleRegister" id="registerForm">
        <div class="form-group">
          <input v-model="formData.username" type="text" class="form-control" placeholder="设置用户名" :disabled="isLoading">
        </div>
        <div class="form-group">
          <input v-model="formData.password" type="password" class="form-control" placeholder="设置密码"
            :disabled="isLoading">
        </div>
        <button type="submit" class="btn" :disabled="isLoading">
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>
        <div class="switch-form">
          <a href="#" @click.prevent="switchForm(true)" :class="{ 'disabled-link': isLoading }">
            已有账号？立即登录
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('/images/bj.png') center/cover no-repeat;
}

.auth-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.65);
  padding: 40px 50px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo-img {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logo-text {
  margin-top: 15px;
  font-size: 24px;
  font-weight: 600;
  color: #438266;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.logo:hover .logo-text {
  color: #25723b;
}

.message {
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
  transition: all 0.3s ease;
}

.message.success {
  background-color: rgba(72, 187, 120, 0.2);
  color: #2f5449;
  border: 1px solid #48bb78;
}

.message.error {
  background-color: rgba(248, 113, 113, 0.2);
  color: #7f1d1d;
  border: 1px solid #f87171;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #438266;
  box-shadow: 0 0 0 3px rgba(67, 130, 102, 0.2);
}

.form-control:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn {
  width: 100%;
  padding: 14px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  background: #438266;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover:not(:disabled) {
  background: #366d53;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-form {
  text-align: center;
  margin: 20px 0;
}

.switch-form a {
  color: #438266;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.switch-form a:hover:not(.disabled-link) {
  color: #25723b;
  text-decoration: underline;
}

.disabled-link {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.test-account {
  text-align: center;
  margin-top: 16px;
  color: #666;
  font-size: 12px;
}

@media (max-width: 480px) {
  .container {
    padding: 30px;
  }
}
</style>