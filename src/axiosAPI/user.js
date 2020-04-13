import request from '@/utils/request'

export function login (data) {
  var Mydata = {
    ...data,
    client_id: 'Michael', // 必须是某个字段
    client_secret: 'Michael', // 必须是某个字段
    // UserName: 'Michael', // 可自定义
    grant_type: 'password', // 必须是password/client_credentials
    response_type: 'token' // 必须是token
  }
  return request({
    url: '/token',
    method: 'post',
    data: Mydata
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
