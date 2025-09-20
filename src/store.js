import { reactive } from 'vue'

export const state = reactive({
  questions: [],             // 全問題データ
  filteredQuestions: [],     // 抽出された5問（ジャンル or ランダム）
  selectedGenre: null,       // 選択されたジャンル（ランダム時は null）
  currentIndex: 0,           // 現在の問題インデックス
  currentQuestion: null,     // 表示中の問題
  selectedAnswer: null,      // 選択された回答インデックス
  history: [],               // 解答履歴
  liffError: false           // LIFFエラー状態
})

// スプレッドシートから問題を取得して state.questions にセット
export async function loadQuestionsFromSheet() {
  const { fetchQuestionsFromSheet } = await import('./utils/fetchQuestions.js')
  const questions = await fetchQuestionsFromSheet()
  state.questions = questions
}
