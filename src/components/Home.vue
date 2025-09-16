<template>
  <div class="home">
    <h2>看護師国家試験対策アプリ</h2>

    <div v-if="state.liffError">
      <p class="error">LIFF初期化エラー: {{ state.liffError }}</p>
    </div>

    <div v-else-if="!state.userProfile">
      <p>LINEログイン中...</p>
    </div>

    <div v-else>
      <p class="welcome">こんにちは、{{ state.userProfile.displayName }} さん！</p>
      <p>読み込んだ問題数: {{ state.questions.length }}</p>

      <GenreSelector @select="handleGenreSelect" />

      <details>
        <summary>📦 問題データの中身を表示</summary>
        <pre>{{ JSON.stringify(state.questions, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { state, initLiff, loadQuestionsFromSheet } from '../store.js'
import GenreSelector from './GenreSelector.vue'

const router = useRouter()

onMounted(async () => {
  try {
    await initLiff()
    await loadQuestionsFromSheet()
  } catch (e) {
    state.liffError = e.message || '初期化エラー'
  }
})

function handleGenreSelect(genre) {
  const genreQuestions = state.questions.filter(q => q.genre?.trim() === genre.trim())
  state.currentIndex = 0
  state.currentQuestion = genreQuestions[0] ?? null
  state.selectedAnswer = null
  state.selectedGenre = genre
  router.push('/question')
}
</script>

<style scoped>
.home {
  max-width: 640px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.welcome {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.error {
  color: red;
  font-weight: bold;
  margin-bottom: 1rem;
}

details {
  margin-top: 1rem;
  background: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>
