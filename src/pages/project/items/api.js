import axios from '@/plugins/axios'

// 将响应值转换为数组以便循环
const transformBudgetQuota = data => {
  if (data.items) {
    Object.keys(data.items).map(sid => {
      const nowSpace = data.items[sid]
      nowSpace.quotas = Object.keys(nowSpace.items).map(qid => {
        const nowQuota = nowSpace.items[qid]
        nowQuota.id = +qid
        return nowQuota
      })
      return nowSpace
    })
  }
  console.log(data)
  return data
}

// 获取一份预算定额列表
export const get = bid =>
  axios.get(`/_api/project/budgets/${bid}`, {
    responseType: 'json', // 默认的
    transformResponse: [transformBudgetQuota]
  })

// 向预算中添加定额
export const add = (bid, data) =>
  axios.post(`/_api/project/budgets/${bid}`, data)

// 更新一项定额数据
export const edit = (bid, sid, iid) =>
  axios.put(`/_api/project/budgets/${bid}/spaces/${sid}/items/${iid}`)

// 删除指定的定额
export const del = (bid, sid, iid) =>
  axios.delete(`/_api/project/budgets/${bid}/spaces/${sid}/items/${iid}`)

export { get as getSpaces } from '../detail/space/api'
export { get as getCollects } from '../collect/api'
