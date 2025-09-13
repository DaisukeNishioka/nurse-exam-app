<template>
  <div class="app">
    <h1>看護師国家試験対策アプリ</h1>

    <div v-if="state.liffError">
      <p class="error">LIFF初期化エラー: {{ state.liffError }}</p>
    </div>

    <div v-else-if="!state.userProfile">
      <p>LINEログイン中...</p>
    </div>

    <div v-else>
      <p class="welcome">こんにちは、{{ state.userProfile.displayName }} さん！</p>
      <p>読み込んだ問題数: {{ state.questions.length }}</p>
      <p>現在のビュー: {{ state.currentView }}</p>
      <p>現在の問題ID: {{ state.currentQuestion?.id }}</p>
      <p>ジャンル: {{ selectedGenre }}</p>

      <!-- ✅ 問題データの中身を確認 -->
      <details>
        <summary>📦 問題データの中身を表示</summary>
        <pre>{{ JSON.stringify(state.questions, null, 2) }}</pre>
      </details>

      <!-- ジャンル選択画面 -->
      <GenreSelector
        v-if="state.currentView === 'genre'"
        @select="handleGenreSelect"
      />

      <!-- 問題表示画面 -->
      <QuestionView
        v-if="state.currentView === 'question'"
      />

      <!-- 解説表示画面 -->
      <ExplanationView
        v-if="state.currentView === 'explanation'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { state, loadQuestionsFromSheet } from './store.js'
import GenreSelector from './components/GenreSelector.vue'
import QuestionView from './components/QuestionView.vue'
import ExplanationView from './components/ExplanationView.vue'

const selectedGenre = ref(null)

function handleGenreSelect(genre) {
  selectedGenre.value = genre

  // ✅ 空白除去してジャンル一致判定
  const genreQuestions = state.questions.filter(q => q.genre?.trim() === genre.trim())

  console.log('選択ジャンル:', genre)
  console.log('一致した問題数:', genreQuestions.length)
  console.log('最初の問題:', genreQuestions[0])

  state.currentIndex = 0
  state.currentQuestion = genreQuestions[0] ?? null
  state.selectedAnswer = null
  state.currentView = 'question'
}

onMounted(() => {
  loadQuestionsFromSheet()
})
</script>

<style scoped>
.app {
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
  margin: 1rem 0;
  background: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>
