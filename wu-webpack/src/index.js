// 必须在入口文件最顶部导入
import "core-js/stable"
import "regenerator-runtime/runtime"
// 然后再导入其他的
import React from 'react'
import ReactDOM from 'react-dom'
// import './index.less'
import '@/index.less'
import style from './index.module.less'

// console.log(123) // 在这里添加即可
// 找个合适的地方添加就行 
// console.log(VERSION_H5)
console.log(process.env.NODE_ENV)
console.log(process.env.MY_TYPE)

function App() {
  return (
    <div>
      <div className="test">domdomdom11</div>
      {/* <div className={style.name}>demo222</div> */}
      {/* <div>
        <img src={icon} alt="" />
      </div> */}
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)