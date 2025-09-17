// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import liff from '@line/liff'

// `.env` から LIFF ID を読み込む
// LIFF ID が設定されていることを確認してから処理を進めます
const liffId = import.meta.env.VITE_LIFF_ID;
if (!liffId) {
  throw new Error('LIFF ID is not defined. Please check your .env file.');
}

// デバッグ用ログ
console.log('LIFF ID:', liffId);

async function initLiff() {
  try {
    await liff.init({ liffId });
    console.log('LIFF初期化成功');

    if (!liff.isLoggedIn()) {
      console.log('未ログインのため、LIFFログインページへリダイレクトします');
      liff.login();
    } else {
      console.log('ログイン済みです');
      
      // Vueアプリを起動
      const app = createApp(App);
      app.use(router);
      app.mount('#app');
    }

  } catch (error) {
    console.error('LIFF初期化エラー:', error);
    // エラーメッセージをユーザーに分かりやすく表示
    alert('アプリの初期化に失敗しました。時間をおいて再度お試しください。');
  }
}

initLiff();