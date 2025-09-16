import liff from '@line/liff'

export const state = {
  userProfile: null,
  questions: [],
  currentQuestion: null,
  currentIndex: 0,
  selectedAnswer: null,
  selectedGenre: null,
  liffError: null
}

export async function initLiff() {
  try {
    await liff.init({ liffId: '2007960970-0XLPeGjN' })

    if (!liff.isLoggedIn()) {
      liff.login()
      return // ログイン後は自動で再読み込みされるため、ここで終了
    }

    state.userProfile = await liff.getProfile()
  } catch (e) {
    console.error('LIFF init failed:', e)
    state.liffError = e.message || 'LIFF初期化に失敗しました'
  }
}

export async function loadQuestionsFromSheet() {
  try {
    const response = await fetch('/questions.json') // ← ローカル or 公開URLに変更可能

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`)
    }

    const data = await response.json()
    console.log('Loaded questions:', data)

    if (Array.isArray(data)) {
      state.questions = data
    } else {
      throw new Error('問題データが配列ではありません')
    }
  } catch (e) {
    console.error('Failed to load questions:', e)
    state.liffError = e.message || '問題データの取得に失敗しました'
  }
}
