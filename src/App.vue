<template>
  <div class="app">
    <header>
      <h1>看護師国家試験対策</h1>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 特にロジックは不要。<router-view /> がルーティングされたコンポーネントを表示します
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

main {
  min-height: 60vh;
}
</style>
