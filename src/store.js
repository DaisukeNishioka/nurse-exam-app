// src/store.js
import { reactive } from 'vue';
import liff from '@line/liff';
import { fetchQuestions } from './services/sheets.js';

// 環境変数からLIFF IDを取得
const liffId = import.meta.env.VITE_LIFF_ID;

export const state = reactive({
  userProfile: null,
  questions: [],
  currentQuestion: null,
  currentIndex: 0,
  selectedAnswer: null,
  selectedGenre: null,
  liffError: null,
  history: []
});

export async function initLiff() {
  if (!liffId) {
    state.liffError = 'LIFF IDが設定されていません。';
    throw new Error("LIFF ID is not defined. Please check your .env file.");
  }
  
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    state.userProfile = await liff.getProfile();
  } catch (e) {
    console.error('LIFF初期化またはプロフィール取得に失敗:', e);
    state.liffError = e.message || 'LIFF初期化に失敗しました';
  }
}

export async function loadQuestionsFromSheet() {
  try {
    const questions = await fetchQuestions();
    if (Array.isArray(questions)) {
      state.questions = questions;
    } else {
      throw new Error('問題データが配列ではありません');
    }
  } catch (e) {
    console.error('問題データのロードに失敗:', e);
    state.liffError = e.message || '問題データの取得に失敗しました';
  }
}