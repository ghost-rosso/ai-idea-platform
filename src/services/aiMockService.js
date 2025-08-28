// 预置提示词库 - 分类存储
const suggestionLibrary = {
  technology: [
    "尝试结合VR/AR技术实现沉浸式体验，可以考虑使用WebXR API",
    "区块链技术能够解决信任问题，参考以太坊智能合约实现",
    "云计算架构可以提升系统扩展性，建议使用微服务设计",
    "人工智能机器学习算法可以优化个性化推荐效果",
    "大数据分析用户行为模式，使用Apache Spark处理海量数据"
  ],
  
  design: [
    "采用极简主义设计风格，提升用户体验纯净度",
    "游戏化设计元素可以提高用户参与度和留存率",
    "暗色模式减少眼睛疲劳，适合长时间使用场景",
    "响应式设计确保在移动端和桌面端都有良好表现"
  ],
  
  business: [
    "订阅制商业模式可以提供稳定的现金流来源",
    "免费增值模式适合快速获取用户后再进行变现",
    "社交电商结合内容创作可以形成良性生态循环",
    "B2B2C模式可以同时服务企业和终端消费者"
  ],
  
  marketing: [
    "社交媒体营销策略，重点布局抖音和小红书平台",
    "内容营销通过优质文章和视频建立专业形象",
    "增长黑客技术使用A/B测试优化转化漏斗",
    "社群运营建立忠实用户群体促进口碑传播"
  ]
}

// 相关灵感推荐库
const relatedIdeas = [
  "智能家居控制系统开发",
  "在线教育平台个性化学习路径",
  "健康管理APP与穿戴设备整合",
  "社交电商新模式探索",
  "AR实景导航应用商业化"
]

// 提取关键词从内容
export const extractKeywords = (content) => {
  if (!content) return ['technology', 'design']
  
  const text = content.toLowerCase()
  const keywords = []
  
  if (text.includes('vr') || text.includes('ar') || text.includes('虚拟') || text.includes('技术')) {
    keywords.push('technology')
  }
  if (text.includes('设计') || text.includes('ui') || text.includes('体验') || text.includes('界面')) {
    keywords.push('design')  
  }
  if (text.includes('商业') || text.includes('盈利') || text.includes('模式') || text.includes('赚钱')) {
    keywords.push('business')
  }
  if (text.includes('营销') || text.includes('推广') || text.includes('用户') || text.includes('增长')) {
    keywords.push('marketing')
  }
  
  return keywords.length > 0 ? keywords : ['technology', 'design']
}

// 生成AI建议（直接返回结果）
export const generateAISuggestions = (content = '') => {
  const keywords = extractKeywords(content)
  const suggestions = []
  
  // 根据关键词选择建议
  keywords.forEach(key => {
    if (suggestionLibrary[key]) {
      const randomIndex = Math.floor(Math.random() * suggestionLibrary[key].length)
      suggestions.push(suggestionLibrary[key][randomIndex])
    }
  })
  
  // 确保至少3条建议
  while (suggestions.length < 3) {
    const randomCategory = Object.keys(suggestionLibrary)[
      Math.floor(Math.random() * Object.keys(suggestionLibrary).length)
    ]
    const randomSuggestion = suggestionLibrary[randomCategory][
      Math.floor(Math.random() * suggestionLibrary[randomCategory].length)
    ]
    if (!suggestions.includes(randomSuggestion)) {
      suggestions.push(randomSuggestion)
    }
  }
  
  // 生成相关灵感推荐
  const related = []
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * relatedIdeas.length)
    if (!related.includes(relatedIdeas[randomIndex])) {
      related.push(relatedIdeas[randomIndex])
    }
  }
  
  return {
    suggestions: suggestions.slice(0, 3),
    relatedIdeas: related,
    generatedAt: new Date().toISOString()
  }
}

// 模拟API延迟（直接返回结果）
export const mockAIGenerate = (content, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: generateAISuggestions(content),
        message: 'AI生成成功'
      })
    }, delay)
  })
}