<template>
  <common-page ref="commonPage" :button-name="buttonName" :page-data="labelList" :table-data="labelData" @labelAdd="labelAdd" @labelUplate="labelUplate" @labelDel="labelDel" @tablePage="initLabelList"/>
</template>

<script>
import commonPage from '../../commodity/components/commonPage'
import { contentLabelAdd, contentLabelUplate, contentLabelDel } from '@/api/contentManage/label'
import { uploadGrouping } from '@/api/common'
export default {
  name: 'Label',
  components: {
    commonPage
  },
  data() {
    return {
      buttonName: {
        name: '新增标签',
        type: 'label',
        value: 'goodsTag.add',
        edit: 'goodsTag.edit',
        del: 'goodsTag.del'
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
      uploadGrouping(data).then(res => {
        this.labelData = res.data
      })
    },
    labelAdd(data) { // 标签新增
      data.title = data.name
      // console.log(data, 'data')
      contentLabelAdd(data).then(res => {
        // console.log(res, 'add')
        this.$message.success('新增成功')
        this.callChildFun()
        this.initLabelList(this.labelList)
      })
    },
    labelUplate(data) { // 标签修改
      data.title = data.name
      contentLabelUplate(data).then(res => {
        // console.log(res, 'uplate')
        this.$message.success('修改成功')
        this.callChildFun()
        this.initLabelList(this.labelList)
      })
    },
    labelDel(data) { // 标签删除
      contentLabelDel(data.id).then(res => {
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
