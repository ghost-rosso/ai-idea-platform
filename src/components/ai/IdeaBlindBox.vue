<script setup>
import { ref } from 'vue'

const ideaCombo = ref(null)
const loading = ref(false)

const generateCombo = async () => {
  loading.value = true
  // 模拟API请求
  const res = await fetch('/api/ai/blindbox')
  ideaCombo.value = await res.json()
  loading.value = false
}
</script>

<template>
  <n-card title="灵感盲盒" hoverable>
    <n-button @click="generateCombo" type="primary" :loading="loading" block>
      🎁 打开盲盒
    </n-button>

    <div v-if="ideaCombo" style="margin-top: 20px;">
      <n-h3>历史灵感</n-h3>
      <p>{{ ideaCombo.historyIdea.title }}</p>

      <n-h3>AI新创意</n-h3>
      <p>{{ ideaCombo.newIdea }}</p>
    </div>
  </n-card>
</template>