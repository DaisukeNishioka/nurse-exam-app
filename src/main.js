import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

// ルート定義（必要に応じてコンポーネントを追加）
import Home from './components/Home.vue'
import About from './components/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHashHistory(), // GitHub Pages対応のhashモード
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
