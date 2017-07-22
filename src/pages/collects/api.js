import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/project/quotacollect')
export const create = data => axios.post('/_api/project/quotacollects', data)
export const update = data =>
  axios.put(`/_api/project/quotacollects/${data.id}`, data)
export const del = cid => axios.delete(`/_api/project/quotacollects/${cid}`)

export { get as getQuota } from '@/pages/quota/quota/api'
export { getByVersion } from '@/pages/quota/release/api'
