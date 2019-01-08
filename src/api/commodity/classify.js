import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function goodsCateApi() { // 商品分类列表api
  return request({
    url: admin + '/goodsCategories.json',
    method: 'get'
  })
}
export function classifyAdd(query) { // 分类添加
  return request({
    url: admin + '/goodsCategory.json',
    method: 'post',
    data: query
  })
}
export function classifyUplate(query) { // 分类修改
  return request({
    url: admin + '/goodsCategory/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
// /goodsCategory/{id}.json
export function classifyDel(id) { // 分类删除
  return request({
    url: admin + '/goodsCategory/' + id + '.json',
    method: 'delete'
  })
}
