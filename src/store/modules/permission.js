import { menus, asyncRoutes, constantRoutes } from '@/router'
import { objIsEmpty } from '@/utils'

/**
 * 重新赋值 item.component
 * @param {Object} item
 */
function resetComponet (item) {
  if (!objIsEmpty(item)) {
    item.component = menus[item.component]
    let children = item.children
    if (!objIsEmpty(children)) {
      children.forEach((item, idx, arr) => {
        resetComponet(item)
      })
    }
  }
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  asyncRoutes: asyncRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ASYNCROUTES: (state, routes) => {
    state.asyncRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit, state }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(accessedRoutes, roles)
      // }
      accessedRoutes = filterAsyncRoutes(state.asyncRoutes, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  setAsyncRoutes ({ commit, state }, routes) {
    return new Promise((resolve, reject) => {
      if (!objIsEmpty(state.asyncRoutes)) {
        let err = '异步菜单已经存在无法修改'
        reject(err)
      }
      routes.forEach((item, index, arr) => {
        resetComponet(item)
      })

      commit('SET_ASYNCROUTES', routes)
      resolve(true)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
