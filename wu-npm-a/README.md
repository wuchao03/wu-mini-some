## 一个 npm 的小插件，可以 格式化时间 和 转义/还原 HTML 中的特殊字符

## 安装

```
npm install wu-npm-a
```

## 导入

```js
const wuNpmA = require('wu-npm-a')
```

## 格式化时间

```js
// 调用dateFormat对时间进行格式化
const dtStr = wuNpmA.dateFormat(new Date())
console.log(dtStr)
```

## 转义 HTML 中的特殊字符

```js
// 调用htmlEscape转义HTML字符
const htmlStr = wuNpmA.htmlEscape('<h1>哈哈哈</h1>')
console.log(htmlStr)
```

## 还原 HTML 中的特殊字符

```js
// 调用htmlUnEscape还原HTML字符
const str = wuNpmA.htmlUnEscape('&lt;hhh&gt;')
console.log(str)
```

## 开源协议

ISC
