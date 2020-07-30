import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'querystring'

const asiosTimeOut = 600000 // request timeout-ms
// 默认超时时间（毫秒）
axios.defaults.timeout = asiosTimeOut

// // https代理
// const fs = require('fs')
// const https = require('https')
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false, // local verify cert
//   cert: fs.readFileSync('client.crt'),
//   key: fs.readFileSync('client.key'), // cert public key
//   ca: fs.readFileSync('ca.crt'), // ca cert use to verify local cert/pfx
//   pfx: fs.readFileSync('ca.pfx'), // pfx cert（cotains key & crt）
//   passphrase: 'Michael' // cert password(if key/pfx has password)
// })

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: asiosTimeOut, // request timeout-ms
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  // rejectUnauthorized: false, // local verify cert
  // cert: fs.readFileSync('./usercert.pem'), // cert
  // key: fs.readFileSync('./key.pem'), // cert public key
  // passphrase: 'Michael' // cert password(if have)
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (config.method === 'post') {
      // if (config.headers['Content-Type'] ==='application/json') {
      //   config.body = qs.stringify(config.data)
      // } else {
      //   config.data = qs.stringify(config.data)
      // }
      if (config.headers['Content-Type'].indexOf('application/json') < 0) {
        config.data = qs.stringify(config.data)
      }
    }
    // token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    // if (config.https) {
    //   config.httpsAgent = httpsAgent
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   *
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const code = res.code || response.status

    // if the custom code is not 20000, it is judged as an error.
    if (code !== 200 && code !== 20000) {
      Message({
        message: res.message || res.ErrMsg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (code === 401 || code === 50008 || code === 50012 || code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
