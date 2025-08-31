<script setup>
import { ref, computed } from 'vue'
import { useNoteStore } from '@/stores/noteStore'
import { simulateAIThinking } from '@/utils/aiMock'
import { NCard, NButton, NList, NListItem, NThing, NSpace, NTag, NH4, NSpin } from 'naive-ui'

const noteStore = useNoteStore()
const isLoading = ref(false)
const aiResult = ref(null)

// 当前笔记内容
const currentContent = computed(() => {
  return noteStore.currentNote?.content || ''
})

// 生成AI建议
const generateSuggestions = async () => {
  if (!currentContent.value.trim()) {
    return
  }

  isLoading.value = true

  // 模拟AI思考延迟
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  try {
    aiResult.value = simulateAIThinking(currentContent.value)
  } catch (error) {
    console.error('AI生成失败:', error)
    aiResult.value = {
      suggestions: ['生成失败，请重试'],
      related: [],
      keywords: ['error']
    }
  } finally {
    isLoading.value = false
  }
}

// 应用建议到笔记
const applySuggestion = (suggestion) => {
  if (noteStore.currentNote) {
    const newContent = noteStore.currentNote.content + '\n\n## AI建议\n- ' + suggestion
    noteStore.updateNote(noteStore.currentNote.id, { content: newContent })
  }
}

// 应用相关灵感
const applyRelatedIdea = (idea) => {
  if (noteStore.currentNote) {
    const newContent = noteStore.currentNote.content + '\n\n## 相关灵感\n- ' + idea
    noteStore.updateNote(noteStore.currentNote.id, { content: newContent })
  }
}

// 清空AI结果
const clearResults = () => {
  aiResult.value = null
}
</script>

<template>
  <n-card title="🤖 AI灵感助手" size="small" :bordered="false">
    <!-- 操作按钮 -->
    <div style="margin-bottom: 16px;">
      <n-button type="primary" block @click="generateSuggestions" :loading="isLoading"
        :disabled="!currentContent.trim()">
        {{ isLoading ? '思考中...' : '💡 生成灵感建议' }}
      </n-button>

      <n-button v-if="aiResult" size="small" block @click="clearResults" style="margin-top: 8px;">
        清空结果
      </n-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" style="text-align: center; padding: 20px;">
      <n-spin size="small" />
      <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">AI正在分析笔记内容...</p>
    </div>

    <!-- AI建议结果 -->
    <div v-if="aiResult && !isLoading">
      <!-- 检测到的关键词 -->
      <div v-if="aiResult.keywords.length" style="margin-bottom: 16px;">
        <n-h4 style="margin: 0 0 8px 0; font-size: 13px; color: #438266;">检测到关键词</n-h4>
        <n-space>
          <n-tag v-for="keyword in aiResult.keywords" :key="keyword" size="small" type="info" :bordered="false">
            {{ keyword }}
          </n-tag>
        </n-space>
      </div>

      <!-- AI建议 -->
      <div style="margin-bottom: 16px;">
        <n-h4 style="margin: 0 0 8px 0; font-size: 13px; color: #438266;">AI建议</n-h4>
        <n-list size="small">
          <n-list-item v-for="(suggestion, index) in aiResult.suggestions" :key="index">
            <n-thing :title="`建议 ${index + 1}`" content-style="margin-top: 4px;">
              <template #description>
                <span style="font-size: 12px; color: #666;">{{ suggestion }}</span>
              </template>
              <template #footer>
                <n-button size="tiny" @click="applySuggestion(suggestion)" style="margin-top: 4px;">
                  应用到笔记
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </div>

      <!-- 相关灵感 -->
      <div v-if="aiResult.related.length">
        <n-h4 style="margin: 0 0 8px 0; font-size: 13px; color: #438266;">相关灵感</n-h4>
        <n-space vertical :size="6">
          <n-tag v-for="(idea, index) in aiResult.related" :key="index" type="success" size="small" :bordered="false"
            style="cursor: pointer; padding: 4px 8px;" @click="applyRelatedIdea(idea)">
            {{ idea }}
          </n-tag>
        </n-space>
      </div>

      <!-- 生成时间 -->
      <div style="margin-top: 12px; text-align: right;">
        <span style="font-size: 11px; color: #999;">生成于 {{ aiResult.generatedAt }}</span>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!aiResult && !isLoading" style="text-align: center; padding: 20px;">
      <p style="color: #666; margin: 0 0 8px 0; font-size: 13px;">📝 写点内容后生成AI建议</p>
      <p style="color: #999; margin: 0; font-size: 11px;">支持技术、设计、功能等关键词</p>
    </div>
  </n-card>
</template>

<style scoped>
.n-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.n-card :deep(.n-card__content) {
  flex: 1;
  overflow-y: auto;
}

.n-list {
  margin: 0 -12px;
}

.n-list-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.n-list-item:last-child {
  border-bottom: none;
}

.n-thing {
  padding: 4px 0;
}
</style>