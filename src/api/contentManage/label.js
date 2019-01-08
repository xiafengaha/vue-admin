import request from '@/utils/request'
import admin from '@/utils/apiAdmin'

export function contentLabelAdd(query) { // 新增
  return request({
    url: admin + '/attachmentCat.json',
    method: 'post',
    data: query
  })
}
export function contentLabelUplate(query) { // 修改
  return request({
    url: admin + '/attachmentCat/' + query.id + '.json',
    method: 'PUT',
    data: query
  })
}
export function contentLabelDel(id) { // 删除
  return request({
    url: admin + '/attachmentCat/' + id + '.json',
    method: 'delete'
  })
}
