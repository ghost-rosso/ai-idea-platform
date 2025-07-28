<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import IdeaTree from '@/components/idea/IdeaTree.vue'
import MarkdownEditor from '@/components/idea/MarkdownEditor.vue'
import AISuggestionPanel from '@/components/ai/AISuggestionPanel.vue'

const userStore = useUserStore()
const ideas = ref([])
const currentIdea = ref(null)

onMounted(async () => {
  // 模拟API请求
  const res = await fetch('/api/ideas')
  const data = await res.json()
  ideas.value = data.data
  if (ideas.value.length > 0) {
    currentIdea.value = ideas.value[0]
  }
})
</script>

<template>
  <n-layout has-sider>
    <!-- 左侧导航 -->
    <n-layout-sider width="240" content-style="padding: 24px;">
      <n-h2>我的灵感</n-h2>
      <idea-tree :ideas="ideas" v-model:current="currentIdea" />
    </n-layout-sider>

    <!-- 中央编辑器 -->
    <n-layout-content content-style="padding: 24px;">
      <markdown-editor v-if="currentIdea" v-model="currentIdea.content" />
    </n-layout-content>

    <!-- 右侧AI面板 -->
    <n-layout-sider width="300" content-style="padding: 24px;">
      <ai-suggestion-panel v-if="currentIdea" :keyword="currentIdea.title" />
    </n-layout-sider>
  </n-layout>
</template>