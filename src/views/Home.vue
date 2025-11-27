<script setup>
import { NLayout, NLayoutSider, NLayoutContent, NH3, NEmpty, NDivider, NButton, NInput, NSpace, NModal } from 'naive-ui'
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useNoteStore } from '@/stores/noteStore'
import { simulateAIThinking } from '@/utils/aiMock'

const noteStore = useNoteStore()
const searchKeyword = ref('')
const showDeleteModal = ref(false)
const newTag = ref('')
const isLoadingAI = ref(false)
const aiResult = ref(null)

// 过滤后的笔记列表
const filteredNotes = computed(() => {
  return noteStore.searchNotes(searchKeyword.value)
})

// 创建新笔记
const handleCreateNote = () => {
  noteStore.createNote()
}

// 删除当前笔记
const handleDeleteNote = () => {
  if (noteStore.currentNote) {
    showDeleteModal.value = true
  }
}

// 确认删除
const confirmDelete = () => {
  if (noteStore.currentNote) {
    noteStore.deleteNote(noteStore.currentNote.id)
    showDeleteModal.value = false
  }
}

// 更新笔记标题
const updateTitle = (title) => {
  if (noteStore.currentNote) {
    noteStore.updateNote(noteStore.currentNote.id, { title })
  }
}

// 更新笔记内容
const updateContent = (content) => {
  if (noteStore.currentNote) {
    noteStore.updateNote(noteStore.currentNote.id, { content })
  }
}

// 添加标签
const addTag = (tag) => {
  if (noteStore.currentNote && tag.trim()) {
    const newTags = [...new Set([...noteStore.currentNote.tags, tag.trim()])]
    noteStore.updateNote(noteStore.currentNote.id, { tags: newTags })
    newTag.value = ''
  }
}

// 删除标签
const removeTag = (tagToRemove) => {
  if (noteStore.currentNote) {
    const newTags = noteStore.currentNote.tags.filter(tag => tag !== tagToRemove)
    noteStore.updateNote(noteStore.currentNote.id, { tags: newTags })
  }
}

// AI建议功能
const generateAISuggestions = async () => {
  if (!noteStore.currentNote?.content.trim()) return

  isLoadingAI.value = true
  aiResult.value = null

  // 模拟AI处理延迟
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  try {
    aiResult.value = simulateAIThinking(noteStore.currentNote.content)
  } catch (error) {
    console.error('AI生成失败:', error)
    aiResult.value = {
      suggestions: ['生成失败，请重试'],
      related: [],
      keywords: ['error']
    }
  } finally {
    isLoadingAI.value = false
  }
}

// 应用AI建议到笔记
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
const clearAIResults = () => {
  aiResult.value = null
}
</script>

