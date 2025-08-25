<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()
const isLoginForm = ref(true)

// 表单数据
const formData = ref({
  username: '',
  password: ''
})

// 验证规则
const patterns = {
  username: /^1[3-9]\d{9}$/,
  password: /^.{6,}$/
}

// 处理登录
const handleLogin = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  try {
    await userStore.login(formData.value)
    router.push('/')
  } catch (error) {
    alert(error.message)
  }
}

// 处理注册
const handleRegister = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  try {
    await userStore.register(formData.value)
    alert('注册成功！')
    isLoginForm.value = true
  } catch (error) {
    alert(error.message)
  }
}

// 表单验证
const validateForm = () => {
  if (!patterns.username.test(formData.value.username)) {
    alert('请输入有效手机号')
    return false
  }
  if (!patterns.password.test(formData.value.password)) {
    alert('密码至少6位')
    return false
  }
  return true
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

      <!-- 登录表单 -->
      <form v-if="isLoginForm" @submit="handleLogin" id="loginForm">
        <div class="form-group">
          <input v-model="formData.username" type="text" class="form-control" placeholder="手机号">
        </div>
        <div class="form-group">
          <input v-model="formData.password" type="password" class="form-control" placeholder="密码">
        </div>
        <button type="submit" class="btn">登录</button>
        <div class="switch-form">
          <a href="#" @click.prevent="isLoginForm = false">没有账号？立即注册</a>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit="handleRegister" id="registerForm">
        <div class="form-group">
          <input v-model="formData.username" type="text" class="form-control" placeholder="手机号">
        </div>
        <div class="form-group">
          <input v-model="formData.password" type="password" class="form-control" placeholder="设置密码">
        </div>
        <button type="submit" class="btn">立即注册</button>
        <div class="switch-form">
          <a href="#" @click.prevent="isLoginForm = true">已有账号？立即登录</a>
        </div>
      </form>

      <!-- 社交登录 -->
      <div class="social-login">
        <p>其他登录方式</p>
        <div class="social-icons">
          <div class="social-icon wechat"><i class="fab fa-weixin"></i></div>
          <div class="social-icon qq"><i class="fab fa-qq"></i></div>
          <div class="social-icon weibo"><i class="fab fa-weibo"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 原CSS保持不变，仅添加scoped属性 */
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
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
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

.btn:hover {
  background: #438266;
}

.switch-form {
  text-align: center;
  margin: 20px 0;
}

.switch-form a {
  color: #438266;
  text-decoration: none;
  font-weight: 500;
}

.social-login {
  margin-top: 30px;
  text-align: center;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.social-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
}

.social-icon:hover {
  transform: translateY(-2px);
}

.wechat {
  background: #07c160;
}

.qq {
  background: #12b7f5;
}

.weibo {
  background: #e6162d;
}

@media (max-width: 480px) {
  .container {
    padding: 30px;
  }
}
</style>