<template>
  <div>
    <h2>必修過去問データ</h2>
    <ul>
      <li v-for="(row, index) in sheetData" :key="index">
        {{ row }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sheetData = ref([])

// `.env` から環境変数を取得
const sheetId = import.meta.env.VITE_SHEET_ID
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

// Google Sheets API のリクエストURLを構築
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/必修過去問!A1:I126?key=${apiKey}`

// ✅ デバッグログ（ここが重要！）
console.log('APIキー:', apiKey)
console.log('シートID:', sheetId)
console.log('リクエストURL:', url)

onMounted(async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    // ✅ レスポンス確認
    console.log('取得したデータ:', data)

    if (data.values) {
      sheetData.value = data.values
    } else {
      console.warn('データが空です')
    }
  } catch (err) {
    console.error('取得エラー:', err)
    alert('データの取得に失敗しました。APIキーやシートIDを確認してください。')
  }
})
</script>
