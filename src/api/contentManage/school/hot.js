import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function hotList(query) { // 热门列表
  return request({
    url: admin + '/school/list.json',
    method: 'get',
    params: query
  })
}
export function hotAdd(query) { // 热门新增
  return request({
    url: admin + '/school/add.json',
    method: 'post',
    data: query
  })
}
export function hotUpdate(query) { // 热门修改
  return request({
    url: admin + '/school/' + query.id + '.json',
    method: 'PUT',
    data: query
  })
}
export function hotDel(id) { // 热门删除
  return request({
    url: admin + '/school/' + id + '.json',
    method: 'delete'
  })
}
export function hotDetail(id) { // 热门详情
  return request({
    url: admin + '/school/' + id + '.json',
    method: 'get'
  })
}
