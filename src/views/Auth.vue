<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  // 模拟登录请求
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value })
  })

  const data = await res.json()
  if (data.code === 200) {
    userStore.login(data.data.role, data.data.username)
    router.push(data.data.role === 'admin' ? '/admin' : '/')
  } else {
    alert(data.message)
  }
}
</script>

<template>
  <n-card title="登录" style="max-width: 400px; margin: 40px auto;">
    <n-input v-model:value="username" placeholder="用户名" />
    <n-input v-model:value="password" type="password" placeholder="密码" style="margin-top: 16px;" />
    <n-button type="primary" block style="margin-top: 24px;" @click="handleLogin">
      登录
    </n-button>
    <n-p style="margin-top: 16px; text-align: center;">
      测试账号: admin/admin123
    </n-p>
  </n-card>
</template>