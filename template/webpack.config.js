/* eslint-env node */
const path = require('path')
const createTurfApp = require('@turf/create-turf-app')

module.exports = createTurfApp.makeWebpackConfig({
  // Default values shown
  entry: './main.js',
  distPath: '../../static/<%= djangoApp %>/<%= name %>/',
  publicPath: '/static/<%= djangoApp %>/<%= name %>/',
  overrides: {
    // regular webpack.config.js object
    // these will be merged with the base config
  },
})
