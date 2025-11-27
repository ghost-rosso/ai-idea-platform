<script setup>
import { NLayout, NLayoutHeader, NSpace, NButton, NH2 } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

const goToLogin = () => router.push('/login')
const goToAdmin = () => router.push('/admin')
</script>

<template>
  <n-layout style="height: 100vh;">
    <n-layout-header class="header">
      <n-space justify="space-between" align="center" class="header-content">
        <n-space align="center" :size="16">
          <div class="logo">
            <img src="/logo.png" alt="logo" class="logo-img" />
          </div>
          <n-h2 class="title">AI灵感笔记</n-h2>
        </n-space>

        <!-- 右侧操作区 -->
        <n-space align="center" :size="8">
          <span v-if="userStore.username" class="welcome-text">
            欢迎, {{ userStore.username }}
          </span>

          <n-button v-if="userStore.isAdmin" @click="goToAdmin" size="small" class="admin-btn">
            <template #icon><span>⚙️</span></template>
            管理后台
          </n-button>

          <n-button v-if="userStore.username" @click="userStore.logout" size="small" class="logout-btn">
            <template #icon><span>🚪</span></template>
            退出
          </n-button>

          <n-button v-else @click="goToLogin" size="small" class="login-btn">
            <template #icon><span>🔐</span></template>
            登录/注册
          </n-button>

          <n-button @click="themeStore.toggleTheme" size="small" class="theme-btn" circle>
            <template #icon>
              <span>{{ themeStore.isDark ? '☀️' : '🌙' }}</span>
            </template>
          </n-button>
        </n-space>
      </n-space>
    </n-layout-header>

    <!-- 主要内容区域 -->
    <n-layout-content style="height: calc(100vh - 70px);">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
/* ---------导航栏------ */
.header {
  height: 70px;
  background: linear-gradient(135deg, #e8dfc4 0%, #f9ecd7 100%);
  border-bottom: 1px solid #e8dfce;
  box-shadow: 0 2px 12px rgba(139, 119, 101, 0.08);
  backdrop-filter: blur(10px);
}

.header-content {
  padding: 0 28px;
  height: 100%;
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #d4c5a8 0%, #b8a98c 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(139, 119, 101, 0.15);
}

.logo-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  background: linear-gradient(135deg, #8b7765 0%, #6d5d4f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-text-stroke: 0.5px #aa9179;
  text-shadow: 0 1px 2px rgba(200, 100, 12, 0.1);
}


.welcome-text {
  color: #8b7765;
  font-size: 16px;
  font-weight: 500;
  padding: 0 12px;
  border-right: 1px solid #e8dfce;
  margin-right: 8px;
  -webkit-text-stroke: 0.5px #aa9179;
}

/* 按钮样式  */
:deep(.n-button) {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.admin-btn {
  background: linear-gradient(135deg, #a2dae4 0%, #87abe9 100%) !important;
  border: none;
  color: white !important;
}

.admin-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 119, 101, 0.2);
}

.login-btn {
  background: linear-gradient(135deg, #d4c5a8 0%, #b8a98c 100%) !important;
  border: none;
  color: #6d5d4f !important;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 119, 101, 0.15);
}

.logout-btn {
  background: rgba(220, 148, 226, 0.515) !important;
  border: 1px solid #d4c5a8;
  color: #ffffff !important;
}

.logout-btn:hover {
  background: rgba(207, 133, 212, 0.636) !important;
  border-color: #ca7cdc;
}

.theme-btn {
  background: rgba(211, 182, 237, 0.988) !important;
  border: 1px solid rgba(139, 119, 101, 0.2);
  color: #8b7765 !important;
  width: 36px;
  height: 36px;
}

.theme-btn:hover {
  background: rgba(139, 119, 101, 0.15) !important;
  border-color: rgba(139, 119, 101, 0.3);
}

/* 暗色主题 */
[data-theme="dark"] .header {
  background: linear-gradient(135deg, #3a3229 0%, #2a241d 100%);
  border-bottom-color: #443c31;
}

[data-theme="dark"] .title {
  background: linear-gradient(135deg, #d4c5a8 0%, #b8a98c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="dark"] .welcome-text {
  color: #b8a98c;
  border-right-color: #5a5043;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .title {
    font-size: 18px;
  }

  .welcome-text {
    font-size: 15px;
  }

  :deep(.n-button__content) {
    font-size: 12px;
  }
}

.n-layout {
  height: 100vh;
}

.n-layout-content {
  overflow: hidden;
}
</style>