// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import QuestionView from '../components/QuestionView.vue'
import ExplanationView from '../components/ExplanationView.vue'
import GenreSelector from '../components/GenreSelector.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/genre', name: 'GenreSelector', component: GenreSelector },
  { path: '/question', name: 'QuestionView', component: QuestionView },
  { path: '/explanation', name: 'ExplanationView', component: ExplanationView }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;