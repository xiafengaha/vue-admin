
<template>
  <el-dropdown @command="handleCommand"  trigger="click"> 
    <span class="el-dropdown-link">
      <i class="iconfont icon-iconfontcaidan"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, index) in dropdownItemList" 
          :command="item.command" 
          :disabled="item.disabled"
          :key="index">
        {{item.text}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  export default {
    name: 'dropdown',
    data() {
      return {
       
      }
    },
    props: {
      node: Object
    },
    computed: {
      currentData() { //当前的数据 object
        return this.node.data
      },
      currentParentDataList() {   //父级数据 数组类型
        return this.node.parent.data.childDepartment || this.node.parent.data 
      },
      currentIndex() { // 获取当前项在父级数据中所在的index   
        return this.currentParentDataList.findIndex((item) => { 
          return item.id === this.currentData.id
        })
      },
      dropdownItemList() {
        return [
          {
            command: 'upMoveTeam',
            text: '上移',
            disabled: this.currentIndex == 0
          },
          {
            command: 'downMoveTeam',
            text: '下移',
            disabled: this.currentIndex == this.currentParentDataList.length - 1
          },
          {
            command: 'enableTeam',
            text: '启用团队',
            disabled: this.currentData.status == 'ENABLED'
          },
          {
            command: 'disableTeam',
            text: '禁用团队',
            disabled: this.currentData.status != 'ENABLED'
          },
          {
            command: 'editTeam',
            text: '修改团队名称'
          },
          {
            command: 'addChildTeam',
            text: '增加子级团队'
          }
        ]
      }
    },
    methods: {
      handleCommand(command) {  //下拉菜单点击时 根据点击项 发送不同的事件给父级
        console.log(this.node)
        for(let i = 0, len = this.dropdownItemList.length; i< len; i++) {
          let dropdownItem = this.dropdownItemList[i]
          if(dropdownItem.command === command) {
            this.$emit(command, this.node)
            break;
          }
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
