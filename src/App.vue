<script setup>
import { NLayout, NLayoutHeader, NSpace, NButton, NH2 } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()
</script>

<template>
  <n-layout style="height: 100vh;">
    <!-- 顶部导航栏 -->
    <n-layout-header bordered style="height: 64px;">
      <n-space justify="space-between" align="center" style="padding: 12px 24px; height: 100%;">
        <n-h2 style="margin: 0;">AI灵感笔记平台</n-h2>
        <div>
          <span v-if="userStore.role !== 'guest'">
            欢迎, {{ userStore.username }} ({{ userStore.role }})
          </span>
          <n-button v-if="userStore.role !== 'guest'" @click="userStore.logout" size="small" style="margin-left: 8px;">
            退出
          </n-button>
          <n-button v-else to="/login" size="small" style="margin-left: 8px;">
            登录/注册
          </n-button>
          <n-button @click="themeStore.toggleTheme" size="small" style="margin-left: 8px;">
            {{ themeStore.isDark ? '☀️ 亮色' : '🌙 暗色' }}
          </n-button>
        </div>
      </n-space>
    </n-layout-header>

    <!-- 主要内容区域 (路由页面在这里渲染) -->
    <n-layout-content style="height: calc(100vh - 64px);">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
/* 确保布局正确 */
.n-layout {
  height: 100vh;
}

.n-layout-content {
  overflow: hidden;
}
</style>