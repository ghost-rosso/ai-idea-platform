import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Auth from '../views/Auth.vue'

const routes = [
  { path: '/', component: Home },
  { 
    path: '/admin', 
    component: Admin,
    meta: { requiresAdmin: true }
  },
  { path: '/login', component: Auth }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router