import http from '@/utils/http'

const W_O_URL = '/api/business-server/order'

/**
 * 分页查询订单
 * @param {*} params 
 * @returns 
 */
export function GetOrders(params = {}) {
  return http.get(`${W_O_URL}/page`, { params })
}
