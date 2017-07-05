import axios from '@/plugins/axios'

export const get = pid => axios.get(`/_api/project/projects/${pid}/space`)
export const add = (pid, data) =>
  axios.post(`/_api/project/projects/${pid}/spaces`, data)
export const edit = data => axios.put('/_api/project/project/space', data)
export const del = (pid, sid) =>
  axios.delete(`/_api/project/projects/${pid}/spaces/${sid}`)
