import axios from '@/plugins/axios'

export const getMap = () => axios.get('/_api/open/account/map')

export const get = () => axios.get('/_api/account/user')
export const add = data => axios.post('/_api/account/users', data)

export const del = id => axios.delete(`/_api/account/users/${id}`)

export const editPwd = (uid, data) =>
  axios.put(`/_api/open/users/${uid}/password`, data)
