<script setup>
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme' // 新增导入
import { NLayout, NLayoutHeader, NLayoutContent, NSpace, NButton } from 'naive-ui'

const userStore = useUserStore()
const themeStore = useThemeStore() // 新增初始化
</script>

<template>
  <n-layout>
    <n-layout-header bordered>
      <n-space justify="space-between" align="center" style="padding: 12px 24px;">
        <n-h2>AI灵感笔记平台</n-h2>
        <div>
          <span v-if="userStore.role !== 'guest'">
            欢迎, {{ userStore.username }} ({{ userStore.role }})
          </span>
          <n-button v-if="userStore.role !== 'guest'" @click="userStore.logout" size="small">
            退出
          </n-button>
          <n-button v-else to="/login" size="small">
            登录
          </n-button>

          <!-- 将主题按钮移到此处，与其他按钮同层级 -->
          <n-button @click="themeStore.toggleTheme" size="small" style="margin-left: 8px;">
            {{ themeStore.isDark ? '☀️ 亮色' : '🌙 暗色' }}
          </n-button>
        </div>
      </n-space>
    </n-layout-header>

    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>