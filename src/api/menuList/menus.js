import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function menus() {
  return request({
    url: admin + '/menus.json',
    method: 'get'
  })
}
