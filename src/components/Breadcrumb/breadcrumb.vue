<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in breadList" :key="item.title">
        <span style="cursor: pointer;" @click="jumpRouter(item)">{{item.title}}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  //import { generateTitle } from 'utils/utils'

  export default {
    created() {
      this.getBreadcrumb()
    },
    data() {
      return {
        breadList: []
      }
    },

    watch: {
      '$route'(to, from) {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb() {
        // this.breadList = this.$route.meta.breadList || []
        // console.log(this.$route, 'route')

        
        console.log(this.$route.matched, '1', this.$route)
        console.log(this.$route.meta.breadList, 'this.$route.meta.breadList')
        if (this.$route.query.pageKey === 'inform') {
          this.breadList = JSON.parse(JSON.stringify(this.$route.meta.informBreadList || []))
        } else {
          this.breadList = JSON.parse(JSON.stringify(this.$route.meta.breadList || []))
        }
        
      },
      jumpRouter(item) {
        if(item.name && item.isHaveQuery) {
          this.$router.push({name: item.name, query: this.$route.query})
          return
        } else if(item.name) {
          this.$router.push({name: item.name})
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    font-size: 14px;
    line-height: 100%;
    height: 100%;
    padding-left: 10px;
    background: #fff;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
