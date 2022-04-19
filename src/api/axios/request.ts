import axios from 'axios'

export const request = (config) => {
  const http = axios.create({
    baseURL: '/api'
  })

  // 请求拦截器
  http.interceptors.request.use(config => {
    return config
  }), error => (error)

  // 响应拦截器
  http.interceptors.response.use(res => {
    return res.data ? res.data : res
  }), error => {
    console.log('error===', error.response) // 这里必须打印 error.response
  }

  return http(config)
}