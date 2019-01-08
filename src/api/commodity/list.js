import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function listApi(query) { // 商品列表api
  return request({
    url: admin + '/goods.json',
    method: 'get',
    params: query
  })
}

export function delShop(id) { // 删除商品
  return request({
    url: admin + '/goods/' + id + '.json',
    method: 'delete'
  })
}
export function addShop(query) { // 添加商品
  return request({
    url: admin + '/goods.json',
    method: 'post',
    data: query
  })
}
export function detailShop(id) { // 商品详情
  return request({
    url: admin + '/goods/' + id + '.json',
    method: 'get'
  })
}
export function uplateShop(query) { // 商品修改
  return request({
    url: admin + '/goods/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
