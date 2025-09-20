<template>
  <div class="home">
    <h2>国家試験対策アプリへようこそ</h2>

    <div v-if="loading">🌀 問題データを読み込み中です...</div>
    <div v-else-if="error">⚠️ データの取得に失敗しました：{{ error }}</div>
    <div v-else>
      <p>ジャンル選択画面へ進んでください。</p>
      <router-link to="/genre">
        <button>ジャンルを選ぶ</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { fetchQuestionsFromSheet } from '@/utils/fetchQuestions.js';
import { state } from '@/store.js';

const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const questions = await fetchQuestionsFromSheet();
    console.log('✅ 取得した行数:', questions.length);
    console.log('✅ 整形後の問題数:', questions.length);
    console.log('✅ ジャンル一覧:', [...new Set(questions.map(q => q.genre).filter(Boolean))]);

    state.questions = questions;
    loading.value = false;
  } catch (err) {
    console.error('❌ データ取得エラー:', err);
    error.value = err.message || '不明なエラー';
    loading.value = false;
  }
});
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  font-family: sans-serif;
}

button {
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #e0f0ff;
}
</style>
