module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 缩进
    indent: 'off',
    // 函数后必须加空格
    'space-before-function-paren': 0,
    // 分号
    semi: 0,
    // 组件不必须驼峰命名
    'vue/multi-word-component-names': 0
  }

}
