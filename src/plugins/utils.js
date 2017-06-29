import Vue from 'vue'
/**
 * 通过数据源全表查询匹配记录
 * @param {*数组数据源} dataSource
 * @param {*查询关键字} searchField
 * @param {*需查询字段} searchFields
 * @param {*查询字段映射map表} searchMap
 */
export const search = (dataSource, searchField, searchFields, searchMap) => {
  return dataSource.filter(row => {
    // 第一个字段匹配了就返回
    return searchFields.some(field => {
      if (searchField === '') {
        return true
      }
      if (row[field] !== undefined && row[field] !== null) {
        let result = row[field]
        // 字段存在于映射表中时 使用映射后的值判断
        if (field in searchMap) {
          result = searchMap[field][result]
        }
        return result.toString().indexOf(searchField) > -1
      }
    })
  })
}

/**
 * 获取指定页码的数据
 * @param {* 数据源} tableData
 * @param {* 一页有几项} pageSize
 * @param {* 需要第几页} page
 */
export const getPage = (tableData, pageSize, page) =>
  tableData.slice((page - 1) * pageSize, page * pageSize)

export const deepCopy = obj => JSON.parse(JSON.stringify(obj))

/**
 * 数组list变成map表
 * @example [{id:1,name:'名称1'},{id:2,name:'名称2'}]=>{1:'名称1',2:'名称2'}
 * @param {* 数组list} list
 * @param {* 映射的名称字段} mapField
 */
export const listToMap = (list, mapField = 'name') => {
  const obj = {}
  list.forEach(item => {
    obj[item.id] = item[mapField]
  })
  return obj
}

/**
 * 指定字段更新老对象的值
 * @param {* 老的记录} oldObj
 * @param {* 新的记录} newObj
 * @param {* 需要更新的字段名称} fields
 */
export const replaceObjectFields = (oldObj, newObj, fields = 'all') => {
  if (fields === 'all') {
    fields = Object.keys(oldObj)
  }
  fields.forEach(f => {
    console.log(f, oldObj[f], newObj[f])
    oldObj[f] = newObj[f]
  })
}

/**
 * 支持.语法递归寻找对象中的键值 如 obj = { a: {b:1} } recursionFieldValue（obj,'a.b')可得到1
 * @param {* 查询对象} obj
 * @param {* 查询字段 可支持a.b.c的语法} field
 */
export const recursionFieldValue = (obj, fields) => {
  return fields.split('.').reduce((prev, next) => prev[next], obj)
}

/**
 * 判断值是否存在于指定的数组中的对象字段中
 * @param {* 数组对象} arr
 * @param {* 值} val
 * @param {* 寻找的字段} field
 */
export const valueInArray = (arr, value, field = 'id') => {
  return arr.some(
    item => recursionFieldValue(item, field).toString() === value.toString()
  )
}
