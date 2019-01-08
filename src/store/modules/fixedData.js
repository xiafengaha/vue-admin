const constant = {
  state: {
    COMMODITY_lIST: [ // 商品列表的下拉框
      {
        value: 0,
        label: '下架'
      },
      {
        value: 1,
        label: '上架'
      },
      {
        value: 2,
        label: '售罄'
      }
    ],
    NEWS_TYPE: [ //  消息状态数据
      {
        value: 0,
        label: '未发送'
      },
      {
        value: 1,
        label: '已发送'
      },
      {
        value: 2,
        label: '已取消'
      }
    ],
    MEMBER_ENABLED: [ // 经销商列表的启用禁用
      {
        label: '禁用',
        value: 0
      },
      {
        label: '可用',
        value: 1
      }
    ],
    MEMBER_TYPE: [ // 经销商类型
      {
        label: '个人',
        value: 1
      },
      {
        label: '企业',
        value: 2
      }
    ]
  }
}
export default constant
