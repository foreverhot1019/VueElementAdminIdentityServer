import { asyncRoutes, constantRoutes } from '@/router'
import { objIsEmpty } from '@/utils'
import Layout from '@/Layout'
import LazyLoading from 'components/LazyLoading'
// import ErrLoading from '@/components/LazyLoading/ErrLoading'
// import Loading from '@/components/LazyLoading/Loading'

// const AsyncLoadComponent = (ComponetPath) => ({
//   // 需要加载的组件 (应该是一个 `Promise` 对象)
//   // component: import(ComponetPath.indexOf('@') >= 0 ? ComponetPath : `@${ComponetPath}`),
//   component: import(`@/views/${ComponetPath}`),
//   // 异步组件加载时使用的组件
//   loading: Loading,
//   // 加载失败时使用的组件
//   error: ErrLoading,
//   // 展示加载时组件的延时时间。默认值是 200 (毫秒)
//   delay: 200,
//   // 如果提供了超时时间且组件加载也超时了，
//   // 则使用加载失败时使用的组件。默认值是：`Infinity`
//   timeout: 3000
// })

/**
 * 重新赋值 item.component
 * @param {Object} item
 */
function resetComponet (item) {
  if (!objIsEmpty(item)) {
    let path = item.component
    if (path === 'Layout') {
      item.component = Layout
    } else {
      item.component = LazyLoading(() => import(`@/views/${path}`))
      // item.component = () => import(`@/views/${path}`)
    }
    // item.component = resolve => {
    //   require(['@/views/' + item.component + '.vue'], resolve)
    // } // menus[item.component]
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

let state = {
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
  // 过滤没有权限的菜单路由
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
  // 设置异步菜单路由
  setAsyncRoutes ({ commit, state }, _routes) {
    return new Promise((resolve, reject) => {
      try {
        if (!objIsEmpty(state.asyncRoutes)) {
          let err = { Success: false, ErrMsg: '异步菜单已经存在无法修改' }
          reject(err)
        }
        // 设置有效的菜单组件
        _routes.forEach((item, index, arr) => {
          resetComponet(item)
        })
        // 触发mutations方法
        commit('SET_ASYNCROUTES', _routes)
        resolve({ Success: true })
      } catch (e) {
        let err = { Success: false, ErrMsg: `设置异步菜单路由错误${e.Message}` }
        reject(err)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
