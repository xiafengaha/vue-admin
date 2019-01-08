import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function teamList(query) { // 团队列表
  return request({
    url: admin + '/groups/list.json',
    method: 'get',
    params: query
  })
}
export function teamDel(id) { // 团队删除
  return request({
    url: admin + '/groups/' + id + '.json',
    method: 'delete'
  })
}
export function teamDetail(id) { // 团队详情
  return request({
    url: admin + '/groups/' + id + '.json',
    method: 'get'
  })
}
export function teamUpdate(query) { // 团队修改
  return request({
    url: admin + '/groups/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
export function teamAdd(query) { // 团队新增
  return request({
    url: admin + '/groups/add.json',
    method: 'post',
    data: query
  })
}
