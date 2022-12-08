import http from '@/utils/http'

const S_M_URL = '/api/system-server/menu'
/**
 * 分页获取角色
 * @returns 
 */
export function GetMenus(params) {
  return http.get(`${S_M_URL}/getMenuTree`, { params })
}

/**
 * 根据id查询菜单
 * @param {*} id 菜单ID 
 * @returns 
 */
export function GetMenu(id) {
  return http.get(`${S_M_URL}/detail`, { params: { id } })
}

/**
 * 新建菜单
 * @param {*} data 
 * @returns 
 */
export function CreateMenu(data) {
  return http.post(`${S_M_URL}/save`, data)
}

/**
 * 更新菜单信息
 * @param {*} data 
 * @returns 
 */
export function UpdateMenu(data) {
  return http.post(`${S_M_URL}/update`, data)
}

/**
 * 获取菜单树
 * @returns 
 */
export function GetMenuTree() {
  return http.get(`${S_M_URL}/getMenuTree`)
}


/**
 * 根据父id 查询相关子菜单
 * @returns 
 */
export function GetMenuByParentId() {
  return http.get(`${S_M_URL}/getByParentId`)
}

/**
 * 菜单菜单
 * @param {*} id 
 * @returns 
 */
export function DeleteMenu(id) {
  return http.post(`${S_M_URL}/delete`, {}, {params: { id }})
}
