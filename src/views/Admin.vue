<script setup>
import { ref, computed, h } from 'vue' // 导入 h 函数
import { useNoteStore } from '@/stores/noteStore'
import { NDataTable, NButton, NH2, NTag, NSpace, NInput } from 'naive-ui'

const noteStore = useNoteStore()
const searchKeyword = ref('')

// 修复的笔记列定义 - 使用 h 函数
const noteColumns = [
  {
    title: '标题',
    key: 'title',
    ellipsis: true
  },
  {
    title: '标签',
    key: 'tags',
    render(row) {
      return h(
        NSpace,
        { size: 'small' },
        () => row.tags.slice(0, 3).map(tag =>
          h(NTag, { size: 'small', type: 'info' }, () => tag)
        )
      )
    }
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 120,
    render(row) {
      return new Date(row.updatedAt).toLocaleDateString()
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
    note.title.includes(searchKeyword.value) ||
    note.tags.some(tag => tag.includes(searchKeyword.value))
  )
})

// 统计数据
const stats = computed(() => ({
  totalNotes: noteStore.notes.length,
  totalTags: new Set(noteStore.notes.flatMap(note => note.tags)).size
}))
</script>

<template>
  <div style="padding: 20px; max-width: 1000px; margin: 0 auto;">
    <n-h2>📊 笔记管理</n-h2>

    <!-- 简单统计 -->
    <div style="display: flex; gap: 20px; margin-bottom: 24px;">
      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; text-align: center; flex: 1;">
        <div style="font-size: 24px; font-weight: bold; color: #438266;">{{ stats.totalNotes }}</div>
        <div style="color: #666;">总笔记数</div>
      </div>
      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; text-align: center; flex: 1;">
        <div style="font-size: 24px; font-weight: bold; color: #438266;">{{ stats.totalTags }}</div>
        <div style="color: #666;">总标签数</div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div style="margin-bottom: 16px;">
      <n-input v-model:value="searchKeyword" placeholder="搜索笔记标题或标签..." clearable style="max-width: 300px;" />
    </div>

    <!-- 笔记表格 -->
    <n-data-table :columns="noteColumns" :data="filteredNotes" :bordered="false" style="margin-bottom: 24px;" />

    <!-- 批量操作 -->
    <div style="text-align: center;">
      <n-button type="primary" @click="$message.info('导出功能开发中')">
        导出所有笔记
      </n-button>
    </div>
  </div>
</template>