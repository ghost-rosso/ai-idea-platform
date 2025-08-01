<script setup>
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutSider, NSpace, NButton, NH2 } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import '@/assets/debug.css' // 确认路径正确

const userStore = useUserStore()
const themeStore = useThemeStore()
</script>

<template>
  <n-layout style="height: 100vh;">
    <!-- 顶部导航栏 -->
    <n-layout-header bordered class="debug-header">
      <n-space justify="space-between" align="center" style="padding: 12px 24px;">
        <n-h2>AI灵感笔记平台</n-h2>
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

    <!-- 主内容区 -->
    <n-layout has-sider position="absolute" style="top: 64px; bottom: 0;">
      <!-- 左侧导航栏保持不变 -->
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" show-trigger
        content-style="padding: 16px;" class="debug-sider">
        <slot name="sidebar"></slot>
      </n-layout-sider>

      <!-- 中央内容区 -->
      <n-layout-content content-style="padding: 16px;" class="debug-content">
        <router-view />
      </n-layout-content>

      <!-- 右侧边栏 -->
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="20" :width="300" :show-trigger="true"
        :trigger-style="{
          left: '-18px',
          right: 'unset',
          transform: 'scaleX(-1)'
        }" content-style="padding: 16px;" position="right" class="debug-ai-panel">
        <slot name="ai-panel"></slot>
      </n-layout-sider>
    </n-layout>
  </n-layout>
</template>

<style scoped>
/* 基础布局 */
.n-layout {
  height: 100vh;
}

/* 右侧触发器修正 */
.n-layout-sider--right .n-layout-sider-toggle {
  left: -18px !important;
  width: 18px !important;
  border-right: 1px solid var(--n-border-color);
  background: var(--n-color);
}

/* 鼠标悬停时显示完整触发器 */
.n-layout-sider--right:hover .n-layout-sider-toggle {
  width: 24px !important;
  left: -24px !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .n-layout-sider--right {
    right: -100%;
    transition: right 0.3s;
  }

  .n-layout-sider--right.n-layout-sider--collapsed {
    right: calc(20px - 100%);
    /* 保留20px可拖拽区域 */
  }

  .n-layout-sider-toggle {
    display: none;
    /* 移动端隐藏默认触发器 */
  }
}
</style>