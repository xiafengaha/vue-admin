import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function wareHouseList(query) { // 账户列表
  return request({
    url: admin + '/warehouse.json',
    method: 'get',
    params: query
  })
}
export function wareHouseUplate(query) { // 修改收发货地址
  return request({
    url: admin + '/warehouse/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function wareHouseAdd(query) { // 新增地址
  return request({
    url: admin + '/warehouse.json',
    method: 'post',
    data: query
  })
}
export function wareHouseDel(id) { // 删除地址
  return request({
    url: admin + '/warehouse/' + id + '.json',
    method: 'delete'
  })
}
