<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-has="'user.index'" label="账号管理" name="account"/>
      <el-tab-pane v-has="'role.index'" label="角色管理" name="role"/>
    </el-tabs>
    <account v-show="activeName === 'account'" />
    <role v-show="activeName === 'role'"/>
  </div>
  <!--<el-card style="height: calc(100vh - 84px);overflow: auto">-->
  <!--<common-page ref="commonPage" :button-name="buttonName" :page-data="labelList" :table-data="labelData" @brandAdd="labelAdd" @brandUplate="labelUplate" @brandDel="labelDel" @tablePage="initLabelList"/>-->
  <!--</el-card>-->

</template>
<script>
import account from './account/index'
import role from './role/index'
export default {
  name: 'Index',
  components: {
    account,
    role
  },
  data() {
    return {
      activeName: 'account'
    }
  },
  created() {
    // this.initLabelList(this.labelList) // 初始化标签列表
  },
  methods: {
    handleClick(val) { // tabs页切换
      console.log(val, 'val')
      this.activeName = val.name
    }
  }
}
</script>

<style scoped>

</style>
