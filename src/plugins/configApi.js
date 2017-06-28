const LRU = require('lru-cache')

let api

if (process.__API__) {
  api = process.__API__
} else {
  api = (process.__API__ = {
    cached: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 3
    }),
    cachedItem: {}
  })
}

export default api
