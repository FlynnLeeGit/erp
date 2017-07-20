import axios from '@/plugins/axios'

//  获取辅材列表
export const get = () => axios.get('/_api/purchase/material')

// 添加辅材
export const create = data => axios.post('/_api/purchase/materials', data)

// 修改辅材
export const update = data =>
  axios.put(`/_api/purchase/materials/${data.id}`, data)

// 删除辅材
export const del = id => axios.delete(`/_api/purchase/materials/${id}`)
