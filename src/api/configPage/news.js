import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function newsList(query) { // 消息列表
  return request({
    url: admin + '/notification/list.json',
    method: 'get',
    params: query
  })
}
export function newsDel(id) { // 消息列表删除
  return request({
    url: admin + '/notification/' + id + '.json',
    method: 'delete'
  })
}
export function newUpdate(query) { // 消息修改
  return request({
    url: admin + '/notification/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function newAdd(query) { // 消息新增
  return request({
    url: admin + '/notification/add.json',
    method: 'post',
    data: query
  })
}
export function newDetail(id) { // 消息详情
  return request({
    url: admin + '/notification/' + id + '.json',
    method: 'get'
  })
}
