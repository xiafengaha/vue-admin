import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function rolesList(query) { // 角色列表
  return request({
    url: admin + '/roles.json',
    method: 'get',
    params: query
  })
}

export function roleAdd(query) { // 角色新增
  return request({
    url: admin + '/role.json',
    method: 'post',
    data: query
  })
}

export function roleUplate(query) { //  角色修改
  return request({
    url: admin + '/role/' + query.id + '.json',
    method: 'put',
    data: query
  })
}

export function roleDel(id) { // 角色删除
  return request({
    url: admin + '/role/' + id + '.json',
    method: 'delete'
  })
}
export function roleDetail(id) { // 角色详情
  return request({
    url: admin + '/role/' + id + '.json',
    method: 'get'
  })
}
