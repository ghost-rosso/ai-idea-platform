import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Auth from '../views/Auth.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { 
      path: '/admin', 
      component: Admin,
      meta: { requiresAdmin: true } 
    },
    { path: '/login', component: Auth }
  ]
})

// 动态路由守卫
router.beforeEach(async (to) => {
  // 动态导入避免初始化问题
  const { useUserStore } = await import('@/stores/user')
  const userStore = useUserStore()
  
  // 检查管理员权限（注意：isAdmin现在是函数）
  if (to.meta.requiresAdmin && !userStore.isAdmin()) {
    return '/login'
  }
  // 否则放行
})

export default router