import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function goodsBrandApi(query) { // 商品分类列表api
  return request({
    url: admin + '/brands.json',
    method: 'get',
    params: query
  })
}
export function goodsBrandAdd(query) { // 新增
  return request({
    url: admin + '/brand.json',
    method: 'post',
    data: query
  })
}
export function goodsBrandUplate(query) { // 修改
  return request({
    url: admin + '/brand/' + query.id + '.json',
    method: 'PUT',
    data: query
  })
}
export function goodsBrandDel(id) { // 删除
  return request({
    url: admin + '/brand/' + id + '.json',
    method: 'delete'
  })
}
