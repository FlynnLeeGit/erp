import axios from '@/plugins/axios'

// 将响应值转换为数组以便循环
const transformBudgetQuota = data => {
  if (data && data.items) {
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
  return data
}

const transformOpt = {
  responseType: 'json', // 转换响应格式
  transformResponse: [transformBudgetQuota]
}

// 获取一份预算定额列表
export const get = bid =>
  axios.get(`/_api/project/budgets/${bid}`, transformOpt)

// 向预算中添加定额
export const add = (bid, data) =>
  axios.post(`/_api/project/budgets/${bid}`, data, transformOpt)

// 更新一项定额数据
export const edit = (bid, sid, iid, data) =>
  axios.put(
    `/_api/project/budgets/${bid}/spaces/${sid}/items/${iid}`,
    data,
    transformOpt
  )

// 删除指定的定额
export const del = (bid, sid, iid) =>
  axios.delete(
    `/_api/project/budgets/${bid}/spaces/${sid}/items/${iid}`,
    transformOpt
  )

// 修改项目定额下面的利润率
export const updateRate = (bid, data) =>
  axios.put(`/_api/project/budgets/${bid}/profit`, data, transformOpt)

//  预览预算的pdf版本
export const createPdf = (bid, data) =>
  axios.post(`/_api/project/budgets/${bid}/pdfs`, data, {
    responseType: 'blob'
  })

export { get as getSpaces } from '@/pages/project/detail/space/api'
export { get as getProjects } from '@/pages/project/list/api'
