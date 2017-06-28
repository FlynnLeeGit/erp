// 数组数据源 查询关键字 需查询字段 查询字段映射map表
export const search = (dataSource, searchField, searchFields, searchMap) => {
  return dataSource.filter(row => {
    return searchFields.some(k => {
      if (searchField === '') {
        return true
      }
      if (row[k] !== undefined && row[k] !== null) {
        const result = row[k]
        // 字段存在于映射表中时
        if (k in searchMap) {
          resultString = searchMap[row[k]]
        }
        return result.toString().indexOf(searchField) > -1
      }
    })
  })
}

export const getPage = (tableData, pageSize, page) =>
  tableData.slice((page - 1) * pageSize, page * pageSize)

export const deepCopy = obj => JSON.parse(JSON.stringify(obj))

export const listToMap = (list, mapField = 'name') => {
  const obj = {}
  list.forEach(item => {
    obj[item.id] = item[mapField]
  })
  return obj
}
