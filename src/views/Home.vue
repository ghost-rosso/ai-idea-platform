<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import IdeaTree from '@/components/idea/IdeaTree.vue'
import MarkdownEditor from '@/components/idea/MarkdownEditor.vue'
import AISuggestionPanel from '@/components/ai/AISuggestionPanel.vue'
import IdeaGraph from '@/components/idea/IdeaGraph.vue'

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
  <n-layout-content>
    <!-- 左侧内容 -->
    <template v-slot:sidebar>
      <n-h2>我的灵感</n-h2>
      <idea-tree :ideas="ideas" v-model:current="currentIdea" />
    </template>

    <!-- 中央内容 -->
    <template v-slot:default> <!-- 使用 default 插槽 -->
      <markdown-editor v-if="currentIdea" v-model="currentIdea.content" />

      <n-divider style="margin-top: 24px;" />
      <n-h2>灵感关联图谱</n-h2>
      <idea-graph :ideas="ideas" />
    </template>

    <!-- 右侧内容 -->
    <template v-slot:ai-panel>
      <ai-suggestion-panel v-if="currentIdea" :keyword="currentIdea.title" />
    </template>
  </n-layout-content>
</template>

<style scoped>
/* 移动端适配调整 */
@media (max-width: 768px) {

  /* 确保内容区在移动端有足够间距 */
  .n-layout-content {
    padding: 16px !important;
  }

  /* 图谱容器适配 */
  .idea-graph-container {
    height: 300px !important;
    overflow-x: auto;
  }
}
</style>