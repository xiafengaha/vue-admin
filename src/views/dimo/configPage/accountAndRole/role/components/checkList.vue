<template>
  <div class="deliverySetting">
    <div class="deliverySetting-table">
      <div class="table-head">
        <div class="selection">
          <el-checkbox :indeterminate="indeterminate" v-model="ischeckAll" label="全选" @change="handleCheckAllChange"/>
        </div>
        <!--<div class="width185">全选</div>-->
      </div>
      <div v-for="(partition,partitionIndex) in parentCheckbox" :key="partitionIndex" class="table-body" style="display: block">
        <div>
          <p ><el-checkbox :indeterminate="partition.indeterminate" v-model="partition.is_enabled" :key="partition.id" :label="partition.id" @change="handleCheckedCountryAllChange(partitionIndex,partition.id,$event)">{{ partition.title }}</el-checkbox></p>
        </div>
        <div class="level-three-checkbox">
          <el-checkbox v-for="childData in partition._child" v-model="childData.is_enabled" :label="childData.id" :key="childData.id" @change="handleCheckedCountryChange(partitionIndex,childData.id,partition.id,$event)">{{ childData.title }}</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DeliverySetting',
  components: {
  },
  props: {
    parentCheckbox: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      distributorsInfo: [
        { partitionName: '1区', selected: false, partitionId: 1, isIndeterminate: false,
          country: [
            { id: '1', fieldName: '奥地利', fieldTableName: '奥地利', distributors: 'UPS', selected: false },
            { id: '2', fieldName: '芬兰', fieldTableName: '芬兰', distributors: 'UPS', selected: false },
            { id: '3', fieldName: '意大利', fieldTableName: '意大利', distributors: 'UPS', selected: false },
            { id: '4', fieldName: '葡萄牙', fieldTableName: '葡萄牙', distributors: 'UPS', selected: false },
            { id: '9', fieldName: '西班牙', fieldTableName: '西班牙', distributors: 'UPS', selected: false },
            { id: '10', fieldName: '瑞典', fieldTableName: '瑞典', distributors: 'UPS', selected: false }]
        },
        { partitionName: '2区', selected: false, partitionId: 2, isIndeterminate: false,
          country: [
            { id: '5', fieldName: '丹麦', fieldTableName: '单买', distributors: '', selected: false },
            { id: '6', fieldName: '法国', fieldTableName: '法国', distributors: '', selected: false }]
        },
        { partitionName: '3区', selected: false, partitionId: 3, isIndeterminate: false,
          country: [
            { id: '7', fieldName: '德国', fieldTableName: '德国', distributors: 'YODEL', selected: false },
            { id: '8', fieldName: '瑞士', fieldTableName: '瑞士', distributors: 'DPD', selected: false }]
        }
      ],
      ischeckAll: false, //
      distributorForm: {
        vendorName: '',
        senderName: ''
      },
      indeterminate: false,
      rules: {
        senderName: [{ required: true, message: '字段不能为空', trigger: 'blur' }],
        website: [{ required: true, message: '字段不能为空', trigger: 'blur' }]
      },
      menusId: [] // 存放勾选的ID
    }
  },
  computed: {
  },
  watch: {
    'parentCheckbox': 'initCheckbox'
  },
  created() {
  },
  mounted() {
    // (async() => {
  },
  methods: {
    initCheckbox() {
      this.indeterminate = true
      this.getIsCheckAll()
      // console.log(this.parentCheckbox, this.indeterminate)
    },
    handleCheckAllChange(e) { // 一级change事件
      // console.log(e,'e')
      this.ischeckAll = e
      this.indeterminate = false
      this.menusId = []
      for (var i = 0, len = this.parentCheckbox.length; i < len; i++) { // 二级全选反选
        this.parentCheckbox[i].is_enabled = e
        this.parentCheckbox[i].indeterminate = false // 去掉二级不确定状态
        for (var j = 0, len1 = this.parentCheckbox[i]._child.length; j < len1; j++) { // 三级全选反选
          this.parentCheckbox[i]._child[j].is_enabled = e
        }
      }
      // console.log(this.menusId,'menusId')
    },
    handleCheckedCountryAllChange(index, topId, e) { // 二级change事件
      // console.log(index, topId, e)
      this.parentCheckbox[index].is_enabled = e// 二级勾选后，子级全部勾选或者取消
      this.parentCheckbox[index].indeterminate = false // 去掉二级不确定状态
      let childrenArray = this.parentCheckbox[index]._child
      if (childrenArray) {
        for (var i = 0, len = childrenArray.length; i < len; i++) { childrenArray[i].is_enabled = e }
      }
      this.getIsCheckAll()
    },
    handleCheckedCountryChange(topIndex, sonId, topId, e) { // 三级change事件
      var childrenArray = this.parentCheckbox[topIndex]._child
      var tickCount = 0, unTickCount = 0, len = childrenArray.length
      for (var i = 0; i < len; i++) {
        if (sonId === childrenArray[i].id) childrenArray[i].is_enabled = e
        if (childrenArray[i].is_enabled) tickCount++
        if (!childrenArray[i].is_enabled) unTickCount++
      }
      if (tickCount === len) { // 三级级全勾选
        this.parentCheckbox[topIndex].is_enabled = true
        this.parentCheckbox[topIndex].indeterminate = false
      } else if (unTickCount === len) { // 三级级全不勾选
        this.parentCheckbox[topIndex].is_enabled = false
        this.parentCheckbox[topIndex].indeterminate = false
      } else {
        this.parentCheckbox[topIndex].is_enabled = false
        this.parentCheckbox[topIndex].indeterminate = true // 添加二级不确定状态
      }
      this.getIsCheckAll()
    },
    getIsCheckAll() {
      var tickCount = 0, unTickCount = 0, indeterminateCount = 0, ArrLength = this.parentCheckbox.length
      for (var j = 0; j < ArrLength; j++) { // 全选checkbox状态
        if (this.parentCheckbox[j].is_enabled) tickCount++
        if (!this.parentCheckbox[j].is_enabled) unTickCount++
        if (this.parentCheckbox[j].indeterminate) indeterminateCount++
      }
      if (tickCount === ArrLength) { // 二级全勾选
        this.ischeckAll = true
        this.indeterminate = false
      } else if (unTickCount === ArrLength) { // 二级全不勾选
        this.ischeckAll = false
        if (indeterminateCount > 0) {
          this.indeterminate = true
        } else {
          this.indeterminate = false
        }
      } else {
        this.ischeckAll = false
        this.indeterminate = true // 添加一级不确定状态
      }
    },
    getAllCheckId() { // 获取用户勾选的ID
      this.menusId = [] // 每次需要置空
      this.parentCheckbox.forEach((item, index) => {
        if (item.is_enabled) { // 表示用户勾选状态
          this.menusId.splice(index, 0, item.id)
        }
        item._child.forEach((items, indexs) => {
          if (items.is_enabled) {
            this.menusId.splice(indexs, 0, items.id)
          }
        })
      })
      // console.log(this.menusId, 'menusid')
      return this.menusId
    }
  }
}
</script>
<style lang="scss" scoped>
  .deliverySetting{
    padding: 20px 0;
    position: relative;
    .el-table{
      thead{
        tr{
          th{
            font-size: 14px;
          }
        }
      }
      tbody{
        tr{
          td{
            vertical-align: baseline;
            p{
              line-height: 30px;
            }
            .el-checkbox-group{
              display: flex;
              flex-direction: column;
              label{
                line-height: 30px;
                margin-left: 0;
              }
            }
          }
        }
      }
    }
    .deliverySetting-table{
      font-size: 14px;
      color: #333;
      .table-head,
      .table-body{
        display: flex;
        padding: 10px 0;
        .selection{
          width: 45px;
          text-align: center;
          line-height: 36px;
        }
        .level-three-checkbox{
          .el-checkbox{
            margin-left: 30px;
          }
        }
        .width185{
          width: 185px;
        }
        .width265{
          width: 265px;
        }
      }
      .table-head{
        height: 36px;
        align-items: center;
        /*background-color: #E7F2FF;*/
      }
      .table-body{
        border-bottom: 1px solid #e4e4e4;
        color: #666;
        &:hover{
          background-color: #f5f7fa;
        }
        .width265{
          display: flex;
          flex-direction: column;
          label{
            line-height: 30px;
            margin-left: 0;
            color: #666;
          }
        }
        p{
          line-height: 30px;
        }
      }
    }
    .deliverySetting-btn{
      /*width: 100%;*/
      height: 59px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      top: -55px;
      right: -16px;
      z-index: 100;
      .tabs-btn {
        min-width: 90px;
        height: 34px;
        line-height: 32px;
        padding: 0 10px;
        color: #2387f7;
        border: solid 1px #4fa2ff;
        background-color: #e7f2ff;
        cursor: pointer;
        &:nth-of-type(2) {
          margin: 0 15px;
        }
        input {
          border: none;
          background: transparent;
          color: inherit;
          cursor: inherit;
          outline: none;
          margin: 0;
          padding: 0;
        }
        &:hover {
          color: #fff;
          background-color: #2387f7;
        }
      }
    }
    .setDistributorDailog{
      .el-input{
        width: 270px;
      }
    }
  }
</style>
