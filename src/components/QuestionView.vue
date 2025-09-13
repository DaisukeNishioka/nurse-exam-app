<script setup>
import { state } from '../store.js'

// 現在の問題を取得
const question = state.currentQuestion

// 回答選択時の処理
function selectAnswer(index) {
  state.selectedAnswer = index
  state.currentView = 'explanation'
}
</script>

<template>
  <div v-if="question" class="question-view">
    <h2>問題 {{ question.id }}</h2>
    <p class="question-text">{{ question.text }}</p>

    <ul class="choices">
      <li v-for="(choice, index) in question.choices" :key="index">
        <button @click="selectAnswer(index)">
          {{ index + 1 }}. {{ choice }}
        </button>
      </li>
    </ul>
  </div>

  <div v-else>
    <p>問題が見つかりません。</p>
  </div>
</template>

<style scoped>
.question-view {
  margin-bottom: 2rem;
}

.question-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.choices {
  list-style: none;
  padding: 0;
}

.choices li {
  margin-bottom: 0.5rem;
}

button {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #f0f0f0;
}
</style>
