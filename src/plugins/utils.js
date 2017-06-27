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

export const findIndex = (dataSource, field, fieldVal) => {
  const results = dataSource.filter(row => {
    return row[field] === fieldVal
  })
  return results.length ? results[0] : {}
}

export function debounce (idle, fn) {
  let last
  return function () {
    const ctx = this, args = arguments
    clearTimeout(last)
    last = setTimeout(function () {
      fn.apply(ctx, args)
    }, idle)
  }
}
