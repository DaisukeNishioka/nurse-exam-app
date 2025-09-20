/**
 * Google Sheets API v4 を使って、スプレッドシートから問題データを取得します。
 * 対象シートは「必修過去問」で、A列〜K列の構成に対応しています。
 */

export async function fetchQuestionsFromSheet() {
  const sheetId = import.meta.env.VITE_SHEET_ID
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

  console.log('sheetId:', sheetId)
  console.log('apiKey:', apiKey)

  const sheetNameRaw = 'Sheet1'
  const sheetName = encodeURIComponent(sheetNameRaw)
  console.log('シート名（元）:', sheetNameRaw)
  console.log('シート名（エンコード後）:', sheetName)

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
  console.log('取得URL:', url)

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTPエラー: ${res.status}`)
    }

    const data = await res.json()
    console.log('取得した生データ:', data)

    if (!data.values || !Array.isArray(data.values)) {
      throw new Error('取得データが不正です')
    }

    // ✅ 1行目（ヘッダー）を除外
    const rows = data.values.slice(1)
    console.log('取得した行数（ヘッダー除外後）:', rows.length)

    const questions = rows.map((row, index) => {
      console.log(`row[${index}] の長さ:`, row.length)
      return {
        id: index + 1,
        round: row[0] ?? '',
        examCode: row[1] ?? '',
        category: row[2] ?? '',
        text: row[3] ?? '',
        choices: [row[4], row[5], row[6], row[7]].filter(Boolean),
        answer: String(row[8] ?? '1'),
        genre: row[10]?.trim() ?? '',
        explanation: ''
      }
    })

    console.log('整形後の問題数:', questions.length)
    console.log('ジャンル一覧:', [...new Set(questions.map(q => q.genre).filter(g => g?.trim()))])

    return questions
  } catch (error) {
    console.error('スプレッドシートの読み込みに失敗しました:', error)
    return []
  }
}
