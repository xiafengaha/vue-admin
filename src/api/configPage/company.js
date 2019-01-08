import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function companyDetail() { // 公司详情
  return request({
    url: admin + '/merchant.json',
    method: 'get'
  })
}
export function companyUpdate(query) { // 公司详情修改
  return request({
    url: admin + '/merchant.json',
    method: 'put',
    data: query
  })
}
