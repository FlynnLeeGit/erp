import axios from '@/plugins/axios'

export const getMap = () => axios.get('/_api/quota/quota/map')
