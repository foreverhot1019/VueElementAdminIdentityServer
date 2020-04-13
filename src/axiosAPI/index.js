import axios from 'axios'

export const TestPost = (userName) => {
  userName = (userName === 'undefined' || userName == null || userName == '') ? 'admin' : userName // eslint-disable-line
  var p = new Promise((resolve, reject) => {
    axios.post('/Account/changeOp', JSON.stringify({ userName: userName })).then(
      res => res.Json()).then(
      data => {
        resolve(data)
      }).catch(
      err => {
        console.log(err)
        reject(err)
      })
  })
  return p
}

export const TestPost1 = function () {
  axios.post('/Account/changeOp', JSON.stringify({ userName: 'admin' })).then(
    res => res.Json()).then(
    data => {
      return data
    }).catch(
    err => console.log(err))
}
var axiosAPI = { TestPost: TestPost, TestPost1: TestPost1 }

export default axiosAPI
