import { groupByField } from '@/plugins/utils'

/**
 * 将用户收藏列表转换为element 级联选择器需要的格式
 * @param {* 数据列表} arr
 */
export const generateOptions = arr => {
  // 先进行去重分组
  const grouped = groupByField(arr, 'name')
  return Object.keys(grouped).map((k, index) => {
    return {
      label: k,
      value: index,
      children: grouped[k].map(item => ({
        value: item.quotaTemplateId,
        label: item.quotaTemplate.name
      }))
    }
  })
}
