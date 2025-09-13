<template>
  <div v-if="question">
    <h2>問題 {{ question.id }} の解説</h2>
    <p class="explanation-text">{{ question.explanation }}</p>

    <div class="result">
      <p>あなたの回答：<strong>{{ question.choices[state.selectedAnswer] }}</strong></p>
      <p v-if="isCorrect" class="correct">✅ 正解です！</p>
      <p v-else class="incorrect">❌ 不正解…（正解：{{ question.answer }}）</p>
    </div>

    <button @click="goNext">次の問題へ</button>
  </div>
</template>

<script setup>
import { state } from '../store.js'

const question = state.currentQuestion
const selectedChoice = question.choices[state.selectedAnswer]
const isCorrect = selectedChoice === question.answer

function goNext() {
  const genreQuestions = state.questions.filter(q => q.genre === question.genre)
  const nextIndex = state.currentIndex + 1

  // 履歴に記録
  state.history.push({
    round: question.round,
    id: question.id,
    genre: question.genre,
    question: question.text,
    selected: selectedChoice,
    correct: question.answer,
    isCorrect,
    timestamp: new Date().toISOString()
  })

  if (nextIndex < genreQuestions.length) {
    state.currentIndex = nextIndex
    state.currentQuestion = genreQuestions[nextIndex]
    state.selectedAnswer = null
    state.currentView = 'question'
  } else {
    alert('全ての問題が終了しました！')
    state.currentView = 'result' // ← 履歴表示ビューに切り替え可能
  }
}
</script>

<style scoped>
.explanation-text {
  font-size: 1.1rem;
  margin-bottom: 20px;
}
.result {
  margin-bottom: 20px;
}
.correct {
  color: green;
  font-weight: bold;
}
.incorrect {
  color: red;
  font-weight: bold;
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
</style>
