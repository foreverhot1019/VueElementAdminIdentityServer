import request from '@/utils/request'

/**
 * 获取当前账户路由
 * @param {object} data(userName) post数据
 * @returns 返回路由数据
 * { path= "/MyMenu", component= "Layout", redirect= "/MyMenu/Home",
 * alwaysShow= true, // will always show the root menu
 * name= "MyMenu",
 * meta= new {
 *   title= "MyMenu",
 *   icon= "lock",
 *   // roles= new string []{ "admin", "editor" } // you can set roles in root nav
 * },
 * children = new List<Object>{
 *   new {
 *     path = "Home",
 *     component = "Home/Home",
 *     name = "Home",
 *     meta = new {
 *       title = "Home", icon= "home", noCache= true,
 *       roles = new string []{ "admin" },
 *       roleAction = new string[]{ "Add","Edit","Delete","Audit"}
 *     }
 *   }
 * }
 */
export function getRoutes (data) {
  return request({
    url: '/api/role/routes',
    method: 'post',
    data: data
  })
}

/**
 * 获取所有权限(带分页)
 */
export function getRoles () {
  return request({
    url: '/api/role',
    method: 'get'
  })
}

/**
 * 获取所有权限
 */
export function getAllRoles () {
  return request({
    url: '/api/role/GetAllRoles',
    method: 'get'
  })
}

/**
 * 根据用户返回权限
 * @param {string} userId  用户主键
 * @returns json ['role']
 */
export function getRolesByUserId (userId) {
  return request({
    url: `/api/role/GetRolesByUserId/${userId}`,
    method: 'get'
  })
}

/**
 * 新增权限
 * @param {Object} data role数据
 */
export function addRole (data) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * @param {string} id role主键
 * @param {Object} data role数据
 */
export function updateRole (id, data) {
  return request({
    url: `/api/role/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除权限
 * @param {string} id role主键
 */
export function deleteRole (id) {
  return request({
    url: `/api/role/${id}`,
    method: 'delete'
  })
}
