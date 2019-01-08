import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function goodsLabelApi(query) { // 商品标签列表api
  return request({
    url: admin + '/goods/tags/list.json',
    method: 'get',
    params: query
  })
}
export function goodsLabelAdd(query) { // 新增
  return request({
    url: admin + '/goods/tags/add.json',
    method: 'post',
    data: query
  })
}
export function goodsLabelUplate(query) { // 修改
  return request({
    url: admin + '/goods/tags/' + query.id + '.json',
    method: 'PUT',
    data: query
  })
}
export function goodsLabelDel(id) { // 删除
  return request({
    url: admin + '/goods/tags/' + id + '.json',
    method: 'delete'
  })
}
