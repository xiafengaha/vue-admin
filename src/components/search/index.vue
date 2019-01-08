<template>
  <el-input :style="inputWidth" v-model="searchData" :placeholder="parentPlaceholder" @focus="widthChange" @blur="reductionWidth" @keyup.enter.native="searchList" clearable>
    <!--<template slot="append"></template>-->
    <el-button slot="append" icon="el-icon-search" @click="searchList"/>
  </el-input>
</template>

<script>
import './style/index.scss'
export default {
  name: 'Index',
  props: {
    parentPlaceholder: {
      type: String,
      default: () => {
        return '请输入内容'
      }
    }
  },
  data() {
    return {
      inputWidth: {
        width: '195px'
      },
      searchData: '' // 需要搜索的数据
    }
  },
  methods: {
    widthChange() {
      this.inputWidth.width = '195px'
    },
    reductionWidth() {
      this.inputWidth.width = '195px'
    },
    searchList() { // 用户点了搜索按钮或者按了回车
      this.$emit('searchList', this.searchData)
    },
    clearInput() {
      this.searchData = ''
    }
  }
}
</script>

<style scoped>

</style>
