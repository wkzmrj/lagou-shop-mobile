import axios from 'axios'
import store from '@/store'
import router from '@/router'
const request = axios.create({
  baseURL: 'https://shop.fed.lagounews.com/api'
})
//请求拦截器的token功能设置
request.interceptors.request.use(config => {
  const { token } = store.state.user
  if (token) {config.headers.Authorization = 'Bearer ' + token }
  return config
})
export default request
// 响应拦截器的失败处理

request.interceptors.response.use(config => {
  // 根据我们的后端响应数据，发现响应的状态信息为 410000 时，说明用户未登录访问了相关接口
  // 跳转登录页
  if (config.data.status === 410000) {
    router.push({
      name: 'login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
  
  return config
})