<template>
  <!--<el-card style="height: calc(100vh - 84px);overflow: auto">-->
  <common-page ref="commonPage" :button-name="buttonName" :page-data="labelList" :table-data="labelData" @brandAdd="labelAdd" @brandUplate="labelUplate" @brandDel="labelDel" @tablePage="initLabelList"/>
  <!--</el-card>-->
</template>
<script>
import commonPage from '../components/commonPage'
import { goodsBrandApi, goodsBrandAdd, goodsBrandUplate, goodsBrandDel } from '@/api/commodity/brand'
export default {
  name: 'Index',
  components: {
    commonPage
  },
  data() {
    return {
      buttonName: {
        name: '新增品牌',
        type: 'brand',
        value: 'brand.add',
        edit: 'brand.edit',
        del: 'brand.del'
      },
      labelList: {
        limit: 10,
        offset: 0
      },
      labelData: {
        _count: 0
      } // 存放标签的对象
    }
  },
  created() {
    this.initLabelList(this.labelList) // 初始化标签列表
  },
  methods: {
    initLabelList(data) { // 获取标签列表
      goodsBrandApi(data).then(res => {
        this.labelData = res.data
        // this.labelData = {
        //   "_count": 17,
        //   "data": [
        //     {
        //       "id": 4,
        //       "merchant_id": 1,
        //       "shop_id": 1,
        //       "name": "baokuan_newnew",
        //       "icon": "hasudjtfvghbuhbhjkok",
        //       "list_order": 0,
        //       "created_at": "2018-11-22 02:29:32",
        //       "updated_at": "2018-11-22 02:32:42",
        //       "deleted_at": null
        //     },
        //     {
        //       "id": 13,
        //       "merchant_id": 0,
        //       "shop_id": 0,
        //       "name": "baokuan",
        //       "icon": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542862177428&di=eee087fa519ee7402e55f6be113832bd&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F32fa828ba61ea8d3d8d6c33f9c0a304e251f5810.jpg",
        //       "list_order": 0,
        //       "created_at": "2018-11-22 02:29:32",
        //       "updated_at": "2018-11-22 02:32:42",
        //       "deleted_at": null
        //     }
        //   ]
        //
        // }
      })
    },
    labelAdd(data) { // 标签新增
      goodsBrandAdd(data).then(res => {
        // console.log(res, 'add')
        this.$message.success('新增成功')
        this.callChildFun()
        this.initLabelList(this.labelList)
      })
    },
    labelUplate(data) { // 标签修改
      goodsBrandUplate(data).then(res => {
        // console.log(res, 'uplate')
        this.$message.success('修改成功')
        this.callChildFun()
        this.initLabelList(this.labelList)
      })
    },
    labelDel(data) { // 标签删除
      goodsBrandDel(data.id).then(res => {
        this.$message.success('删除成功')
        this.initLabelList(this.labelList)
      })
    },
    callChildFun() {
      this.$refs.commonPage.resetForm('ruleForm')
    }
  }
}
</script>

<style scoped>

</style>
