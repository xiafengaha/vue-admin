import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function richList(query) { // 协议列表
  return request({
    url: admin + '/merchantCbm.json',
    method: 'get',
    params: query
  })
}
export function richAdd(query) { // 协议新增
  return request({
    url: admin + '/merchantCbm.json',
    method: 'post',
    data: query
  })
}
export function richUpdate(query) { // 协议修改
  return request({
    url: admin + '/merchantCbm/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function richDetail(id) { // 协议详情
  return request({
    url: admin + '/merchantCbm/' + id + '.json',
    method: 'get'
  })
}
export function richDel(id) { // 协议删除
  return request({
    url: admin + '/merchantCbm/' + id + '.json',
    method: 'delete'
  })
}
