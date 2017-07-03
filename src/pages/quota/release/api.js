import axios from '@/plugins/axios'

export const getVersionList = () => axios.get('/_api/quota/release/list')
export const getByVersion = version =>
  axios.get(`/_api/quota/releases/${version}`)
export const getLast = () => axios.get(' /_api/quota/release/last')

export { get as getQuota } from '../quota/api'
