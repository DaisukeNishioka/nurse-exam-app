<template>
  <div v-if="question" class="explanation-container">
    <h2>問題 {{ question.id }} の解説</h2>
    <p class="explanation-text">{{ question.explanation }}</p>
    <div class="result">
      <p>あなたの回答：<strong>{{ question.choices[state.selectedAnswer] }}</strong></p>
      <p v-if="isCorrect" class="correct">✅ 正解です！</p>
      <p v-else class="incorrect">❌ 不正解...（正解：{{ question.answer }}）</p>
    </div>
    <button @click="goNext">次の問題へ</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { state } from '../store.js';

const router = useRouter();

const question = state.currentQuestion;
const selectedAnswerIndex = state.selectedAnswer;

const isCorrect = computed(() => {
  if (!question || selectedAnswerIndex === null) {
    return false;
  }
  return question.answer === String(selectedAnswerIndex + 1);
});

function goNext() {
  state.history.push({
    id: question.id,
    isCorrect: isCorrect.value,
    timestamp: new Date().toISOString(),
    selectedAnswer: state.selectedAnswer
  });

  const genreQuestions = state.questions.filter(q => q.genre === question.genre);
  const nextIndex = state.currentIndex + 1;

  if (nextIndex < genreQuestions.length) {
    state.currentIndex = nextIndex;
    state.currentQuestion = genreQuestions[nextIndex];
    state.selectedAnswer = null;
    router.push({ name: 'QuestionView' });
  } else {
    alert('このジャンルの問題は全て終了しました！');
    // ResultViewコンポーネントを作成していないため、Homeに戻る設定にする
    router.push({ name: 'Home' });
  }
}
</script>

<style scoped>
.explanation-container { padding: 20px; }
.explanation-text { font-size: 1.1rem; margin-bottom: 20px; line-height: 1.6; }
.result { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
.result p { margin: 0; }
.correct { color: green; font-weight: bold; }
.incorrect { color: red; font-weight: bold; }
button { padding: 10px 15px; font-size: 1rem; background-color: #dff0d8; border: 1px solid #ccc; border-radius: 6px; cursor: pointer; }
button:hover { background-color: #c8e5bc; }
</style>