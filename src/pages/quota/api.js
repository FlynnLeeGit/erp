import axios from '@/plugins/axios'

export const getMap = () => axios.get('/_api/quota/quota/map')
export const release = data => axios.post(`/_api/quota/releases`, data)
