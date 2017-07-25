import axios from '@/plugins/axios'

export const getByBid = ({ pid, bid }) =>
  axios.get(`/_api/project/projects/${pid}/budgets/${bid}`)
