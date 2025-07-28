export default {
  getIdeas: Mock.mock({
    'code': 200,
    'data|10-20': [{
      'id': '@id',
      'title': '@ctitle(5,10)',
      'content': '@cparagraph(3,5)',
      'createdAt': '@datetime',
      'tags|1-3': ['@word(3,5)']
    }]
  })
}