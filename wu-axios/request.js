// 导入axios
import axios from 'axios'
import qs from 'qs'

// webpack里面有个node环境变量：process.env.NODE_ENV
// 根据环境变量进行接口区分:
switch (process.env.NODE_ENV) {
  case "production":
    axios.defaults.baseURL = "http://api.wuproduction.cn"
    break
  case "test":
    axios.defaults.baseURL = "http://wutest.cn"
    break
  default:
    axios.defaults.baseURL = "http://127.0.0.3000"
}

// 设置请求超时时间10s
axios.defaults.timeout = 10000

// 跨域是否允许携带cookie
axios.defaults.withCredentials = true

// 设置请求传递数据的格式
// x-www-form-urlencoded
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// 对于post请求  （安装qs依赖 第三方库）
axios.defaults.transformRequest = data => qs.stringify(data)  //这个方法是把对象变成xxx=xxx

// 设置请求拦截器
// 通常token校验，接收服务器返回的token，存储到vuex或sessionStorage中，每一次向服务器发请求，我们应该把token带上
axios.interceptors.request.use(config => {
  // 1.当发送网络请求时, 在页面中添加一个loading组件, 作为动画
  // 2.某些请求要求用户必须登录, 判断用户是否有token, 如果没有token跳转到login页面
  // 3.对请求的参数进行序列化(看服务器是否需要序列化) // config.data = qs.stringify(config.data)
  // 4.比如config中的一些信息不符合服务器的要求
  config.headers.Authorization = sessionStorage.getItem('token')
  return config  // 一定要记得返回
}, error => {
  return Promise.reject(error)
})

// 设置响应拦截器  axios统一处理异常
// 自定义响应成功的http状态码
axios.interceptors.response.use(response => {
  // 成功直接返回 一般2/3开头的状态码
  return response.data
}, error => {
  let { response } = error
  if (response) {
    // 服务器返回结果了
    switch (response.status) {
      case 400:
        error.message = '请求错误'
        break
      case 401:   //权限
        error.message = '未授权的访问'
        break
      case 403:  //服务器拒绝执行（token过期）
        error.message = '禁止访问'
        break
      case 404:
        error.message = '找不到页面，当前请求接口不存在'
        break
    }
  } else {
    // 服务器没有返回结果
    if (!window.navigator.onLine) {
      // 断网处理，可以跳转到断网页面
      return
    }
    return Promise.reject(error)
  }
})

export default axios