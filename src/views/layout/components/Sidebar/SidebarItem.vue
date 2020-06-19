<template>
  <div class="menu-wrapper">
    <template v-for="(item, index) in routes" v-if="!item.hidden && item.children">
      <router-link
        v-if="item.meta.isAlone"
        :key="item.name"
        :to="{name: item.children[0].name}"
        tag="div"
      >
        <el-menu-item :index="item.children[0].meta.index" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
          <svg-icon v-if="item.meta.svgIcon" class="iconfont" :icon-class="item.meta.svgIcon"></svg-icon>
          <span slot="title">{{item.children[0].meta.name}}</span>
        </el-menu-item>
      </router-link>
      <el-submenu  v-else :index="index + 'a'" :key="index" popper-append-to-body>
        <template slot="title">
          <i v-if="item.meta.icon" class="iconfont" :class="item.meta.icon"></i>
          <svg-icon v-if="item.meta.svgIcon" class="iconfont" :icon-class="item.meta.svgIcon"></svg-icon>
          <span slot="title">{{item.meta.name}}</span>
        </template>
        <!-- 对子级导航栏遍历 -->
        <template  v-if="!child.hidden" v-for="(child, idx) in item.children">
          <!-- 有三级时 解开注释 -->
           <!-- v-if="child.children && !!child.children.length" -->
          <sidebar-item
            class="nest-menu"
            :routes="[child]"
            v-if="child.children && !!child.children.length"
            :is-nest="true"
            :key="child.path"
          ></sidebar-item>
          <router-link v-else :to="{ name: child.name}" :key="idx" class="link-item" tag="div">
            <el-menu-item :index="child.meta.index">
              <span slot="title">{{child.meta.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      timeOut: 20000
    }
  },
  computed: {}
};
</script>




