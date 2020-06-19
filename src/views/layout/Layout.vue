<template>
  <!-- :class="{hideSidebar:!sidebar.opened}" -->
  <div :class="sidebar.opened ? 'app-wrapper' : 'hideSidebar app-wrapper'">
    <el-container>
      <!-- <el-aside> -->
      <sidebar class="sidebar-container"></sidebar>
      <!-- </el-aside> -->
      <el-container>
        <el-header>
          <navbar></navbar>
        </el-header>
        <el-main style="height: calc(100% - 66px)">
          <!-- 主体区域 -->
          <div class="main-container">
            <!--            <el-scrollbar style="height: 100%" ref="elscrollbar">-->
            <app-main class="app-main-box"></app-main>

            <!--            </el-scrollbar>-->
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain } from "views/layout/components";
import { mapGetters } from "vuex";
import "./index.scss";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    ...mapGetters(["sidebar"])
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
