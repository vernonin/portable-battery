import http from '@/utils/http'

const S_R_URL = '/api/system-server/role'

/**
 * 分页获取角色
 * @param {*} params 
 * @returns 
 */
export function GetRoles(params = {}) {
  return http.get(`${S_R_URL}/rolePage`, { params })
}

/**
 * 新建角色
 * @param {*} roleCode 角色编号
 * @param {*} roleCode 角色名称
 * @returns 
 */
export function CreateRole(data) {
  return http.post(`${S_R_URL}/save`, data)
}

/**
 * 更新角色信息
 * @param {*} data 
 * @returns 
 */
export function UpdateRole(data) {
  return http.post(`${S_R_URL}/update`, data)
}

/**
 * 更新角色状态：生效 / 失效
 * @param {*} roleId 
 * @returns 
 */
export function UpdateRoleStatus(roleId) {
  return http.post(`${S_R_URL}/updateRoleStatus`, {}, {params: { roleId }})
}
