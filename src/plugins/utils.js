import Vue from 'vue'
/**
 * 通过数据源全表查询匹配记录
 * @param {*数组数据源} dataSource
 * @param {*查询关键字} searchValue
 * @param {*需查询字段} searchFields
 * @param {*查询字段映射map表} searchMap
 */
export const search = (dataSource, searchValue, searchFields, searchMap) => {
  return dataSource.filter(row => {
    // 第一个字段匹配了就返回
    return searchFields.some(field => {
      if (searchValue === '') {
        return true
      }
      if (row[field] !== undefined && row[field] !== null) {
        let result = row[field]
        // 字段存在于映射表中时 使用映射后的值判断
        if (field in searchMap) {
          result = searchMap[field][result]
        }
        return result.toString().indexOf(searchValue) > -1
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

export const find = (arr, value, field = 'id') =>
  arr.filter(item => item[field] === value)[0]

export const findIndex = (arr, value, field = 'id') => {
  const findItem = find(arr, value, field)
  return arr.indexOf(findItem)
}

/**
 * 支持.语法递归寻找对象中的键值 如 obj = { a: {b:1} } recursionFieldValue（obj,'a.b')可得到1
 * @param {* 查询对象} obj
 * @param {* 查询字段 可支持a.b.c的语法} field
 */
export const recursionFieldValue = (obj, fields) => {
  try {
    return fields.split('.').reduce((prev, next) => prev[next], obj)
  } catch (e) {
    // 报错时返回null
    return null
  }
}

/**
 * 数组list变成map表
 * @example [{id:1,name:'名称1'},{id:2,name:'名称2'}]=>{1:'名称1',2:'名称2'}
 * @param {* 数组list} list
 * @param {* 映射的名称字段} mapField
 */
export const listToMap = (list, mapField = 'name', idField = 'id') => {
  const obj = {}
  list.forEach(item => {
    obj[recursionFieldValue(item, idField)] = recursionFieldValue(
      item,
      mapField
    )
  })
  return obj
}
/**
 * 将对象格式的列表转为数组列表 {
 *  1:{name:'lee'},
 *  2:{name:'fee'}
 * } => [{name:'lee',mapId:1},{name:'fee',mapId:2}]
 *
 * @param {* Object } objs 对象列表
 * @param {*} mapIdName 映射键值到mapIdName字段上
 */
export const mapToList = (objs, mapIdName = 'mapId') =>
  Object.keys(objs).map(k => {
    objs[k][mapIdName] = k
    return objs[k]
  })

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
    oldObj[f] = newObj[f]
  })
}

/**
 * 获取数组中值对应的第一个元素
 * @param {* [Object]} arr 数组
 * @param {* String } value 目标值
 * @param {* String} field 目标字段
 */
export const getItemInArray = (arr, value, field = 'id') => {
  const filterItems = arr.filter(
    item => item[field].toString() === value.toString()
  )
  return filterItems.length ? filterItems[0] : {}
}

/**
 * 判断值是否存在于指定的数组中的对象字段中
 * @param {* 数组对象} arr
 * @param {* 值} value
 * @param {* 寻找的字段} field
 */
export const valueInArray = (arr, value, field = 'id') => {
  return arr.some(
    item => recursionFieldValue(item, field).toString() === value.toString()
  )
}

/**
 * 中文表格字段排序函数
 * @param {* 排序字段} sortKey
 * @param {* 比较前对象} a
 * @param {* 比较后对象} b
 */

export const sortByChs = (sortKey, a, b) => {
  return a[sortKey].localeCompare(b[sortKey]) > 0
}

/**
 * 将秒级时间戳转为当地时间
 * @param {* 时间 } time
 */
export const toLocaleString = time => new Date(time * 1000).toLocaleDateString()

/**
 * 根据给出字段将数据分组
 * @param {* 数组} arr
 * @param {* 分组用字段} field 支持递归
 * @return [ object ]
 */
export const groupByField = (arr, field) => {
  const obj = {}
  arr.forEach(item => {
    const targetFieldValue = recursionFieldValue(item, field)
    if (targetFieldValue !== null && targetFieldValue !== undefined) {
      if (!obj[targetFieldValue]) {
        obj[targetFieldValue] = []
      }
      obj[targetFieldValue].push(item)
    }
  })
  return obj
}

/**
 *
 * @param {* [opts]} optsArrCollect 多个 opts选项组 每个opts里带有 id,parentId字段以便组成树关系
 * @return array element-ui Cascader选项结构
 */
export const toCascader = (...optsArrCollect) => {
  try {
    // 需要深拷贝 防止里面对象引用关系互相影响
    const cloneOptsArrCollect = deepCopy(optsArrCollect)
    cloneOptsArrCollect.forEach((opts, idx) => {
      if (idx < cloneOptsArrCollect.length - 1) {
        opts.forEach(opt => {
          opt.children = cloneOptsArrCollect[idx + 1].filter(
            item => item.parentId === opt.id
          )
          if (!opt.children.length) {
            opt.disabled = true
          }
        })
      }
    })
    return cloneOptsArrCollect[0]
  } catch (e) {
    return []
  }
}