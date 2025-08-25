import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Auth from '@/views/Auth.vue'

const routes = [
  {
    path: '/',
    component: Auth,  // 将默认路由改为登录页
    meta: { guestOnly: true }
  },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Auth,
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.token) {
    return '/login'
  }
  
  if (to.meta.guestOnly && userStore.token) {
    return '/'
  }
})

export default router