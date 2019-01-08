import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function uploadGrouping(query) { // 商品标签列表api
  return request({
    url: admin + '/attachmentCat.json',
    method: 'get',
    params: query
  })
}
export function submitUpload(query) { // 上传文件
  return request({
    url: admin + '/uploadFile.json',
    method: 'post',
    data: query
  })
}
export function filesList(query) { // 文件列表
  return request({
    url: admin + '/files.json',
    method: 'get',
    params: query
  })
}
export function areaList() { // 省市区
  return request({
    url: '/regions.json',
    method: 'get'
  })
}
