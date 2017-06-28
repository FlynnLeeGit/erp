import axios from 'axios'
import configApi from './configApi'

Promise.prototype.finally = function (fn) {
  function finFn () {
    fn.call(null)
  }
  this.then(finFn, finFn)
  return this
}
import { Message } from 'element-ui'

axios.interceptors.response.use(
  res => Promise.resolve(res),
  err => {
    const response = err.response
    switch (response.status) {
      case 400:
        Message.error(response.data.message)
        break
      case 401:
        Message.error('401')
        break
      case 403:
        Message.error('403')
        break
      case 500:
        Message.error('服务器内部错误')
        break
      default:
        Message.error(`未知错误`)
        break
    }
    return Promise.reject(err)
  }
)

export default {
  get (url, options) {
    let key = url
    
    if (options) {
      key = JSON.stringify({ ...options, url })
    }

    if (configApi.cached && configApi.cached.has(key)) {
      console.log(`使用api缓存${key}`) // eslint-disable-line
      return Promise.resolve(configApi.cached.get(key))
    }
    return axios.get(url, options).then(res => {
      if (configApi.cached) configApi.cached.set(key, res)
      return res
    })
  },
  post: axios.post,
  put: axios.put,
  delete: axios.delete
}
