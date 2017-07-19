import axios from '@/plugins/axios'

// 获取所有人工
export const get = () => axios.get('/_api/quota/artficial')

// 添加人工
export const create = data => axios.post('/_api/quota/artficials', data)

// 修改人工
export const update = data =>
  axios.put(`/_api/quota/artficials/${data.id}`, data)

// 删除人工
export const del = id => axios.delete(`/_api/quota/artficials/${id}`)
