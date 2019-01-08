import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function gradeList() { // 等级列表
  return request({
    url: admin + '/levelSetting.json',
    method: 'get'
  })
}
export function gradeSetting(query) { // 等级设置
  return request({
    url: admin + '/levelSetting.json',
    method: 'put',
    data: query
  })
}

export function goodsLevel(query) { //商品等级列表
  return request({
    url: admin + '/goodsLevel/' + query.id + '.json',
    method: 'get',
    params: query
  })
}
