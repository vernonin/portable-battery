import http from '@/utils/http'

const W_C_URL = '/api/business-server/chassis'

/**
 * 分页获取机柜
 * @param {*} params 
 * @returns 
 */
export function GetCabinets(params = {}) {
  return http.get(`${W_C_URL}/page`, { params })
}

/**
 * 根据id删除机箱
 * @param {*} id 机柜ID
 * @returns 
 */
export function DeleteCabinet(id) {
  return http.post(`${W_C_URL}/delete/${id}`)
}

// /**
//  * 根据id获取详情
//  * @param {*} id 机柜ID
//  * @returns 
//  */
// export function GetDetail(id) {
//   return http.get(`${W_C_URL}/detail/${id}`)
// }

/**
 * 根据id获取详情 机柜ID
 * @param {*} id 
 * @returns 
 */
export function GetCabinetInfo(id) {
  return http.get(`${W_C_URL}/detail/${id}`)
}

/**
 * 新建机柜
 * @param {*} data 
 * @returns 
 */
export function CreateCabinet(data) {
  return http.post(`${W_C_URL}/save`, data)
}

/**
 * 修改机柜
 * @param {*} data 
 * @returns 
 */
export function UpdateCabinet(data) {
  return http.post(`${W_C_URL}/update`, data)
}
