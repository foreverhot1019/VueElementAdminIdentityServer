import request from '@/utils/request'

export function getRoutes (data) {
  return request({
    url: '/api/role/routes',
    method: 'post',
    data: data
  })
}

export function getRoles () {
  return request({
    url: '/api/role',
    method: 'get'
  })
}

export function addRole (data) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  })
}

export function updateRole (id, data) {
  return request({
    url: `/api/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole (id) {
  return request({
    url: `/api/role/${id}`,
    method: 'delete'
  })
}
