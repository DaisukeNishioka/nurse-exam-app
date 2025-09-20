<template>
  <div v-if="state.filteredQuestions.length > 0 && currentQuestion" class="question-container">
    <div class="header">
      <p class="question-info">問題 {{ state.currentIndex + 1 }} / {{ state.filteredQuestions.length }}</p>
      <p class="genre-tag" v-if="currentQuestion.genre">{{ currentQuestion.genre }}</p>
    </div>
    <h2 class="question-text">{{ currentQuestion.text }}</h2>
    <div class="choices">
      <button
        v-for="(choice, index) in currentQuestion.choices"
        :key="index"
        @click="selectAnswer(index)"
      >
        {{ choice }}
      </button>
    </div>
  </div>
  <div v-else class="loading-state">
    <p v-if="state.liffError">問題データの読み込みに失敗しました。</p>
    <p v-else>問題データを読み込み中です...</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { state, loadQuestionsFromSheet } from '../store.js'

const router = useRouter()
const route = useRoute()

const currentQuestion = computed(() => state.filteredQuestions[state.currentIndex])

onMounted(async () => {
  const genreFromQuery = route.query.genre
  state.selectedGenre = genreFromQuery || null

  // 問題データが未取得なら取得
  if (state.questions.length === 0) {
    await loadQuestionsFromSheet()
  }

  // currentQuestion が未設定なら、filteredQuestions からセット
  if (!state.currentQuestion && state.filteredQuestions.length > 0) {
    state.currentQuestion = state.filteredQuestions[state.currentIndex]
  }
})

function selectAnswer(index) {
  state.selectedAnswer = index
  state.currentQuestion = state.filteredQuestions[state.currentIndex]
  router.push({ name: 'ExplanationView' })
}
</script>

<style scoped>
.question-container {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.question-info {
  font-size: 1rem;
  color: #666;
}
.genre-tag {
  background-color: #e0f0ff;
  color: #1a73e8;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}
.question-text {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 20px;
}
.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.choices button {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}
.choices button:hover {
  background-color: #f0f0f0;
}
.loading-state {
  text-align: center;
  padding-top: 50px;
}
</style>
