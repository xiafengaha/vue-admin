<template>
  <div class="sidebar-container">
    <div class="logo">
      <img v-show="sidebar.opened" src="../../logo.png" />
      <img v-show="!sidebar.opened" src="../../small-logo.png" />
    </div>
    <el-menu
      :default-active="$route.meta.index"
      class="my-el-menu"
      :collapse="isCollapse"
      active-text-color="#fff"
      background-color="#2A2A33"
      text-color="#969EA7"
      :collapse-transition="true"
    >
      <sidebar-item :routes="routers"></sidebar-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SidebarItem from "./sidebarItem";
import ScrollBar from "components/scrollBar/scrollBar";
//import Hamburger from 'components/hamburger/hamburger.vue'

export default {
  components: {
    SidebarItem,
    ScrollBar
  },
  computed: {
    ...mapGetters(["routers", "sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    ...mapActions([
      "refundCountActions",
      "underwritingCountActions",
      "toggleSideBar"
    ])
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scope>
.sidebar-container {
  height: calc(100vh);
  background-color: #2a2a33;
  // overflow: auto;
}
.my-el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100vh - 88px);
  overflow: auto;
}

.logo {
  // height: 66px;
  width: 200px;
  transition: width 0.3s;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background-color: #2a2a33;
  img {
    height: 65px;
    // transition: width .3s;
    margin: 20px auto 3px;
    display: block;
  }
}
.hideSidebar {
  .logo {
    transition: width 0.3s;
    height: 66px;
    width: 64px;
    img {
      width: 38px;
      // transition: width .3s;
      height: 38px;
      margin: 14px 0 14px 24px;
    }
  }
  .my-el-menu {
    height: calc(100vh - 50px);
    overflow: auto;
  }
}
</style>
