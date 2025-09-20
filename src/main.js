import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import liff from '@line/liff';
import { state } from './store'; // ユーザー情報を保持する場合

const liffId = import.meta.env.VITE_LIFF_ID;
if (!liffId) {
  throw new Error('LIFF ID is not defined. Please check your .env file.');
}

console.log('LIFF ID:', liffId);

// Vueアプリを先に起動
const app = createApp(App);
app.use(router);
app.mount('#app');

// LIFF初期化は非同期で実行
initLiff();

async function initLiff() {
  try {
    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: 'https://nurse-exam-app.web.app' });

      return;
    }

    const profile = await liff.getProfile();
    state.userProfile = profile;

  } catch (error) {
    console.error('LIFF初期化エラー:', error);
    alert('LIFFの初期化に失敗しました。時間をおいて再度お試しください。');
  }
}
