// 丰富的建议词库
export const suggestionLibrary = {
  // 技术相关
  technical: [
    "尝试使用微服务架构提高系统可扩展性",
    "考虑引入容器化部署(Docker)简化运维",
    "使用Redis缓存提升系统性能",
    "采用GraphQL替代RESTful API优化数据查询",
    "引入WebSocket实现实时通信功能"
  ],
  
  // 设计相关
  design: [
    "采用暗色主题提升用户体验",
    "添加交互动画增强界面活力",
    "使用卡片式布局优化信息展示",
    "引入渐变色彩提升视觉层次感",
    "优化移动端响应式设计"
  ],
  
  // 功能相关
  feature: [
    "添加收藏功能让用户保存重要内容",
    "实现导出功能支持多种格式",
    "引入协作编辑支持多人实时协作",
    "添加版本历史记录更改轨迹",
    "实现数据备份和恢复功能"
  ],
  
  // 商业模式
  business: [
    "考虑Freemium模式吸引用户",
    "引入订阅制提供稳定收入",
    "开发企业版满足商业需求",
    "通过API服务创造额外价值",
    "建立合作伙伴生态系统"
  ],
  
  // 创新思路
  innovation: [
    "结合AR技术创造沉浸式体验",
    "利用区块链确保数据不可篡改",
    "引入AI个性化推荐算法",
    "探索元宇宙应用场景",
    "结合IoT设备扩展使用场景"
  ]
}

// 关键词匹配映射
export const keywordMapping = {
  // 技术关键词
  '技术': 'technical', '代码': 'technical', '编程': 'technical', '开发': 'technical',
  'API': 'technical', '数据库': 'technical', '服务器': 'technical', '架构': 'technical',
  
  // 设计关键词
  '设计': 'design', '界面': 'design', 'UI': 'design', 'UX': 'design',
  '美观': 'design', '布局': 'design', '色彩': 'design', '动画': 'design',
  
  // 功能关键词
  '功能': 'feature', '特性': 'feature', '需求': 'feature', '用户': 'feature',
  '体验': 'feature', '操作': 'feature', '流程': 'feature', '交互': 'feature',
  
  // 商业关键词
  '商业': 'business', '盈利': 'business', '收入': 'business', '市场': 'business',
  '竞争': 'business', '客户': 'business', '价值': 'business', '模式': 'business',
  
  // 创新关键词
  '创新': 'innovation', '创意': 'innovation', '新颖': 'innovation', '突破': 'innovation',
  '未来': 'innovation', '趋势': 'innovation', '科技': 'innovation', '智能': 'innovation'
}

// 相关灵感推荐库
export const relatedIdeas = [
  "智能笔记管理系统", "协同编辑平台", "知识图谱工具", "个人知识库", 
  "思维导图应用", "项目管理工具", "学习辅助系统", "创意孵化平台",
  "代码片段管理", "文档协作工具", "内容管理系统", "数据可视化平台"
]

// 提取内容中的关键词
export const extractKeywords = (content) => {
  if (!content) return ['general']
  
  const foundKeywords = []
  const contentLower = content.toLowerCase()
  
  // 检查每个关键词
  for (const [keyword, category] of Object.entries(keywordMapping)) {
    if (contentLower.includes(keyword.toLowerCase())) {
      if (!foundKeywords.includes(category)) {
        foundKeywords.push(category)
      }
    }
  }
  
  // 如果没有找到关键词，返回通用建议
  return foundKeywords.length > 0 ? foundKeywords : ['general']
}

// 生成AI建议
export const generateAISuggestions = (keywords, count = 3) => {
  const suggestions = []
  
  // 为每个关键词类别添加建议
  keywords.forEach(category => {
    const categorySuggestions = suggestionLibrary[category] || []
    const randomSuggestions = [...categorySuggestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.ceil(count / keywords.length))
    
    suggestions.push(...randomSuggestions)
  })
  
  // 如果建议不足，补充通用建议
  if (suggestions.length < count) {
    const generalSuggestions = [
      "考虑用户的核心需求和痛点",
      "分析市场竞争和差异化机会",
      "设计简洁直观的用户界面",
      "确保系统的可扩展性和维护性",
      "制定清晰的开发路线图和里程碑"
    ]
    
    const needed = count - suggestions.length
    const additional = [...generalSuggestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, needed)
    
    suggestions.push(...additional)
  }
  
  return suggestions.slice(0, count)
}

// 生成相关灵感推荐
export const generateRelatedIdeas = (count = 2) => {
  return [...relatedIdeas]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
}

// 或者简化版本
export const simulateAIThinking = (content) => {
  // 直接从所有建议中随机选择
  const allSuggestions = [
    ...suggestionLibrary.technical,
    ...suggestionLibrary.design,
    ...suggestionLibrary.feature,
    ...suggestionLibrary.business,
    ...suggestionLibrary.innovation
  ]
  
  const randomSuggestions = [...allSuggestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  
  const randomRelated = [...relatedIdeas]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
  
  return {
    suggestions: randomSuggestions,
    related: randomRelated,
    generatedAt: new Date().toLocaleTimeString()
  }
}