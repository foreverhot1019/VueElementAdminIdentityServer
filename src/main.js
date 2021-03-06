import Vue from 'vue'

// import Cookies from 'js-cookie'
import storage from 'store'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import 'font-awesome/less/font-awesome.less'

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control Ȩ����֤ģ�� ͨ��router-beforeEach ����ʵ��
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import Validtors from './VueExtension/Validators' // global validators
import formatters from './VueExtension/formatters' // global formatters
// import drag from '@/directive/el-drag-dialog' // global directive
// import tabResize from '@/directive/el-table' // global directive

/*
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !

* import { mockXHR } from '../mock'
* if (process.env.NODE_ENV === 'production') {
*   mockXHR()
* }
*/

Vue.use(Element, {
  size: storage.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// register global utility Validtors
Vue.prototype.$Validtors = Validtors
// register global utility formatters
Vue.prototype.$formatter = formatters
// register global utility directives
// drag.install(Vue)
// tabResize.install(Vue)

Vue.config.productionTip = false

var _vue = new Vue({
  // el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
_vue.$mount('#app')
