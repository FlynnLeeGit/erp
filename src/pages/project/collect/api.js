import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/project/quotacollect')
export const add = data => axios.post('/_api/project/quotacollects', data)
export const edit = data =>
  axios.put(`/_api/project/quotacollects/${data.id}`, data)
export const del = cid => axios.delete(`/_api/project/quotacollects/${cid}`)

export { get as getQuota } from '../../quota/quota/api'
export { getByVersion } from '../../quota/release/api'
