<template>
  <div class="question-page">
    <h1>看護師国家試験対策</h1>

    <section v-if="!selectedGenre">
      <h2>ジャンルを選択してください</h2>
      <div class="genre-buttons">
        <button
          v-for="genre in uniqueGenres"
          :key="genre"
          @click="selectGenre(genre)"
        >
          {{ genre }}
        </button>
      </div>
    </section>

    <section v-else-if="currentQuestion">
      <h2>{{ currentQuestion.text || '（問題文なし）' }}</h2>
      <p>ジャンル：{{ currentQuestion.genre || '（ジャンル未設定）' }}</p>

      <div class="choices">
        <button
          v-for="(choice, index) in currentQuestion.choices"
          :key="index"
          @click="selectedAnswer = index"
          :class="{ selected: selectedAnswer === index }"
        >
          {{ choice || '（選択肢なし）' }}
        </button>
      </div>

      <div v-if="selectedAnswer !== null">
        <p>あなたの回答：{{ currentQuestion.choices[selectedAnswer] }}</p>
        <p v-if="isCorrect">✅ 正解！</p>
        <p v-else>❌ 不正解（正解：{{ correctChoice }}）</p>
        <p>{{ currentQuestion.explanation || '（解説なし）' }}</p>
        <button @click="nextQuestion" style="margin-top: 1rem;">次の問題へ</button>
      </div>
    </section>

    <section v-else>
      <p>このジャンルにはまだ問題が登録されていません。</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchQuestionsFromSheet } from '@/utils/fetchQuestions.js'

const questions = ref([])
const selectedGenre = ref(null)
const selectedAnswer = ref(null)
const currentIndex = ref(0)

onMounted(async () => {
  const result = await fetchQuestionsFromSheet()
  console.log('取得結果:', result)
  questions.value = result
})

const uniqueGenres = computed(() => {
  const genres = questions.value.map(q => q.genre)
  return [...new Set(genres)].filter(Boolean)
})

const filteredQuestions = computed(() => {
  if (!selectedGenre.value) return []
  return questions.value.filter(q => q.genre === selectedGenre.value)
})

const currentQuestion = computed(() =>
  filteredQuestions.value[currentIndex.value]
)

const isCorrect = computed(() => {
  if (!currentQuestion.value || selectedAnswer.value === null) return false
  return currentQuestion.value.answer === String(selectedAnswer.value + 1)
})

const correctChoice = computed(() => {
  const index = Number(currentQuestion.value.answer) - 1
  return currentQuestion.value.choices[index]
})

function selectGenre(genre) {
  selectedGenre.value = genre
  selectedAnswer.value = null

  const count = filteredQuestions.value.length
  currentIndex.value = count > 0 ? Math.floor(Math.random() * count) : 0
}

function nextQuestion() {
  selectedAnswer.value = null
  const count = filteredQuestions.value.length
  currentIndex.value = count > 0 ? Math.floor(Math.random() * count) : 0
}
</script>

<style scoped>
.question-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.genre-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #f0f8ff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.genre-buttons button:hover {
  background-color: #e0f0ff;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.choices button {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.choices button.selected {
  background-color: #cce5ff;
  font-weight: bold;
}
</style>

