import { reactive } from 'vue'

// ✅ アプリ全体で共有する状態
export const state = reactive({
  userProfile: null,     // LINEログイン後のプロフィール情報
  questions: [],         // Google Sheets から取得した問題データ
  apiRaw: null,          // 生レスポンス（デバッグ用）
  isInClient: false,     // LINEアプリ内かどうか
  liffError: null,       // LIFF初期化エラー
  currentView: 'genre',  // 現在の画面ビュー
  currentIndex: 0,       // ジャンル内の問題インデックス
  currentQuestion: null, // 現在表示中の問題
  selectedAnswer: null   // ユーザーが選択した回答
})

// ✅ 環境変数から API キーとシートIDを取得
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
const sheetId = import.meta.env.VITE_SHEET_ID

// ✅ Google Sheets API から問題データを取得
export async function loadQuestionsFromSheet() {
  const range = 'シート1!A2:J100' // A〜J列まで読み込む（ヘッダー除外）

  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
    const data = await res.json()

    state.apiRaw = data // デバッグ用に保存

    if (!data.values) {
      console.error('❌ データが取得できませんでした:', data)
      return
    }

    const rows = data.values

    // ✅ 各行を問題オブジェクトに整形
    state.questions = rows.map(([round, id, category, text, choicesRaw, answer, count, hasImage, genre, note]) => {
      const choices = choicesRaw ? choicesRaw.split('／') : ['選択肢が未設定']
      return {
        round,
        id: Number(id),
        category,
        text: text || '問題文が未設定',
        choices,
        answer: Number(answer),
        count,
        hasImage,
        genre: genre?.trim() || '未分類',
        note
      }
    })

    console.log('✅ 問題データを読み込みました:', state.questions.length)
  } catch (error) {
    console.error('❌ Google Sheets API 読み込みエラー:', error)
    state.liffError = '問題データの取得に失敗しました'
  }
}
