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

