import _storage from 'good-storage'
import {Base64} from 'js-base64'

//鉴权token
const TOKEN = '__token__'

//用户信息
const USER_INFO = '__userInfo__'

//账户信息（记住密码）
const ACCOUNT_INFO = '__accountInfo__'

//sidebar（侧边栏）
const SIDEBAR_STATUS = '__sidebarStatus_'


export function saveToken(token) {
  _storage.session.set(TOKEN, token)
}

export function getToken() {
  return _storage.session.get(TOKEN, '')
}

export function removeToken() {
  _storage.session.remove(TOKEN)
}


export function saveUserInfo(user) {
  _storage.session.set(USER_INFO, user)
}

export function getUserInfo() {
  return _storage.session.get(USER_INFO, {})
}

export function removeUserInfo() {
  _storage.session.remove(USER_INFO)
}

export function saveAccountInfo(account) {
  //账号转码简单加密
  let transCode = Base64.encode(JSON.stringify(account))
  _storage.set(ACCOUNT_INFO, transCode)
}

export function getAccountInfo() {
  //解码
  let accountInfo = _storage.get(ACCOUNT_INFO, '')
  if (accountInfo) {
    return JSON.parse(Base64.decode(_storage.get(ACCOUNT_INFO)))
  } else {
    return accountInfo
  }
}

export function removeAccountInfo() {
  _storage.remove(ACCOUNT_INFO)
}

export function saveSidebarStatus(status) {
  _storage.session.set(SIDEBAR_STATUS, status)
}

export function getSidebarStatus() {
  return _storage.session.get(SIDEBAR_STATUS, false)
}

export function removeSidebarStatus() {
  _storage.session.remove(SIDEBAR_STATUS)
}


