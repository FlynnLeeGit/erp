import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/project/project')
export const add = data => axios.post('/_api/project/projects', data)
export const edit = data => axios.put('/_api/project/project', data)
export const del = id => axios.delete(`/_api/project/projects/${id}`)

export { getMap } from '../api'
