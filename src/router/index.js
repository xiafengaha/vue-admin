import Vue from "vue";
import Router from "vue-router";

import Breadcrumb from "components/breadcrumb/breadcrumb.vue";
import Management from "components/management/index.vue";

const Layout = () => import("views/layout/layout.vue"); //左右布局、顶部公共样式
const Dashboard = () => import("views/dashboard/dashboard.vue"); //左右布局、顶部公共样式
const Login = () => import("views/login/login.vue"); //登录

Vue.use(Router);

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
/*
 * 路由注释
 * @hidden {Boolean} 表示不再侧边栏渲染出现
 * meta:{
 *   @requiresAuth {Boolean} 路由权限设置
 *   @name {String} 侧边栏名称
 *   @index {String}
 *   @icon {String} 侧边栏图标
 *   @code {String}
 * @svgIcon{String} 自定义侧边拦图标
 *   @isAlone {Boolean} 侧边栏一级时使用 默认false
 * }
 * */

export const constantRouterMap = [
  {
    path: "/login",
    name: "login",
    component: Login,
    hidden: true
  }
];

export default new Router({
  routes: constantRouterMap
});

export const asyncRouterMap = [
  // { path: "*", redirect: "/dashboard", hidden: true },
  {
    path: "/", //首页
    component: Layout,
    redirect: "/dashboard",
    name: "dashboard",
    meta: {
      isAlone: true,
      name: "首页",
      index: "a",
      icon: "icon-home",
      code: ""
    },
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        name: "dashboard",
        meta: {
          requiresAuth: true,
          name: "首页",
          index: "a",
          code: ""
        }
      }
    ]
  }
];
