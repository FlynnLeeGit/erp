import axios from '@/plugins/axios'

export const getMap = () => axios.get('/_api/project/mapping')
