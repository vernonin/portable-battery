import http from '@/utils/http'

export function GetRoles(params = {}) {
  return http.get('/api/system-server/role/rolePage', { params })
}
