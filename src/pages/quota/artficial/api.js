import axios from '@/plugins/axios'


export const get = () => axios.get('/_api/quota/artficial')
export const add = data => axios.post('/_api/quota/artficials', data)
export const edit = data => axios.put(`/_api/quota/artficials/${data.id}`, data)
export const del = id => axios.delete(`/_api/quota/artficials/${id}`)


