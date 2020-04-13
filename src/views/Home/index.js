import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/less/font-awesome.less'
import axios from 'axios'
import VueAxios from 'vue-axios'
import axiosLoading from '@/components/public/axiosLoading'
import store from '@/store'
import App from './Home'

Vue.use(ElementUI, { size: 'small' })
Vue.use(VueAxios, axios) // Vue使用 axios
axiosLoading(Vue, axios)
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
