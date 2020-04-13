import loadingC from './loading'
import { Message } from 'element-ui'
const showLoading = loadingC.showLoading
const hideLoading = loadingC.hideLoading

const axiosLoading = (Vue, axios) => {
  // axios
  axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : '/api' // 接口基础路径
  axios.defaults.timeout = 20000 // 超时时间 20s
  // axios.defaults.withCredentials = true // 允许设置cookie(开启的话需后端配置)
  // http请求拦截器
  axios.interceptors.request.use(config => {
    if (config.isLoading !== false) { // 如果配置了isLoading: false，则不显示loading
      showLoading()
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    return config
  }, error => {
    hideLoading()
    return Promise.reject(error.response)
  })
  // http响应拦截器
  axios.interceptors.response.use(data => {
    hideLoading() // 响应成功关闭loading
    return data
  }, error => {
    hideLoading()
    Message({
      message: '获取数据错误：' + error,
      type: 'error',
      duration: 1000,
      showClose: true
    })
    let _status = error.response && error.response.status
    if (_status === 504 || _status === 404) {
      // 跳转404页面（目前没有，只能先跳转首页）
      // router.push({ path: '/' })
    }
    return Promise.reject(error)
  })
}
export default axiosLoading
