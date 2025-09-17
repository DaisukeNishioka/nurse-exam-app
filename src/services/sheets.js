// src/services/sheets.js

/**
 * Google Sheetsから問題データを取得し、整形します。
 * スプレッドシートは「ウェブに公開」されている必要があります。
 */
export async function fetchQuestions() {
  // `fetchQuestions`関数は認証が不要なため、ここでは `VITE_SHEET_ID` をハードコードしても問題ありません。
  // ただし、一貫性を持たせるために環境変数を使用する方が良いでしょう。
  const sheetId = import.meta.env.VITE_SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }
    const text = await response.text();
    const jsonText = text.replace('google.visualization.Query.setResponse(', '').slice(0, -2);
    const data = JSON.parse(jsonText);
    const rows = data.table.rows;
    const questions = rows.map(row => {
      return {
        id: row.c[0]?.v,
        genre: row.c[1]?.v,
        text: row.c[2]?.v,
        choices: [
          row.c[3]?.v,
          row.c[4]?.v,
          row.c[5]?.v,
          row.c[6]?.v
        ].filter(c => c),
        answer: row.c[7]?.v,
        explanation: row.c[8]?.v
      };
    }).filter(q => q.id);
    return questions;
  } catch (err) {
    console.error('Google Sheetsからの問題取得に失敗:', err);
    throw err;
  }
}

/**
 * 学習履歴をGoogle Sheetsに保存します。
 */
export async function saveProgress(userId, genre, score) {
  // 環境変数からIDとAPIキーを取得
  const sheetId = import.meta.env.VITE_SHEET_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/履歴!A1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

  const body = {
    values: [[userId, genre, score, new Date().toLocaleString()]]
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('履歴保存エラー:', error);
    throw error;
  }
}