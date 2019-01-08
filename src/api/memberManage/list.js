import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function memberList(query) { // 经销商列表
  return request({
    url: admin + '/member.json',
    method: 'get',
    params: query
  })
}
export function memberAdd(query) { // 经销商新增
  return request({
    url: admin + '/member.json',
    method: 'post',
    data: query
  })
}
export function memberDel(id) { // 经销商删除
  return request({
    url: admin + '/member/' + id + '.json',
    method: 'delete'
  })
}
export function memberUplate(query) { // 经销商修改
  return request({
    url: admin + '/member/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function memberDetail(id) { // 经销商详情
  return request({
    url: admin + '/member/' + id + '.json',
    method: 'get'
  })
}
