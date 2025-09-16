<template>
  <div class="question-view" v-if="question">
    <h2>ジャンル: {{ state.selectedGenre }}</h2>
    <p class="question-text">Q{{ state.currentIndex + 1 }}. {{ question.text }}</p>

    <div class="choices">
      <button
        v-for="(choice, index) in question.choices"
        :key="index"
        :class="{ selected: state.selectedAnswer === index }"
        @click="selectAnswer(index)"
      >
        {{ choice }}
      </button>
    </div>

    <div v-if="state.selectedAnswer !== null" class="explanation">
      <p>
        <strong>あなたの選択:</strong> {{ question.choices[state.selectedAnswer] }}
      </p>
      <p>
        <strong>正解:</strong> {{ question.choices[question.correct] }}
      </p>
      <p>
        <strong>解説:</strong> {{ question.explanation }}
      </p>

      <button @click="nextQuestion" class="next-button">次の問題へ</button>
    </div>
  </div>

  <div v-else>
    <p>このジャンルの問題はすべて終了しました。</p>
    <router-link to="/">ホームに戻る</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { state } from '../store.js'

const router = useRouter()

const genreQuestions = computed(() =>
  state.questions.filter(q => q.genre?.trim() === state.selectedGenre?.trim())
)

const question = computed(() => genreQuestions.value[state.currentIndex] ?? null)

function selectAnswer(index) {
  state.selectedAnswer = index
}

function nextQuestion() {
  state.currentIndex++
  state.selectedAnswer = null
  state.currentQuestion = genreQuestions.value[state.currentIndex] ?? null
}
</script>

<style scoped>
.question-view {
  max-width: 640px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.choices button {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.choices button:hover {
  background-color: #e0f0ff;
}

.choices button.selected {
  background-color: #cce5ff;
  border-color: #66b3ff;
}

.explanation {
  background-color: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.next-button {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
