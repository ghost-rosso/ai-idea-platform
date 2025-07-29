<script setup>
defineProps(['ideas'])
defineEmits(['update:current'])
</script>

<template>
  <n-tree :data="ideas.map(i => ({
    key: i.id,
    label: i.title,
    ...i
  }))" @update:selected-keys="keys => $emit('update:current', ideas.find(i => i.id === keys[0]))" />
</template>