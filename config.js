const ENV = process.env.NODE_ENV
console.log('[ENV]', ENV)
module.exports = {
  API_SERVER: {
    development: 'http://erp.lab/',
    staging: 'http://erp.sfdd.lab/',
    production: 'http://erp.sfdd.lab/'
  }[ENV]
}
