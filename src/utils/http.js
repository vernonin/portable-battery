import axios from 'axios'
import { SET_AUTH, GET_AUTH, CLEAR_AUTH } from './auth'
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
  const { data, headers } = response

  if(headers && headers.new_token) {
    SET_AUTH(headers.new_token)
  }

  return data

}, error => {
  const { data, status } = error.response

  if (error.response && status === 401) {
    // 删除本地存储的错误token
    CLEAR_AUTH()
    message.warning(data.msg)
    // 跳转登录页面
    router.replace({ path: '/login' })
  } else if (error.response && status >= 500) {
    message.error('服务端内部异常，请稍后重试！')
  } else {
    message.error(data.message || data.msg)
  }


  return Promise.reject(error)

})


export default serve