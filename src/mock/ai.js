import Mock from 'mockjs'

const suggestions = [
  "尝试结合VR技术实现沉浸式体验",
  "可参考区块链技术解决信任问题",
  "医疗健康领域有类似应用案例",
  "考虑添加社交分享功能扩大传播"
]

export default {
  expandIdea: (options) => {
    const body = JSON.parse(options.body)
    return Mock.mock({
      code: 200,
      data: {
        relatedIdeas: ['@ctitle(3,5)', '@ctitle(3,5)'],
        suggestion: suggestions[Math.floor(Math.random() * suggestions.length)],
        generatedContent: `AI生成内容：${body.keyword}...@cparagraph(2)`
      }
    })
  }
}