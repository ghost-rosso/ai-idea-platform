<script setup>
import { useUserStore } from '@/stores/user'
import { NLayout, NLayoutHeader, NLayoutContent, NSpace, NButton } from 'naive-ui'

const userStore = useUserStore()
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
        </div>
      </n-space>
    </n-layout-header>

    <n-layout-content>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>