import request from '@/utils/request'
import auth from '@/utils/apiAuth'
import admin from '@/utils/apiAdmin'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: auth + '/login.json',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: auth + '/logout',
    method: 'get'
  })
}
export function loginMe() { // 登陆用户信息
  return request({
    url: admin + '/me.json',
    method: 'get'
  })
}
