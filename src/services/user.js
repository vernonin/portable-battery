import {ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'
import http from '@/utils/http'

const A_A_URL = '/api/auth-server/auth'
const S_U_URL = '/api/system-server/user'

/**
 * 登录服务
 * @param userAccount  账户名
 * @param userPassword 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(userAccount, userPassword) {
  return http.post(`${A_A_URL}/login`, {
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
export function GetUsers(params = {}) {
  return http.get(`${S_U_URL}/userPage`, { params })
}

/**
 * 根据用户ID获取用户信息
 * @param {*} userId 用户ID
 * @returns 
 */
export function GetUserInfo(userId) {
  return http.get(`${S_U_URL}/userInfo`, { params: { userId }})
}

/**
 * 添加用户
 * @param {*} userAccount  账号
 * @param {*} userEmail    邮箱
 * @param {*} userName     姓名
 * @param {*} userPhone    手机号
 * @param {*} userSex      性别
 * @param {*} userPassword 密码
 * @returns 
 */
export function CreateUser(data) {
  return http.post(`${S_U_URL}/save`, data)
}

/**
 * 更新用户信息
 * @param {*} data 
 * @returns 
 */
export function UpdateUser(data) {
  return http.post(`${S_U_URL}/update`, data)
}

/**
 * 重置密码
 * @param {*} userId 用户ID
 * @returns 
 */
export function ResetPassword(userId) {
  return http.post(`${S_U_URL}/resetPassword`, {}, {params: { userId }})
}

/**
 * 更新用户状态：生效 / 失效
 * @param {*} userId 用户ID
 * @returns 
 */
export function UpdateStatus(userId) {
  return http.post(`${S_U_URL}/updateUserStatus`, {}, {params: { userId }})
}
