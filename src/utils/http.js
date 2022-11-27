import axios from 'axios'
import { GET_AUTH } from '@/utils/auth'

const serve = axios.create({
  timeout: 5000
})

serve.interceptors.request.use((config) => {

  const token = GET_AUTH()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

serve.interceptors.response.use((response) => {
  return response.data
})

export default serve