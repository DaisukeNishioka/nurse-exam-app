<template>
  <div class="genre-selector">
    <h2>ジャンルを選んでください</h2>
    <div class="genre-buttons">
      <button @click="selectRandom">ランダム</button>
      <button
        v-for="genre in filteredGenres"
        :key="genre"
        @click="selectGenre(genre)"
      >
        {{ genre }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchQuestionsFromSheet } from '../utils/fetchQuestions'
import { state } from '../store.js'

const genres = ref([])
const router = useRouter()

// スプレッドシートから問題を取得
fetchQuestionsFromSheet().then((questions) => {
  state.questions = questions
  const uniqueGenres = [...new Set(questions.map(q => q.genre).filter(g => g?.trim()))]
  genres.value = uniqueGenres
})

// 「ジャンル」という名前のボタンは除外
const filteredGenres = computed(() =>
  genres.value.filter(g => g.trim() !== 'ジャンル')
)

// ジャンル選択時の処理（重複除去付き）
function selectGenre(genre) {
  state.selectedGenre = genre
  const genreQuestions = state.questions
    .filter(q => q.genre === genre)
    .filter((q, i, self) => self.findIndex(x => x.text === q.text) === i) // 重複除去！

  const limited = genreQuestions.slice(0, 5)
  state.filteredQuestions = limited
  state.currentIndex = 0
  state.currentQuestion = limited[0]

  console.log('ジャンル抽出された問題一覧:')
  limited.forEach((q, i) => {
    console.log(`${i + 1}: ${q.text}`)
  })

  router.push({ name: 'QuestionView', query: { genre } })
}

// ランダム選択時の処理（重複除去付き）
function selectRandom() {
  state.selectedGenre = null
  const uniqueQuestions = state.questions
    .filter((q, i, self) => self.findIndex(x => x.text === q.text) === i) // 重複除去！

  const shuffled = [...uniqueQuestions].sort(() => Math.random() - 0.5)
  const limited = shuffled.slice(0, 5)
  state.filteredQuestions = limited
  state.currentIndex = 0
  state.currentQuestion = limited[0]

  console.log('ランダム抽出された問題一覧:')
  limited.forEach((q, i) => {
    console.log(`${i + 1}: ${q.text}`)
  })

  router.push({ name: 'QuestionView' })
}
</script>

<style scoped>
.genre-selector {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}
.genre-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
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
</style>
