import axios from '@/plugins/axios'

export const get = pid => axios.get(`/_api/project/projects/${pid}/budget`)
export const add = (pid, data) =>
  axios.post(`/_api/project/projects/${pid}/budgets`, data)
export const edit = data => axios.put('/_api/project/project/budget', data)
export const del = (pid, bid) =>
  axios.delete(`/_api/project/projects/${pid}/budgets/${bid}`)
export { get as getCollects } from '../../collect/api'
