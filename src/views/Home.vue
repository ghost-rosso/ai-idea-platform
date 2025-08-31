<script setup>
import { NLayout, NLayoutSider, NLayoutContent, NH3, NEmpty, NDivider, NButton, NInput, NSpace, NModal } from 'naive-ui'
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useNoteStore } from '@/stores/noteStore'
import { simulateAIThinking } from '@/utils/aiMock'
import * as echarts from 'echarts'

const noteStore = useNoteStore()
const searchKeyword = ref('')
const showDeleteModal = ref(false)
const newTag = ref('')
const isLoadingAI = ref(false)
const aiResult = ref(null)
let chartInstance = null

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

// 灵感图谱相关函数
const initGraphData = () => {
  const nodes = noteStore.notes.map(note => ({
    id: note.id,
    name: note.title,
    symbolSize: 30 + (note.content.length / 20),
    itemStyle: {
      color: getNodeColor(note.tags)
    }
  }))

  const links = []
  // 创建关联关系
  for (let i = 0; i < nodes.length - 1; i++) {
    if (Math.random() > 0.4) {
      links.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
        value: '关联'
      })
    }
  }

  return { nodes, links }
}

// 根据标签获取节点颜色
const getNodeColor = (tags) => {
  const colorMap = {
    '教育': '#ff6b6b',
    '科技': '#4ecdc4',
    '区块链': '#45b7d1',
    '技术': '#f9ca24',
    'AI': '#6c5ce7',
    '未来': '#a29bfe',
    '元宇宙': '#fd79a8',
    '社交': '#00b894',
    '未分类': '#dfe6e9'
  }

  for (const tag of tags) {
    if (colorMap[tag]) {
      return colorMap[tag]
    }
  }
  return '#dfe6e9'
}

// 初始化图表
const initChart = () => {
  nextTick(() => {
    const chartDom = document.getElementById('idea-graph')
    if (!chartDom) return

    // 销毁旧的图表实例
    if (chartInstance) {
      chartInstance.dispose()
    }

    chartInstance = echarts.init(chartDom)
    const graphData = initGraphData()

    const option = {
      title: {
        text: '灵感关联图谱',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        formatter: function (params) {
          if (params.dataType === 'node') {
            const note = noteStore.notes.find(n => n.id === params.data.id)
            return `${note.title}<br/>标签: ${note.tags.join(', ')}`
          }
          return `${params.data.source} → ${params.data.target}`
        }
      },
      animation: true,
      series: [{
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 200,
          edgeLength: 100
        },
        roam: true,
        focusNodeAdjacency: true,
        data: graphData.nodes,
        links: graphData.links,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 8],
        lineStyle: {
          width: 2,
          curveness: 0.2
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 12
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3
          }
        }
      }]
    }

    chartInstance.setOption(option)

    // 添加点击事件
    chartInstance.on('click', (params) => {
      if (params.dataType === 'node') {
        const note = noteStore.notes.find(n => n.id === params.data.id)
        if (note) {
          noteStore.setCurrentNote(note.id)
        }
      }
    })
  })
}

