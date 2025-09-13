import { createApp } from 'vue'
import App from './App.vue'
import liff from '@line/liff'
import { state } from './store.js'

console.log('✅ main.js が読み込まれました')

// LIFF ID（LINE Developersで発行されたもの）
const liffId = '2007960970-0XLPeGjN'

// LIFF SDKのキャッシュを削除（必要に応じて）
const clearLiffCache = (id) => {
  const prefix = `LIFF_STORE:${id}:`
  const keysToDelete = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith(prefix)) {
      keysToDelete.push(key)
    }
  }
  keysToDelete.forEach(key => {
    localStorage.removeItem(key)
    console.log(`🧹 キャッシュ削除: ${key}`)
  })
}
clearLiffCache(liffId)

// 🔄 ログイン後のURLに code= が含まれていたら、クエリだけ消す（リロードなし）
if (window.location.href.includes('code=') && !sessionStorage.getItem('liffRedirected')) {
  sessionStorage.setItem('liffRedirected', 'true')
  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState({}, document.title, cleanUrl)
  console.log('🔧 URLのクエリを削除しました')
}

// LIFF初期化
liff.init({ liffId })
  .then(() => {
    console.log('✅ LIFF initialized')
    state.isInClient = liff.isInClient()

    if (!liff.isInClient) {
      console.warn('⚠️ LINEアプリ外で開かれました')
    }

    if (!liff.isLoggedIn()) {
      console.log('🔁 LINEログイン開始')
      liff.login()
      return
    }

    console.log('🔓 ログイン済み、プロフィール取得中...')
    return liff.getProfile()
  })
  .then(profile => {
    if (profile) {
      console.log('🙋‍♂️ プロフィール取得:', profile)
      state.userProfile = profile
    }

    // 📦 Google Sheets APIから質問データを取得（必修過去問シート）
    const spreadsheetId = '1AG0enW7fMWvABNZR3SWKZ39gpyvtWByYvhdU5ZZ8_3Y'
    const range = '必修過去問!A2:J'
    const apiKey = 'AIzaSyDUInm7YWb6EvC5A6VENTC7OzpyxtswMkg'
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

    fetch(sheetsUrl)
      .then(res => res.json())
      .then(data => {
        state.apiRaw = data // ← 生レスポンスを保存（App.vueで表示できる）

        if (!data.values) {
          console.error('❌ スプレッドシートにデータがありません')
          state.questions = []
          return
        }

        state.questions = data.values.map(row => ({
          question: row[3], // D列：問題文
          genre: row[8]     // I列：ジャンル
        }))
        console.log('📦 質問データ:', state.questions)
      })
      .catch(err => {
        console.error('❌ 質問データ取得エラー:', err)
        state.questions = []
      })

    // Vueアプリをマウント
    const app = createApp(App)
    app.provide('userProfile', profile)
    app.mount('#app')

    console.log('🚀 Vueアプリがマウントされました')
  })
  .catch(err => {
    console.error('❌ LIFFエラー:', err)
    state.liffError = err.message

    // エラー時も Vue をマウントしてエラー画面を表示可能に
    const app = createApp(App)
    app.mount('#app')
  })
