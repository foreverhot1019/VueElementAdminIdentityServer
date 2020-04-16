import request from '@/utils/request'

export function login (data) {
  var Mydata = {
    ...data,
    client_id: 'ManageIdsClient', // 必须是某个字段
    client_secret: 'ManageIdsClientSecret', // 必须是某个字段
    grant_type: 'password', // 必须是password/client_credentials
    response_type: 'token', // 必须是token
    scope: 'ManageIdsClient openid' // 范围openid必须有
  }
  return request({
    url: '/connect/token',
    method: 'post',
    data: Mydata
  })
}

export function getInfo (token) {
  return request({
    url: 'connect/userinfo',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
