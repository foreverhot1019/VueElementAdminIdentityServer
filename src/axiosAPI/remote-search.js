import request from '@/utils/request'

export function searchUser (name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList (query) {
  return request({
    url: '/search/list',
    // url: '/transaction/list',
    method: 'get',
    params: query
  })
}
