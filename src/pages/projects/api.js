import axios from '@/plugins/axios'

export const getMap = () => axios.get('/_api/project/mapping')

// 获取项目列表
export const get = () => axios.get('/_api/project/project')

// 创建项目
export const create = data => axios.post('/_api/project/projects', data)

//  修改项目
export const update = data => axios.put('/_api/project/project', data)

// 删除项目
export const del = id => axios.delete(`/_api/project/projects/${id}`)
