import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export const useNoteStore = defineStore('note', () => {
  const userStore = useUserStore()
  
  // 笔记数据按用户名分组存储
  const allUsersNotes = ref(JSON.parse(localStorage.getItem('allUsersNotes')) || {})
  const currentNoteId = ref(null)

  // 获取当前用户的笔记
  const notes = computed(() => {
    if (!userStore.username) return []
    return allUsersNotes.value[userStore.username] || []
  })

  // 获取当前选中的笔记
  const currentNote = computed(() => {
    return notes.value.find(note => note.id === currentNoteId.value)
  })

  // 生成自增ID
  const generateId = () => {
    const userNotes = notes.value
    const maxId = userNotes.reduce((max, note) => Math.max(max, note.id || 0), 0)
    return maxId + 1
  }

  // 创建新笔记
  const createNote = () => {
    if (!userStore.username) return null
    
    const newNote = {
      id: generateId(),
      title: '未命名笔记',
      content: '',
      tags: ['未分类'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 初始化用户笔记数组（如果不存在）
    if (!allUsersNotes.value[userStore.username]) {
      allUsersNotes.value[userStore.username] = []
    }
    
    allUsersNotes.value[userStore.username].unshift(newNote)
    currentNoteId.value = newNote.id
    saveToLocalStorage()
    
    return newNote
  }

  // 更新笔记
  const updateNote = (id, updates) => {
    if (!userStore.username) return
    
    const userNotes = allUsersNotes.value[userStore.username]
    if (!userNotes) return
    
    const index = userNotes.findIndex(note => note.id === id)
    if (index !== -1) {
      userNotes[index] = {
        ...userNotes[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  // 删除笔记
  const deleteNote = (id) => {
    if (!userStore.username) return
    
    const userNotes = allUsersNotes.value[userStore.username]
    if (!userNotes) return
    
    const index = userNotes.findIndex(note => note.id === id)
    if (index !== -1) {
      userNotes.splice(index, 1)
      
      // 如果删除的是当前选中的笔记，清空选择
      if (currentNoteId.value === id) {
        currentNoteId.value = userNotes.length > 0 ? userNotes[0]?.id : null
      }
      
      saveToLocalStorage()
    }
  }

  // 设置当前笔记
  const setCurrentNote = (id) => {
    currentNoteId.value = id
  }

  // 搜索笔记
  const searchNotes = (keyword) => {
    if (!keyword) return notes.value
    return notes.value.filter(note => 
      note.title.toLowerCase().includes(keyword.toLowerCase()) ||
      note.content.toLowerCase().includes(keyword.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    )
  }

  // 保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('allUsersNotes', JSON.stringify(allUsersNotes.value))
  }

  // 用户退出时清空当前用户数据
  const clearCurrentUserData = () => {
    currentNoteId.value = null
  }

  return {
    notes,
    currentNoteId,
    currentNote,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    searchNotes,
    clearCurrentUserData
  }
})