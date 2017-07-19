import axios from '@/plugins/axios'

// 获取供应商
export const get = () => axios.get('/_api/purchase/supplier')

// 添加供应商
export const create = data => axios.post('/_api/purchase/suppliers', data)

//  修改供应商
export const update = data =>
  axios.put(`/_api/purchase/suppliers/${data.id}`, data)

//  删除供应商
export const del = id => axios.delete(`/_api/purchase/suppliers/${id}`)
