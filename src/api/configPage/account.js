import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function accountList(query) { // 账户列表
  return request({
    url: admin + '/users.json',
    method: 'get',
    params: query
  })
}

export function accountAdd(query) { // 账户新增
  return request({
    url: admin + '/user.json',
    method: 'post',
    data: query
  })
}

export function accountUplate(query) { //  账户修改
  return request({
    url: admin + '/user/' + query.id + '.json',
    method: 'put',
    data: query
  })
}

export function accountDel(id) { // 账户删除
  return request({
    url: admin + '/user/' + id + '.json',
    method: 'delete'
  })
}
export function changeEnabled(id) { // 启用禁用
  return request({
    url: admin + '/userEnabled/' + id + '.json',
    method: 'put'
  })
}
