// src/utils/fetchQuestions.js
export async function fetchQuestionsFromSheet() {
  const sheetId = '1AG0enW7fMWvABNZR3SWKZ39gpyvtWByYvhdU5ZZ8_3Y'
  const gid = '1677881967'
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`

  try {
    const res = await fetch(url)
    const text = await res.text()
    const json = JSON.parse(text.substr(47).slice(0, -2))

    const rows = json.table.rows.map((row, index) => ({
      id: index + 1,
      text: row.c[1]?.v || '',
      choices: [row.c[2]?.v, row.c[3]?.v, row.c[4]?.v].filter(Boolean),
      answer: (row.c[5]?.v || 1) - 1,
      explanation: row.c[6]?.v || ''
    }))

    return rows
  } catch (error) {
    console.error('スプレッドシートの読み込みに失敗しました:', error)
    return []
  }
}
