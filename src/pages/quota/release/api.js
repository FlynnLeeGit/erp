import axios from '@/plugins/axios'

export const get = () => axios.get('/_api/quota/release/list')
export const getByVersion = version =>
  axios.get(`/_api/quota/releases/${version}`)

export { get as getQuota } from '../quota/api'
