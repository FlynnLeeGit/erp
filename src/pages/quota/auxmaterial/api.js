import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/quota/auxmaterial')
export const add = data => axios.post('/_api/quota/auxmaterials', data)
export const edit = data =>
  axios.put(`/_api/quota/auxmaterials/${data.id}`, data)
export const del = id => axios.delete(`/_api/quota/auxmaterials/${id}`)

export { getMap } from '../api'
