/* eslint-env node */
const baseConfig = require('@node/eslintrc')

module.exports = {
  ...baseConfig,
  extends: ['plugin:react/recommended'],
  parser:
    'babel-eslint',
  rules:
    {
      ...
        baseConfig.rules,

      // use ASI instead of ending each line with a semicolon
      'semi':
        ['warn', 'never'],

      // disable linebreak-style rule
      'linebreak-style': 0,

      // 2 spaces for indent
      'indent':
        ['warn', 2],
    }
  ,
}
