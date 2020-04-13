import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

var store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules
})

export default store
