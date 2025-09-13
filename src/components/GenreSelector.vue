<script setup>
import { computed } from 'vue'
import { state } from '../store.js'

const emit = defineEmits(['select'])

const genres = computed(() => {
  const allGenres = state.questions.map(q => q.genre)
  return [...new Set(allGenres)].filter(Boolean)
})

function selectGenre(genre) {
   console.log('ジャンル選択:', genre) // ← 追加
  emit('select', genre)
}
</script>

<template>
  <div class="genre-selector">
    <h2>ジャンルを選んでください</h2>
    <div class="genre-buttons">
      <button
        v-for="genre in genres"
        :key="genre"
        @click="selectGenre(genre)"
      >
        {{ genre }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.genre-selector {
  text-align: center;
  margin-bottom: 2rem;
}

.genre-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.genre-buttons button {
  flex: 0 1 auto;
  min-width: 120px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  word-break: keep-all;
}

.genre-buttons button:hover {
  background-color: #e0f0ff;
}
</style>
