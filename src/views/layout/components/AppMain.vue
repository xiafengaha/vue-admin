<template>
  <section class="app-main-container">
    <!-- 只有保单查询才有面包屑 注意隐藏 -->
    <!-- <router-view name="breadcrumb"></router-view> -->
    <!-- 销售管理弹出栏 -->
    <router-view name="management"></router-view>
    <div class="app-main">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
        <!-- <keep-alive >
         动态判断是否缓存
         </keep-alive>-->
      </transition>
    </div>
      <scroll-top>

    </scroll-top>
    <!-- <el-backtop target=".main-container .app-main-box"></el-backtop> -->

  </section>
</template>

<script>
import scrollTop from '@/components/scrollTop';
  export default {
    name: 'AppMain',
    components: {
    scrollTop
  }
  }
</script>
<style lang="scss" scoped>
  .app-main{
    background-color: #fff;
    padding: 24px;
    /*height: calc(100% - 104px);*/
    /*overflow-y: auto;*/
  }
</style>
