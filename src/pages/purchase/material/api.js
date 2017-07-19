import axios from '@/plugins/axios'

//  获取辅材列表
export const get = () => axios.get('/_api/purchase/material')
export const add = data => axios.post('/_api/purchase/materials', data)

// 添加辅材
export const create = data => axios.post('/_api/purchase/materials', data)
export const edit = data =>
  axios.put(`/_api/purchase/materials/${data.id}`, data)

  // 修改辅材
export const update = data =>
  axios.put(`/_api/purchase/materials/${data.id}`, data)

  // 删除辅材
export const del = id => axios.delete(`/_api/purchase/materials/${id}`)

export { get as getAuxmaterial } from '../../quota/auxmaterial/api'
export { get as getSupplier } from '../supplier/api'
