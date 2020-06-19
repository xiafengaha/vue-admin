<template>
  <div class="search-box">
    <el-input
      :size="size"
      :placeholder="placeholder"
      v-model="query">
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div>
</template>

<script>
  import {debounce} from './debounce'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '通过姓名或证件号码进行查询'
      },
      size:{
        type:String,
        default:'small'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      blur() {
        this.$refs.query.blur()
      },
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      }
    },
    created() {
      this.$watch('query', debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .search-box {

  }
</style>

