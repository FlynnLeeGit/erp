import axios from '@/plugins/axios'
import { mapToList } from '@/plugins/utils'

/**
 *
 * @param {* Object} data Statistics 数据
 */
const transformBudgetStatistics = data => {
  if (data) {
    if (data.artificial && data.artificial.workers) {
      data.artificial.workers = mapToList(data.artificial.workers)
    }
    if (data.auxiliary && data.auxiliary.specs) {
      const nowSpecs = data.auxiliary.specs
      Object.keys(nowSpecs).forEach(specName => {
        nowSpecs[specName] = mapToList(nowSpecs[specName])
      })
    }
  }
  return data
}

const transfromOpt = {
  responseType: 'json',
  transformResponse: [transformBudgetStatistics]
}

// 获取预算统计数据
export const get = bid =>
  axios.get(`/_api/project/budgets/${bid}/statistics`, transfromOpt)

// 获取预算空间统计数据
export const getBySpace = (bid, sid) =>
  axios.get(
    `/_api/project/budgets/${bid}/spaces/${sid}/statistics`,
    transfromOpt
  )

export { get as getSpaces } from '@/pages/projects/_pid/spaces/api'
