<script setup>
import { ref } from 'vue'

const props = defineProps(['keyword'])
const suggestion = ref(null)

const generateSuggestion = async () => {
  const res = await fetch('/api/ai/expand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: props.keyword })
  })

  const data = await res.json()
  suggestion.value = data.data
}
</script>

<template>
  <n-card title="AI灵感扩展">
    <n-button type="primary" @click="generateSuggestion" block>
      生成建议
    </n-button>

    <n-divider />

    <div v-if="suggestion">
      <n-h3>相关灵感</n-h3>
      <n-tag v-for="(idea, idx) in suggestion.relatedIdeas" :key="idx">
        {{ idea }}
      </n-tag>

      <n-h3 style="margin-top: 16px;">建议</n-h3>
      <p>{{ suggestion.suggestion }}</p>

      <n-h3 style="margin-top: 16px;">扩展内容</n-h3>
      <p>{{ suggestion.generatedContent }}</p>
    </div>
  </n-card>
</template>