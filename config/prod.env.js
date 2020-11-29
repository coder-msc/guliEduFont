// 'use strict'
//
// module.exports = {
//   NODE_ENV: '"production"',
//   BASE_API: '"http://localhost:9001"',
// }

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  BASE_API: '"http://localhost:9001"',
})
