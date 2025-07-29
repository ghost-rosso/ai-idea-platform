export default {
  getUsers: Mock.mock({
    'code': 200,
    'data|5-10': [{
      'id': '@id',
      'username': '@name',
      'role|1': ['user', 'admin'],
      'lastLogin': '@datetime'
    }]
  }),
  
  getIdeas: Mock.mock({
    'code': 200,
    'data|15-30': [{
      'id': '@id',
      'title': '@ctitle(6,12)',
      'author': '@name',
      'createdAt': '@datetime',
      'status|1': ['active', 'pending', 'archived']
    }]
  })
}