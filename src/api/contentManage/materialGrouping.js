import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function materialGroupList(query) { // 素材分组列表
  return request({
    url: admin + '/attachmentGroup.json',
    method: 'get',
    params: query
  })
}
export function materialGroupAdd(query) { // 素材分组新增
  return request({
    url: admin + '/attachmentGroup.json',
    method: 'post',
    params: query
  })
}
export function materialGroupDel(id) { // 素材分组删除
  return request({
    url: admin + '/attachmentGroup/' + id + '.json',
    method: 'delete'
  })
}
