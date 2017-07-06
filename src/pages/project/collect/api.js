import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/project/quotacollect')
export const add = data => axios.post('/_api/project/quotacollects', data)
export const edit = data =>
  axios.put(`/_api/project/quotacollects/${data.id}`, data)
export const del = cid => axios.delete(`/_api/project/quotacollects/${cid}`)
// 禁用api缓存
export const getTags = () =>
  axios.get('/_api/project/quotacollect/tag', {}, false)

export { get as getQuota } from '../../quota/quota/api'
