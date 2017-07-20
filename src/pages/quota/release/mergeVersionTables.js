/**
 * @param {Object[]} 老版本表
 * @param {Object[]} 新版本表
 * @return {Object[]} diff后的表格
*/
const mergeVersionTables = (v1, v2) => {
  // just copy arr index
  const v2Slice = v2.slice()

  const stringify = JSON.stringify.bind(null)
  const v1Map = {}, v2Map = {}

  const mergeTable = []

  v1.forEach(v1Item => {
    v1Item.diff = {
      status: '',
      fields: {},
      prevRow: {}
    }
    v1Map[v1Item.id] = v1Item
  })

  v2Slice.forEach(v2Item => {
    v2Item.diff = {
      status: '',
      fields: {},
      prevRow: {}
    }
    v2Map[v2Item.id] = v2Item
  })

  v1.forEach(v1Item => {
    // 两个中都存在的部分 更新部分
    const v2Item = v2Map[v1Item.id]

    if (v2Item) {
      v2Slice.splice(v2Slice.indexOf(v2Item), 1)
      if (stringify(v1Item) !== stringify(v2Item)) {
        const _diffFields = {}
        Object.keys(v1Item).forEach(k => {
          if (stringify(v1Item[k]) !== stringify(v2Item[k])) {
            _diffFields[k] = true
          }
        })
        v2Item.diff.status = 'change'
        v2Item.diff.fields = _diffFields
        v2Item.diff.prevRow = v1Item
        mergeTable.push(v2Item)
      }
    } else {
      v1Item.diff.status = 'delete'
      mergeTable.push(v1Item)
    }
  })

  v2Slice.forEach(restV2Item => {
    restV2Item.diff.status = 'add'
    mergeTable.push(restV2Item)
  })

  return mergeTable.sort((a, b) => a.id - b.id)
}

export default mergeVersionTables
