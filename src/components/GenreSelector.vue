<template>
  <div class="genre-selector">
    <h2>ジャンルを選んでください</h2>
    <div class="genre-buttons">
      <button v-for="genre in genres" :key="genre" @click="selectGenre(genre)">
        {{ genre }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { state } from '../store.js';

const router = useRouter();

const genres = computed(() => {
  const allGenres = state.questions.map(q => q.genre);
  return [...new Set(allGenres)].filter(Boolean);
});

function selectGenre(genre) {
  state.selectedGenre = genre;
  state.currentIndex = 0;
  router.push({ name: 'QuestionView' });
}
</script>

<style scoped>
.genre-selector { text-align: center; padding: 2rem; }
.genre-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; padding: 1rem; }
.genre-buttons button { flex: 0 1 auto; min-width: 120px; padding: 0.8rem 1rem; font-size: 1rem; background-color: #f0f8ff; border: 1px solid #ccc; border-radius: 8px; cursor: pointer; transition: background-color 0.2s ease; word-break: keep-all; }
.genre-buttons button:hover { background-color: #e0f0ff; }
</style>