import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function addTemplate(query) { // 新增模版
  return request({
    url: admin + '/transport/templet/add.json',
    method: 'post',
    data: query
  })
}
export function templateList(query) { // 模版列表
  return request({
    url: admin + '/transport/templet/list.json',
    method: 'get',
    params: query
  })
}
export function templateDel(id) { // 模版删除
  return request({
    url: admin + '/transport/templet/' + id + '.json',
    method: 'delete'
  })
}
export function templateDetail(id) { // 模版详情
  return request({
    url: admin + '/transport/templet/' + id + '.json',
    method: 'get'
  })
}
export function templateUplate(query) { // 修改模版
  return request({
    url: admin + '/transport/templet/' + query.id + '.json',
    method: 'put',
    data: query
  })
}
