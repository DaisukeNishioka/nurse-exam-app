<template>
  <div v-if="question" class="explanation-container">
    <h2>問題 {{ question.id }} の結果</h2>
    <div class="result">
      <p v-if="isCorrect" class="correct">✅ 正解です！</p>
      <p v-else class="incorrect">❌ 不正解...（正解：{{ question.answer }}）</p>
    </div>
    <button @click="goNext">次の問題へ</button>
  </div>
  <div v-else class="loading-state">
    <p>問題データが見つかりませんでした。</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { state } from '../store.js'

const router = useRouter()

const question = state.currentQuestion
const selectedAnswerIndex = state.selectedAnswer

const isCorrect = computed(() => {
  if (!question || selectedAnswerIndex === null) return false
  return question.answer === String(selectedAnswerIndex + 1)
})

function goNext() {
  if (!question) return

  // 履歴に記録
  state.history.push({
    id: question.id,
    isCorrect: isCorrect.value,
    timestamp: new Date().toISOString(),
    selectedAnswer: selectedAnswerIndex
  })

  const nextIndex = state.currentIndex + 1

  if (nextIndex < state.filteredQuestions.length) {
    state.currentIndex = nextIndex
    state.currentQuestion = state.filteredQuestions[nextIndex]
    state.selectedAnswer = null
    router.push({ name: 'QuestionView' })
  } else {
    alert('このジャンルの問題はすべて終了しました！')
    // 状態リセットしてジャンル選択画面へ
    state.selectedGenre = null
    state.filteredQuestions = []
    state.currentIndex = 0
    state.currentQuestion = null
    state.selectedAnswer = null
    router.push({ name: 'GenreSelector' })
  }
}
</script>

<style scoped>
.explanation-container {
  padding: 20px;
}
.result {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}
.correct {
  color: green;
  font-weight: bold;
  font-size: 1.2rem;
}
.incorrect {
  color: red;
  font-weight: bold;
  font-size: 1.2rem;
}
button {
  padding: 10px 15px;
  font-size: 1rem;
  background-color: #dff0d8;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #c8e5bc;
}
.loading-state {
  text-align: center;
  padding-top: 50px;
}
</style>
