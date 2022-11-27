import {ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'
import http from '@/utils/http'

/**
 * 登录服务
 * @param userAccount  账户名
 * @param userPassword 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(userAccount, userPassword) {
  return http.post('/api/auth-server/auth/login', {
    userAccount,
    userPassword
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig
}

/**
 * 分页获取用户信息
 * @returns 
 */
export function GetUsers(data = {}) {
  return http.get('/api/system-server/user/userPage', { data })
} 
