<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue)

watch(content, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <n-input v-model:value="content" type="textarea" placeholder="写下你的灵感..." :autosize="{ minRows: 10 }" />

  <!-- 预览区域 -->
  <n-divider />
  <n-h3>预览</n-h3>
  <div v-html="content" class="markdown-preview"></div>
</template>

<style scoped>
.markdown-preview {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
