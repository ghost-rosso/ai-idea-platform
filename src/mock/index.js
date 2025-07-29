import Mock from 'mockjs'
import ideaMock from './idea'
import aiMock from './ai'

// 模拟登录接口
Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (password === 'admin123') {
    return Mock.mock({
      code: 200,
      data: {
        role: 'admin',
        username: username,
        token: '@guid'
      }
    })
  } else {
    return { code: 401, message: '密码错误' }
  }
})

// 其他Mock接口
Mock.mock('/api/ideas', 'get', ideaMock.getIdeas)
Mock.mock('/api/ai/expand', 'post', aiMock.expandIdea)

// 配置延迟
Mock.setup({ timeout: '200-600ms' })