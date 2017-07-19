import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/purchase/supplier')
export const add = data => axios.post('/_api/purchase/suppliers', data)
export const create = data => axios.post('/_api/purchase/suppliers', data)
export const edit = data =>
  axios.put(`/_api/purchase/suppliers/${data.id}`, data)
export const update = data =>
  axios.put(`/_api/purchase/suppliers/${data.id}`, data)
export const del = id => axios.delete(`/_api/purchase/suppliers/${id}`)
