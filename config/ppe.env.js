'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./ppe.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"ppeEnvironment"',
  ENV_CONFIG: '"ppe"'
})
