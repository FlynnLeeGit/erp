import axios from 'axios'
import configApi from './configApi'
import router from '../router'
import { deepCopy } from './utils'

Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}
import { Message } from 'element-ui'

axios.interceptors.response.use(
  res => Promise.resolve(res),
  err => {
    const response = err.response
    if (response) {
      switch (response.status) {
        case 400:
          const errMsg = response.data.message
          if (typeof errMsg === 'string') {
            Message.error(errMsg)
          }
          if (typeof errMsg === 'object') {
            Object.keys(response.data.message).forEach(msgType => {
              Message.error(response.data.message[msgType])
            })
          }
          break
        case 401:
          Message.error('登陆信息已过期，请重新登录！')
          router.push('/login')
          break
        case 403:
          Message.error('您没有权限访问')
          break
        case 404:
          Message.error(`访问的接口地址不存在`)
          break
        case 500:
          Message.error('服务器内部错误')
          break
        default:
          Message.error(`未知错误`)
          break
      }
    }
    return Promise.reject(err)
  }
)

export default {
  get (url, options, useCache = true) {
    let key = url

    if (options) {
      key = JSON.stringify({ ...options, url })
    }

    if (configApi.cached && configApi.cached.has(key) && useCache) {
      console.log(`使用api缓存${key}`) // eslint-disable-line
      // 为了让vuex 认为这是新的response
      return Promise.resolve(deepCopy(configApi.cached.get(key)))
    }
    return axios.get(url, options).then(res => {
      if (configApi.cached) configApi.cached.set(key, res)
      return res
    })
  },
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setHeader (hName, hContent) {
    axios.defaults.headers.common[hName] = hContent
  }
}
