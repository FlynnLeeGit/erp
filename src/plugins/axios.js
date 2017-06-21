import axios from 'axios'
import { Message } from 'element-ui'

axios.interceptors.response.use(
  res => res,
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
      default:
        Message.error(`服务器内部错误`)
        break
    }
  }
)

export default axios
