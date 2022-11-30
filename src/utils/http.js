import axios from 'axios'
import { GET_AUTH, REMOVE_AUTH } from '@/utils/auth'
import {message} from 'ant-design-vue'

import { router } from '@/router'


const serve = axios.create({
  timeout: 5000
})

serve.interceptors.request.use(config => {

  const token = GET_AUTH()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

serve.interceptors.response.use(response => {
  return response.data
}, error => {
  const { data, status } = error.response

  if (error.response && status === 401) {
    // 删除本地存储的错误token
    REMOVE_AUTH()
    // 跳转登录页面
    router.replace({ path: '/login' })
  }

  message.error(data.message || data.msg)
  return Promise.reject(error)

})


export default serve