import axios from '@/plugins/axios'

// 获取辅材规格
export const get = () => axios.get('/_api/quota/auxmaterial')

// 添加辅材规格
export const create = data => axios.post('/_api/quota/auxmaterials', data)

// 修改辅材规格
export const update = data =>
  axios.put(`/_api/quota/auxmaterials/${data.id}`, data)

// 删除辅材规格
export const del = id => axios.delete(`/_api/quota/auxmaterials/${id}`)

// 添加辅材规格至材质
export const createSpec = ({ auxId, data }) =>
  axios.post(`/_api/quota/auxmaterials/${auxId}/specs`, data)
// 修改辅材修改规格
export const updateSpec = ({ auxId, data }) =>
  axios.put(`/_api/quota/auxmaterials/${auxId}/spec`, data)

// 删除辅材材质下的规格
export const delSpec = ({ auxId, specId }) =>
  axios.delete(`/_api/quota/auxmaterials/${auxId}/specs/${specId}`)
