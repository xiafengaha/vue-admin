import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function friendsList(query) { // 朋友圈列表
  return request({
    url: admin + '/material.json',
    method: 'get',
    params: query
  })
}
export function friendsAdd(query) { // 朋友圈素材添加
  return request({
    url: admin + '/material.json',
    method: 'post',
    data: query
  })
}
export function friendsDel(id) { // 朋友圈删除
  return request({
    url: admin + '/material/' + id + '.json',
    method: 'delete'
  })
}
export function friendsUplate(query) { // 朋友圈修改
  return request({
    url: admin + '/material/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function friendsDetail(id) { // 朋友圈详情
  return request({
    url: admin + '/material/' + id + '.json',
    method: 'get'
  })
}
