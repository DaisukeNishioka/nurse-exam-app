import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

// ページコンポーネントのインポート
import Home from './components/Home.vue'
import QuestionView from './components/QuestionView.vue'
import ExplanationView from './components/ExplanationView.vue'

// ルート定義
const routes = [
  { path: '/', component: Home },
  { path: '/question', component: QuestionView },
  { path: '/explanation', component: ExplanationView }
]

// ルーター作成
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// アプリ作成 & マウント
createApp(App).use(router).mount('#app')