// 响应窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听笔记数据变化，更新图谱
watch(() => noteStore.notes, () => {
  initChart()
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <n-layout has-sider style="height: 100%;">
    <!-- 左侧导航栏 -->
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="280" show-trigger
      content-style="padding: 16px; display: flex; flex-direction: column;">
      <!-- 搜索和操作区 -->
      <div style="margin-bottom: 16px;">
        <n-input v-model:value="searchKeyword" placeholder="搜索笔记..." clearable style="margin-bottom: 12px;" />
        <n-space>
          <n-button type="primary" size="small" @click="handleCreateNote">
            + 新建
          </n-button>
          <n-button type="error" size="small" @click="handleDeleteNote" :disabled="!noteStore.currentNote">
            - 删除
          </n-button>
        </n-space>
      </div>

      <!-- 笔记列表 -->
      <div style="flex: 1; overflow-y: auto;">
        <n-h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px;">我的笔记</n-h3>
        <n-empty v-if="filteredNotes.length === 0" :description="searchKeyword ? '未找到相关笔记' : '暂无笔记'" />
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
    <n-layout-content content-style="padding: 16px; display: flex; flex-direction: column;">
      <n-empty v-if="!noteStore.currentNote" description="请选择或创建笔记" />
      <template v-else>
        <!-- 标题编辑区 -->
        <div style="margin-bottom: 16px;">
          <input :value="noteStore.currentNote.title" @input="updateTitle($event.target.value)" placeholder="笔记标题"
            class="title-input" />
        </div>

        <!-- 标签编辑区 -->
        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <span v-for="tag in noteStore.currentNote.tags" :key="tag" class="tag editable" @click="removeTag(tag)">
              {{ tag }} ×
            </span>
          </div>
          <n-space>
            <n-input v-model:value="newTag" placeholder="添加标签" size="small" style="width: 120px;"
              @keypress.enter="addTag(newTag)" />
            <n-button size="small" @click="addTag(newTag)">添加</n-button>
          </n-space>
        </div>

        <!-- 内容编辑区 -->
        <textarea :value="noteStore.currentNote.content" @input="updateContent($event.target.value)"
          placeholder="开始书写你的灵感..." class="content-textarea"></textarea>

        <!-- 更新时间显示 -->
        <div style="margin-top: 12px; color: #666; font-size: 12px;">
          最后更新: {{ new Date(noteStore.currentNote.updatedAt).toLocaleString() }}
        </div>
      </template>

      <!-- 灵感图谱区域 -->
      <n-divider />
      <div class="graph-container">
        <div id="idea-graph" style="width: 100%; height: 300px;"></div>
      </div>
    </n-layout-content>

    <!-- 右侧AI面板 -->
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="20" :width="320" show-trigger
      content-style="padding: 16px; display: flex; flex-direction: column;" position="right">

      <!-- AI面板头部 -->
      <div style="margin-bottom: 16px;">
        <n-h3 style="margin-top: 0; margin-bottom: 12px;">🤖 AI灵感助手</n-h3>
        <n-button type="primary" block @click="generateAISuggestions" :loading="isLoadingAI"
          :disabled="!noteStore.currentNote?.content?.trim()" size="small">
          {{ isLoadingAI ? '思考中...' : '💡 生成灵感建议' }}
        </n-button>

        <n-button v-if="aiResult" size="small" block @click="clearAIResults" style="margin-top: 8px;">
          清空结果
        </n-button>
      </div>

      <!-- AI内容区域 -->
      <div style="flex: 1; overflow-y: auto;">
        <!-- 加载状态 -->
        <div v-if="isLoadingAI" style="text-align: center; padding: 20px;">
          <n-spin size="small" />
          <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">AI正在分析笔记内容...</p>
        </div>

        <!-- AI建议结果 -->
        <div v-else-if="aiResult" class="ai-results">
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
            <div class="suggestion-list">
              <div v-for="(suggestion, index) in aiResult.suggestions" :key="index" class="suggestion-item">
                <div class="suggestion-text">{{ suggestion }}</div>
                <n-button size="tiny" @click="applySuggestion(suggestion)" style="margin-top: 4px;">
                  应用到笔记
                </n-button>
              </div>
            </div>
          </div>

          <!-- 相关灵感 -->
          <div v-if="aiResult.related.length">
            <n-h4 style="margin: 0 0 8px 0; font-size: 13px; color: #438266;">相关灵感</n-h4>
            <n-space vertical :size="6">
              <n-tag v-for="(idea, index) in aiResult.related" :key="index" type="success" size="small"
                :bordered="false" style="cursor: pointer; padding: 4px 8px;" @click="applyRelatedIdea(idea)">
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
        <div v-else style="text-align: center; padding: 20px;">
          <p style="color: #666; margin: 0 0 8px 0; font-size: 13px;">📝 写点内容后生成AI建议</p>
          <p style="color: #999; margin: 0; font-size: 11px;">支持技术、设计、功能等关键词</p>
        </div>
      </div>
    </n-layout-sider>
  </n-layout>

  <!-- 删除确认模态框 -->
  <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除">
    <template #header>
      <div>确认删除</div>
    </template>
    <div style="padding: 20px;">
      确定要删除"{{ noteStore.currentNote?.title || '未命名笔记' }}"吗？此操作不可恢复。
    </div>
    <template #action>
      <n-space>
        <n-button @click="showDeleteModal = false">取消</n-button>
        <n-button type="error" @click="confirmDelete">确认删除</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped>
.idea-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.idea-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
  background: white;
}

.idea-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.idea-item.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
  font-weight: 500;
}

.idea-title {
  font-weight: 500;
  margin-bottom: 4px;
  word-break: break-word;
}

.idea-meta {
  font-size: 12px;
  color: #666;
  margin: 4px 0;
}

.idea-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 6px;
  background-color: #e0e0e0;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.tag.editable {
  cursor: pointer;
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
}

.tag.editable:hover {
  background-color: #bbdefb;
}

.tag-more {
  font-size: 11px;
  color: #999;
  background: none;
  border: none;
}

.title-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  outline: none;
}

.title-input:focus {
  border-color: #438266;
  box-shadow: 0 0 0 2px rgba(67, 130, 102, 0.2);
}

.content-textarea {
  flex: 1;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  line-height: 1.6;
  min-height: 300px;
  outline: none;
}

.content-textarea:focus {
  border-color: #438266;
  box-shadow: 0 0 0 2px rgba(67, 130, 102, 0.2);
}

.graph-container {
  margin-top: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

/* AI面板样式 */
.ai-results {
  padding: 4px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #438266;
}

.suggestion-text {
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 8px;
}

/* 暗色主题适配 */
[data-theme="dark"] .idea-item {
  border-color: #424242;
  background: #1e1e1e;
}

[data-theme="dark"] .idea-item:hover {
  background-color: #2d2d2d;
}

[data-theme="dark"] .idea-item.active {
  background-color: #1e3a5f;
  border-color: #1976d2;
}

[data-theme="dark"] .tag {
  background-color: #424242;
  color: #ccc;
}

[data-theme="dark"] .tag.editable {
  background-color: #1e3a5f;
  border-color: #1976d2;
}

[data-theme="dark"] .tag.editable:hover {
  background-color: #1565c0;
}

[data-theme="dark"] .title-input,
[data-theme="dark"] .content-textarea {
  background-color: #2d2d2d;
  border-color: #424242;
  color: white;
}

[data-theme="dark"] .title-input:focus,
[data-theme="dark"] .content-textarea:focus {
  border-color: #438266;
}

[data-theme="dark"] .graph-container {
  background-color: #1e1e1e;
  border-color: #424242;
}

[data-theme="dark"] .idea-meta {
  color: #999;
}

[data-theme="dark"] .suggestion-item {
  background: #2d2d2d;
  border-left-color: #438266;
}

[data-theme="dark"] .suggestion-text {
  color: #ccc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .graph-container {
    margin-top: 16px;
    padding: 12px;
  }

  #idea-graph {
    height: 250px !important;
  }

  .title-input {
    font-size: 16px;
    padding: 10px;
  }

  .content-textarea {
    min-height: 200px;
    padding: 12px;
  }
}
</style>