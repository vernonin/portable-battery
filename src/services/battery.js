import http from '@/utils/http'

const W_B_URL = '/api/business-server/battery'

/**
 * 分页获取充电宝
 * @param {*} params 查询参数
 * @returns 
 */
export function GetBatterys (params = {}) {
  return http.get(`${W_B_URL}/page`, { params })
}

/**
 * 新建充电宝
 * @param {*} data 
 * @returns 
 */
export function CreateBattery(data) {
  return http.post(`${W_B_URL}/save`, data)
}

export function DeleteBattery(id) {
  return http.post(`${W_B_URL}/delete/${id}`)
}
