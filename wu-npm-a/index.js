// 这是包的入口文件，package.json中main的设置

// 进行模块化的拆分
const date = require('./src/dateFormat')
const escape = require('./src/htmlEscape')

module.exports = {
  ...date,   //记得要使用es6扩展运算符展开
  ...escape
}