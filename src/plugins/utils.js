export const search = (dataSource, searchField, searchFields) => {
  return dataSource.filter(row => {
    return searchFields.some(k => {
      if (searchField === '') {
        return true
      }
      if (row[k] !== undefined && row[k] !== null) {
        return row[k].toString().indexOf(searchField) > -1
      }
    })
  })
}

export const getPage = (tableData, pageSize, page) =>
  tableData.slice((page - 1) * pageSize, page * pageSize)

export const sort = (a, b, prop) => a[prop] - b[prop] > 0
