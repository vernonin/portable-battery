import http from '@/utils/http'

const W_S_URL = '/api/business-server/store'

/**
 * 分页查询门店
 * @param {*} params 
 * @returns 
 */
export function GetStores(params = {}) {
	return http.get(`${W_S_URL}/page`, { params })
}

/**
 * 根据门店ID过去门店信息
 * @param {*} storeId 
 * @returns 
 */
export function GetStore(storeId) {
	return http.get(`${W_S_URL}/detail/${storeId}`)
}

/**
 * 新建门店
 * @param {*} data 
 * @returns 
 */
export function CreateStore(data) {
	return http.post(`${W_S_URL}/save`, data)
}

/**
 * 编辑门店
 * @param {*} data 
 * @returns 
 */
export function UpdateStore(data) {
	return http.post(`${W_S_URL}/update`, data)
}
