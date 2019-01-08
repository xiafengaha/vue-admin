import request from '@/utils/request'
import admin from '@/utils/apiAdmin'
export function wareGoodsList(query) { // 云仓列表
  return request({
    url: admin + '/wareGoods.json',
    method: 'get',
    params: query
  })
}
export function wareGoodsOut() { // 云仓报表导出
  return request({
    url: admin + '/wareGoodsOutPut.json',
    method: 'get'
  })
}
