import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Auth from '@/views/Auth.vue'
import Admin from '@/views/Admin.vue' // 导入管理员页面

const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: '首页 - AI灵感笔记' } 
  },
  {
    path: '/login',
    component: Auth,
    meta: { title: '登录 - AI灵感笔记' } 
  },
  {
    path: '/admin',
    component: Admin,
    meta: { title: '管理后台 - AI灵感笔记' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
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