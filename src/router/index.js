import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Auth from '@/views/Auth.vue'
import Admin from '@/views/Admin.vue' // 导入管理员页面

const routes = [
  {
    path: '/',
    component: Home
    // 移除 requiresAuth，因为我们现在有更简单的处理方式
  },
  {
    path: '/login',
    component: Auth
    // 移除 guestOnly
  },
  {
    path: '/admin',
    component: Admin
    // 简单的管理员路由，不需要复杂meta
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // 可选：极简路由守卫（如果不需要可以完全删除）
// router.beforeEach((to) => {
//   // 直接从localStorage读取token，避免导入store的复杂性
//   const token = localStorage.getItem('token')
  
//   // 如果访问/admin但没有token，跳转到登录页
//   if (to.path === '/admin' && !token) {
//     return '/login'
//   }
  
//   // 如果已登录但访问登录页，跳转到首页
//   if (to.path === '/login' && token) {
//     return '/'
//   }
// })

export default router