<template>
  <n-layout has-sider class="main-layout">
    <!-- 左侧导航栏 -->
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="300" show-trigger class="sidebar">
      <!-- 搜索和操作区 -->
      <div class="sidebar-header">
        <n-input v-model:value="searchKeyword" placeholder="搜索笔记..." clearable class="search-input">
          <template #prefix>
            <span class="search-icon">🔍</span>
          </template>
        </n-input>
        <n-space class="action-buttons">
          <n-button type="primary" size="small" @click="handleCreateNote" class="create-btn">
            <template #icon>
              <span>➕</span>
            </template>
            新建
          </n-button>
          <n-button type="error" size="small" @click="handleDeleteNote" :disabled="!noteStore.currentNote"
            class="delete-btn">
            <template #icon>
              <span>🗑️</span>
            </template>
            删除
          </n-button>
        </n-space>
      </div>

      <!-- 笔记列表 -->
      <div class="notes-container">
        <n-h3 class="notes-title">我的笔记</n-h3>
        <n-empty v-if="filteredNotes.length === 0" :description="searchKeyword ? '未找到相关笔记' : '暂无笔记'"
          class="empty-state" />
        <div v-else class="idea-list">
          <div v-for="note in filteredNotes" :key="note.id"
            :class="['idea-item', { active: noteStore.currentNoteId === note.id }]"
            @click="noteStore.setCurrentNote(note.id)">
            <div class="idea-title">{{ note.title || '未命名笔记' }}</div>
            <div class="idea-meta">
              {{ new Date(note.updatedAt).toLocaleDateString() }}
            </div>
            <div class="idea-tags">
              <span v-for="tag in note.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              <span v-if="note.tags.length > 2" class="tag-more">+{{ note.tags.length - 2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </n-layout-sider>

    <!-- 中央编辑器 -->
    <n-layout-content class="editor-content">
      <n-empty v-if="!noteStore.currentNote" description="请选择或创建笔记" class="empty-editor" />
      <template v-else>
        <!-- 标题编辑区 -->
        <div class="editor-header">
          <input :value="noteStore.currentNote.title" @input="updateTitle($event.target.value)" placeholder="笔记标题"
            class="title-input" />
        </div>

        <!-- 标签编辑区 -->
        <div class="tags-section">
          <div class="tags-container">
            <span v-for="tag in noteStore.currentNote.tags" :key="tag" class="tag editable" @click="removeTag(tag)">
              {{ tag }} ×
            </span>
          </div>
          <n-space class="tag-input-container">
            <n-input v-model:value="newTag" placeholder="添加标签" size="small" class="tag-input"
              @keypress.enter="addTag(newTag)" />
            <n-button size="small" @click="addTag(newTag)" class="add-tag-btn">添加</n-button>
          </n-space>
        </div>

        <!-- 内容编辑区 -->
        <textarea :value="noteStore.currentNote.content" @input="updateContent($event.target.value)"
          placeholder="开始书写你的灵感..." class="content-textarea"></textarea>

        <!-- 更新时间显示 -->
        <div class="update-time">
          最后更新: {{ new Date(noteStore.currentNote.updatedAt).toLocaleString() }}
        </div>
      </template>
    </n-layout-content>

    <!-- 右侧AI面板 -->
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="20" :width="340" show-trigger position="right"
      class="ai-sidebar">
      <!-- AI面板头部 -->
      <div class="ai-header">
        <n-h3 class="ai-title">🤖 AI灵感助手</n-h3>
        <n-button type="primary" block @click="generateAISuggestions" :loading="isLoadingAI"
          :disabled="!noteStore.currentNote?.content?.trim()" size="small" class="ai-generate-btn">
          <template #icon>
            <span>💡</span>
          </template>
          {{ isLoadingAI ? '思考中...' : '生成灵感建议' }}
        </n-button>

        <n-button v-if="aiResult" size="small" block @click="clearAIResults" class="ai-clear-btn"
          style="margin-top: 12px;">
          清空结果
        </n-button>
      </div>

      <!-- AI内容区域 -->
      <div class="ai-content">
        <!-- 加载状态 -->
        <div v-if="isLoadingAI" class="ai-loading">
          <n-spin size="small" />
          <p>AI正在分析笔记内容...</p>
        </div>

        <!-- AI建议结果 -->
        <div v-else-if="aiResult" class="ai-results">
          <!-- AI建议 -->
          <div class="suggestions-section">
            <n-h4 class="section-title">AI建议</n-h4>
            <div class="suggestion-list">
              <div v-for="(suggestion, index) in aiResult.suggestions" :key="index" class="suggestion-item">
                <div class="suggestion-text">{{ suggestion }}</div>
                <n-button size="tiny" @click="applySuggestion(suggestion)" class="apply-btn">
                  应用到笔记
                </n-button>
              </div>
            </div>
          </div>

          <!-- 相关灵感 -->
          <div v-if="aiResult.related.length" class="related-section">
            <n-h4 class="section-title">相关灵感</n-h4>
            <n-space vertical :size="6" class="related-container">
              <n-tag v-for="(idea, index) in aiResult.related" :key="index" type="success" size="small"
                :bordered="false" class="related-tag" @click="applyRelatedIdea(idea)">
                {{ idea }}
              </n-tag>
            </n-space>
          </div>

          <!-- 生成时间 -->
          <div class="generation-time">
            生成于 {{ aiResult.generatedAt }}
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="ai-empty">
          <p class="empty-text">📝 写点内容后生成AI建议</p>
          <p class="empty-subtext">支持技术、设计、功能等关键词</p>
        </div>
      </div>
    </n-layout-sider>
  </n-layout>

  <!-- 删除确认模态框 -->
  <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" class="delete-modal">
    <template #header>
      <div class="modal-title">确认删除</div>
    </template>
    <div class="modal-content">
      确定要删除"{{ noteStore.currentNote?.title || '未命名笔记' }}"吗？此操作不可恢复。
    </div>
    <template #action>
      <n-space>
        <n-button @click="showDeleteModal = false" class="modal-cancel-btn">取消</n-button>
        <n-button type="error" @click="confirmDelete" class="modal-confirm-btn">确认删除</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped>
