import axios from '@/plugins/axios'
export const getById = pid => axios.get(`/_api/project/projects/${pid}`)