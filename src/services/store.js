import http from '@/utils/http'

const W_S_URL = '/api/business-server/store'

export function GetStores(params = {}) {
	return http.get(`${W_S_URL}/page`, { params })
}

