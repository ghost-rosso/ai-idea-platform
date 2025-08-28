<script setup>
import { ref, computed } from 'vue'
import { useNoteStore } from '@/stores/noteStore'
import { mockAIGenerate } from '@/services/aiMockService'
import { NCard, NButton, NList, NListItem, NThing, NSpace, NTag, NH4 } from 'naive-ui'

const noteStore = useNoteStore()
const isLoading = ref(false)
const aiResult = ref(null)

// 当前笔记内容
const currentContent = computed(() => {
  return noteStore.currentNote?.content || ''
})

// 生成AI建议
const generateSuggestions = async () => {
  if (!noteStore.currentNote) return

  isLoading.value = true

  try {
    const result = await mockAIGenerate(currentContent.value)
    aiResult.value = result.data
  } catch (error) {
    console.error('AI生成失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 应用建议到笔记
const applySuggestion = (suggestion) => {
  if (noteStore.currentNote) {
    const newContent = noteStore.currentNote.content + '\n\n## AI建议\n' + suggestion
    noteStore.updateNote(noteStore.currentNote.id, { content: newContent })
  }
}

// 自动分析内容变化（可选）
const shouldAutoGenerate = computed(() => {
  return currentContent.value && currentContent.value.length > 30 && !aiResult.value
})
</script>

<template>
  <n-card title="🤖 AI灵感助手" size="small" :bordered="false">
    <!-- 生成按钮 -->
    <n-button type="primary" block @click="generateSuggestions" :loading="isLoading" :disabled="!noteStore.currentNote"
      style="margin-bottom: 16px;">
      {{ isLoading ? '生成中...' : '💡 生成灵感建议' }}
    </n-button>

    <!-- AI建议结果 -->
    <div v-if="aiResult">
      <!-- AI建议 -->
      <n-h4 style="margin: 16px 0 8px 0; color: #438266; font-size: 14px;">
        🚀 优化建议
      </n-h4>
      <n-list>
        <n-list-item v-for="(suggestion, index) in aiResult.suggestions" :key="index">
          <n-thing content-style="font-size: 13px; line-height: 1.4;">
            {{ suggestion }}
            <template #footer>
              <n-button size="tiny" type="primary" text @click="applySuggestion(suggestion)">
                应用到笔记
              </n-button>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>

      <!-- 相关灵感 -->
      <n-h4 style="margin: 16px 0 8px 0; color: #438266; font-size: 14px;">
        💡 相关灵感
      </n-h4>
      <n-space vertical :size="6">
        <n-tag v-for="(idea, index) in aiResult.relatedIdeas" :key="'related-' + index" type="info" size="small"
          :bordered="false" style="cursor: pointer; background: #e3f2fd;" @click="applySuggestion(idea)">
          {{ idea }}
        </n-tag>
      </n-space>

      <!-- 生成时间 -->
      <div style="margin-top: 12px; text-align: center;">
        <n-tag size="tiny" type="default">
          生成于 {{ aiResult.generatedAt }}
        </n-tag>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!aiResult && !isLoading" style="text-align: center; padding: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 8px;">💡</div>
      <p style="color: #666; margin: 0; font-size: 13px;">
        {{
          noteStore.currentNote
            ? '点击按钮生成AI建议'
            : '请先选择或创建笔记'
        }}
      </p>
    </div>

    <!-- 自动生成提示 -->
    <div v-if="shouldAutoGenerate" style="text-align: center; margin-top: 12px;">
      <n-button size="tiny" type="primary" text @click="generateSuggestions">
        自动生成建议
      </n-button>
    </div>
  </n-card>
</template>

<style scoped>
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

/* 暗色主题适配 */
[data-theme="dark"] .n-list-item {
  border-bottom-color: #424242;
}

[data-theme="dark"] .n-tag[type="info"] {
  background: #1e3a5f !important;
  color: white !important;
}
</style>