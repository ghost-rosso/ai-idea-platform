<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const users = ref([])
const ideas = ref([])

// 获取所有用户数据（模拟）
onMounted(async () => {
  const res = await fetch('/api/admin/users')
  users.value = await res.json()

  const res2 = await fetch('/api/admin/ideas')
  ideas.value = await res2.json()
})
</script>

<template>
  <n-card title="管理员控制面板">
    <n-tabs type="line">
      <n-tab-pane name="users" tab="用户管理">
        <n-data-table :columns="userColumns" :data="users" />
      </n-tab-pane>

      <n-tab-pane name="ideas" tab="内容管理">
        <n-data-table :columns="ideaColumns" :data="ideas" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>