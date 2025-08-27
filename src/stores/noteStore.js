import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNoteStore = defineStore('note', () => {
  // 笔记数据
  const notes = ref(JSON.parse(localStorage.getItem('notes')) || [])
  const currentNoteId = ref(null)

  // 获取当前选中的笔记
  const currentNote = computed(() => {
    return notes.value.find(note => note.id === currentNoteId.value)
  })

  // 生成自增ID
  const generateId = () => {
    const maxId = notes.value.reduce((max, note) => Math.max(max, note.id || 0), 0)
    return maxId + 1
  }

  // 创建新笔记
  const createNote = () => {
    const newNote = {
      id: generateId(),
      title: '未命名笔记',
      content: '',
      tags: ['未分类'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    notes.value.unshift(newNote) // 新笔记放在最前面
    currentNoteId.value = newNote.id
    saveToLocalStorage()
    
    return newNote
  }

  // 更新笔记
  const updateNote = (id, updates) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  // 删除笔记
  const deleteNote = (id) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      
      // 如果删除的是当前选中的笔记，清空选择
      if (currentNoteId.value === id) {
        currentNoteId.value = notes.value.length > 0 ? notes.value[0].id : null
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
    localStorage.setItem('notes', JSON.stringify(notes.value))
  }

  return {
    notes,
    currentNoteId,
    currentNote,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    searchNotes
  }
})