/* 主布局 */
.main-layout {
  height: 100vh;
  background: linear-gradient(135deg, #faf8f4 0%, #f5f1e9 100%);
}

/* 左侧边栏 */
.sidebar {
  background: linear-gradient(135deg, #f8f4e9 0%, #f1e8d8 100%) !important;
  border-right: 1px solid #e8dfce !important;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e8dfce;
}

.search-input {
  border: 1px solid #e8dfce !important;
  border-radius: 8px !important;
}

.search-input:focus {
  border-color: #8b7765 !important;
  box-shadow: 0 0 0 2px rgba(139, 119, 101, 0.2) !important;
}

.search-icon {
  color: #8b7765;
}

.action-buttons {
  margin-top: 12px;
}

.create-btn {
  background: linear-gradient(135deg, #ade2e4 0%, #a9cdf7 100%) !important;
  border: none !important;
  color: white !important;
}

.delete-btn {
  background: rgba(220, 148, 226, 0.515) !important;
  border: 1px solid #d4c5a8 !important;
  color: #8b7765 !important;
}

/* 笔记列表 */
.notes-container {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.notes-title {
  color: #8b7765;
  margin: 0 0 16px 0 !important;
  font-size: 16px;
  font-weight: 600;
}

.empty-state {
  color: #8b7765;
}

.idea-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.idea-item {
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #e8dfce;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.idea-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(139, 119, 101, 0.1);
  border-color: #d4c5a8;
}

.idea-item.active {
  background: linear-gradient(135deg, #e8dfce 0%, #d4c5a8 100%) !important;
  border-color: #8b7765;
  box-shadow: 0 4px 16px rgba(139, 119, 101, 0.15);
}

.idea-title {
  font-weight: 600;
  margin-bottom: 6px;
  word-break: break-word;
  color: #6d5d4f;
}

.idea-meta {
  font-size: 12px;
  color: #8b7765;
  margin: 4px 0;
}

.idea-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 8px;
  background: rgba(139, 119, 101, 0.1);
  border-radius: 12px;
  font-size: 11px;
  color: #8b7765;
  border: 1px solid rgba(139, 119, 101, 0.2);
}

.tag.editable {
  cursor: pointer;
  background: rgba(139, 119, 101, 0.15) !important;
}

.tag.editable:hover {
  background: rgba(139, 119, 101, 0.25) !important;
}

.tag-more {
  font-size: 11px;
  color: #8b7765;
}

/* 编辑器区域 */
.editor-content {
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
}

.empty-editor {
  color: #8b7765;
}

.editor-header {
  margin-bottom: 20px;
}

.title-input {
  width: 95%;
  padding: 16px;
  border: 1px solid #e8dfce;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  color: #6d5d4f;
}

.title-input:focus {
  border-color: #8b7765;
  box-shadow: 0 0 0 2px rgba(139, 119, 101, 0.2);
}

.tags-section {
  margin-bottom: 20px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-input-container {
  align-items: center;
}

.tag-input {
  border: 1px solid #e8dfce !important;
  border-radius: 8px !important;
}

.add-tag-btn {
  background: rgba(211, 182, 237, 0.988) !important;
  border: 1px solid #d4c5a8 !important;
  color: #8b7765 !important;
}

.content-textarea {
  flex: 1;
  padding: 20px;
  border: 1px solid #e8dfce;
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  line-height: 1.6;
  min-height: 300px;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  color: #6d5d4f;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.content-textarea:focus {
  border-color: #8b7765;
  box-shadow: 0 0 0 2px rgba(139, 119, 101, 0.2);
}

.update-time {
  margin-top: 12px;
  color: #8b7765;
  font-size: 12px;
  text-align: right;
}

/* AI侧边栏 */
.ai-sidebar {
  background: linear-gradient(135deg, #f8f4e9 0%, #f1e8d8 100%) !important;
  border-left: 1px solid #e8dfce !important;
}

.ai-header {
  padding: 20px;
  border-bottom: 1px solid #e8dfce;
}

.ai-title {
  color: #8b7765;
  margin: 0 0 16px 0 !important;
  font-size: 16px;
  font-weight: 600;
}

.ai-generate-btn {
  background: linear-gradient(135deg, #ade2e4 0%, #a9cdf7 100%) !important;
  border: none !important;
  color: white !important;
}

.ai-clear-btn {
  background: rgba(220, 148, 226, 0.515) !important;
  border: 1px solid #d4c5a8 !important;
  color: #ffffff !important;
}

.ai-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.ai-loading {
  text-align: center;
  padding: 40px 20px;
  color: #8b7765;
}

.keywords-section,
.suggestions-section,
.related-section {
  margin-bottom: 20px;
}

.section-title {
  color: #8b7765;
  margin: 0 0 12px 0 !important;
  font-size: 14px;
  font-weight: 600;
}

.keyword-tag {
  background: rgba(139, 119, 101, 0.1) !important;
  color: #8b7765 !important;
  border: 1px solid #d4c5a8 !important;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border-left: 4px solid #8b7765;
  backdrop-filter: blur(10px);
}

.suggestion-text {
  font-size: 13px;
  line-height: 1.5;
  color: #6d5d4f;
  margin-bottom: 8px;
}

.apply-btn {
  background: rgba(139, 119, 101, 0.1) !important;
  border: 1px solid #d4c5a8 !important;
  color: #8b7765 !important;
}

.related-tag {
  background: rgba(139, 119, 101, 0.1) !important;
  color: #8b7765 !important;
  border: 1px solid #d4c5a8 !important;
  cursor: pointer;
}

.related-tag:hover {
  background: rgba(139, 119, 101, 0.2) !important;
}

.generation-time {
  text-align: right;
  color: #8b7765;
  font-size: 11px;
  margin-top: 16px;
}

.ai-empty {
  text-align: center;
  padding: 40px 20px;
  color: #8b7765;
}

.empty-text {
  margin: 0 0 8px 0;
  font-size: 13px;
}

.empty-subtext {
  margin: 0;
  font-size: 11px;
  color: #8b7765;
}

/* 模态框 */
.delete-modal :deep(.n-card) {
  background: linear-gradient(135deg, #f8f4e9 0%, #f1e8d8 100%) !important;
  border: 1px solid #e8dfce !important;
}

.modal-title {
  color: #8b7765;
  font-weight: 600;
}

.modal-content {
  color: #6d5d4f;
  padding: 20px;
}

.modal-cancel-btn {
  background: rgba(139, 119, 101, 0.1) !important;
  border: 1px solid #d4c5a8 !important;
  color: #8b7765 !important;
}

.modal-confirm-btn {
  background: linear-gradient(135deg, #a89276 0%, #8b7765 100%) !important;
  border: none !important;
  color: white !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-content {
    padding: 16px;
  }

  .title-input {
    font-size: 18px;
    padding: 12px;
  }

  .content-textarea {
    min-height: 200px;
    padding: 16px;
  }

  .ai-sidebar {
    width: 280px !important;
  }
}

/* 暗色主题适配 */
[data-theme="dark"] .main-layout {
  background: linear-gradient(135deg, #2a241d 0%, #3a3229 100%);
}

[data-theme="dark"] .editor-content {
  background: rgba(42, 36, 29, 0.95);
}

[data-theme="dark"] .title-input,
[data-theme="dark"] .content-textarea {
  background: rgba(58, 50, 41, 0.9);
  color: #d4c5a8;
  border-color: #5a5043;
}

[data-theme="dark"] .idea-item {
  background: rgba(58, 50, 41, 0.8);
  border-color: #5a5043;
  color: #d4c5a8;
}

[data-theme="dark"] .idea-item.active {
  background: linear-gradient(135deg, #5a5043 0%, #443c31 100%) !important;
}

[data-theme="dark"] .idea-title {
  color: #d4c5a8;
}

[data-theme="dark"] .idea-meta {
  color: #b8a98c;
}

[data-theme="dark"] .tag {
  background: rgba(139, 119, 101, 0.2);
  color: #b8a98c;
  border-color: #5a5043;
}

[data-theme="dark"] .update-time {
  color: #b8a98c;
}

[data-theme="dark"] .suggestion-item {
  background: rgba(58, 50, 41, 0.8);
  color: #d4c5a8;
}
</style>