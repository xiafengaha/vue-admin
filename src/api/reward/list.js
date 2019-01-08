import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function levelList() {
  return request({
    url: admin + '/level.json',
    method: 'get'
  })
}
export function levelGoods(id) {
  return request({
    url: admin + '/levelGoods/' + id + '.json',
    method: 'get'
  })
}
