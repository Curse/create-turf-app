/* eslint-env node */

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parser: 'babel-eslint',
  rules: {
    // use ASI instead of ending each line with a semicolon
    'semi': ['warn', 'never'],

    // disable linebreak-style rule
    'linebreak-style': 0,

    // 2 spaces for indent
    'indent': ['warn', 2],
  },
}
