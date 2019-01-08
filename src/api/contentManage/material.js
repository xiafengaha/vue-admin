import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function materialList(query) { // 素材列表
  return request({
    url: admin + '/attachment.json',
    method: 'get',
    params: query
  })
}
export function materialAdd(query) { // 素材新增
  return request({
    url: admin + '/attachment.json',
    method: 'post',
    data: query
  })
}
export function materialDetail(id) { // 素材详情
  return request({
    url: admin + '/attachment/' + id + '.json',
    method: 'get'
  })
}
export function materialUplate(query) { // 素材修改
  return request({
    url: admin + '/attachment/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function materialDel(id) { // 素材删除
  return request({
    url: admin + '/attachment/' + id + '.json',
    method: 'delete'
  })
}
