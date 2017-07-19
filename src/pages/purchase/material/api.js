import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/purchase/material')
export const add = data => axios.post('/_api/purchase/materials', data)
export const create = data => axios.post('/_api/purchase/materials', data)
export const edit = data =>
  axios.put(`/_api/purchase/materials/${data.id}`, data)
export const update = data =>
  axios.put(`/_api/purchase/materials/${data.id}`, data)
export const del = id => axios.delete(`/_api/purchase/materials/${id}`)

export { get as getAuxmaterial } from '../../quota/auxmaterial/api'
export { get as getSupplier } from '../supply/api'
