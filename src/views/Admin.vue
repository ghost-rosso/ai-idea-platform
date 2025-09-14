<script setup>
import { ref, computed, h } from 'vue'
import { useNoteStore } from '@/stores/noteStore'
import { NDataTable, NButton, NH2, NTag, NSpace, NInput, NStatistic, NGrid, NGi, NCard } from 'naive-ui'

const noteStore = useNoteStore()
const searchKeyword = ref('')

// 笔记列定义
const noteColumns = [
  {
    title: '标题',
    key: 'title',
    ellipsis: true,
    render(row) {
      return h('div', { style: 'font-weight: 500; color: #8b7765;' }, row.title)
    }
  },
  {
    title: '标签',
    key: 'tags',
    render(row) {
      return h(
        NSpace,
        { size: 'small' },
        () => row.tags.slice(0, 3).map(tag =>
          h(NTag, {
            size: 'small',
            type: 'info',
            style: 'background: rgba(139, 119, 101, 0.1); color: #8b7765; border-color: #d4c5a8;'
          }, () => tag)
        )
      )
    }
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 120,
    render(row) {
      return h('div', { style: 'color: #8b7765; font-size: 12px;' },
        new Date(row.updatedAt).toLocaleDateString()
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'error',
          style: 'background: rgba(139, 119, 101, 0.1); color: #8b7765; border-color: #d4c5a8;',
          onClick: () => noteStore.deleteNote(row.id)
        },
        () => '删除'
      )
    }
  }
]

// 过滤笔记
const filteredNotes = computed(() => {
  if (!searchKeyword.value) return noteStore.notes
  return noteStore.notes.filter(note =>
    note.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 统计数据
const stats = computed(() => ({
  totalNotes: noteStore.notes.length,
  totalTags: new Set(noteStore.notes.flatMap(note => note.tags)).size,
  recentNotes: noteStore.notes.filter(note =>
    new Date(note.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length
}))
</script>

<template>
  <div class="admin-container">
    <!-- 标题 -->
    <n-h2 class="page-title">📊 笔记管理控制台</n-h2>

    <!-- 统计卡片 -->
    <n-grid :cols="3" :x-gap="16" :y-gap="16" style="margin-bottom: 28px;">
      <n-gi>
        <n-card class="stat-card" content-style="padding: 20px; text-align: center;">
          <n-statistic label="总笔记数" :value="stats.totalNotes">
            <template #suffix>篇</template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="stat-card" content-style="padding: 20px; text-align: center;">
          <n-statistic label="总标签数" :value="stats.totalTags">
            <template #suffix>个</template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="stat-card" content-style="padding: 20px; text-align: center;">
          <n-statistic label="7天更新" :value="stats.recentNotes">
            <template #suffix>篇</template>
          </n-statistic>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- 搜索和操作区 -->
    <n-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>笔记管理</span>
          <n-input v-model:value="searchKeyword" placeholder="搜索笔记标题或标签..." clearable style="width: 280px;"
            size="small">
            <template #prefix>
              <span style="color: #8b7765;">🔍</span>
            </template>
          </n-input>
        </div>
      </template>

      <!-- 笔记表格 -->
      <n-data-table :columns="noteColumns" :data="filteredNotes" :bordered="false" :row-class-name="() => 'table-row'"
        style="margin-bottom: 20px;" />

      <!-- 批量操作 -->
      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e8dfce;">
        <n-button type="primary" @click="$message.info('导出功能开发中')" class="action-btn">
          <template #icon>
            <span>📤</span>
          </template>
          导出所有笔记
        </n-button>

        <n-button style="margin-left: 12px;" @click="$message.info('备份功能开发中')" class="action-btn secondary">
          <template #icon>
            <span>💾</span>
          </template>
          备份数据
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #faf8f4 0%, #f5f1e9 100%);
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #8b7765 0%, #6d5d4f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

/* 统计卡片 */
.stat-card {
  background: linear-gradient(135deg, #f8f4e9 0%, #f1e8d8 100%) !important;
  border: 1px solid #e8dfce !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(139, 119, 101, 0.08);
}

:deep(.stat-card .n-statistic-label) {
  color: #8b7765 !important;
  font-weight: 500;
}

:deep(.stat-card .n-statistic-value) {
  color: #6d5d4f !important;
  font-weight: 600;
}

/* 内容卡片 */
.content-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid #e8dfce !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(139, 119, 101, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #8b7765;
}

/* 表格行样式 */
:deep(.table-row) {
  transition: background-color 0.2s ease;
}

:deep(.table-row:hover) {
  background-color: #f8f4e9 !important;
}

:deep(.table-row td) {
  border-bottom: 1px solid #f1e8d8 !important;
}

/* 操作按钮 */
.action-btn {
  background: linear-gradient(135deg, #a89276 0%, #8b7765 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  color: white !important;
  font-weight: 500;
}

.action-btn.secondary {
  background: linear-gradient(135deg, #d4c5a8 0%, #b8a98c 100%) !important;
  color: #6d5d4f !important;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 119, 101, 0.2);
}

/* 输入框样式 */
:deep(.n-input) {
  border: 1px solid #e8dfce !important;
  border-radius: 8px !important;
}

:deep(.n-input:focus) {
  border-color: #8b7765 !important;
  box-shadow: 0 0 0 2px rgba(139, 119, 101, 0.2) !important;
}

/* 暗色主题适配 */
[data-theme="dark"] .admin-container {
  background: linear-gradient(135deg, #2a241d 0%, #3a3229 100%);
}

[data-theme="dark"] .content-card {
  background: rgba(42, 36, 29, 0.95) !important;
  border-color: #443c31 !important;
}

[data-theme="dark"] .stat-card {
  background: linear-gradient(135deg, #3a3229 0%, #2a241d 100%) !important;
  border-color: #443c31 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-container {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  :deep(.n-input) {
    width: 100% !important;
  }

  .n-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>