import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import './assets/main.css'

// 初始化Mock
import './mock'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(naive, {
  themeOverrides: {
    common: {
      // 基础颜色变量覆盖
      primaryColor: '#646cff',
      primaryColorHover: '#747bff',
    },
    Layout: {
      // 布局组件颜色
      headerColor: '#F0F7FF',  // 顶部导航浅蓝色
      siderColor: '#E6F9F2',  // 侧边栏浅绿色
      contentColor: '#FFFFFF', // 内容区白色
      footerColor: '#FFF5F0'  // 底部浅红色
    }
  }
})

app.mount('#app')