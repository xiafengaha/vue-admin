// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";

import Element from "element-ui";
Vue.use(Element, { size: "small" });

import "./styles/index.scss";
import { asyncRouterMap } from "src/router";
import dbClick from "@/directive/btnClick/clickBtn"; // 防点击
import has from "@/directive/authBtn/hasBtn"; // 权限按钮
import loadMore from "@/directive/loadMore/loadMore"; // 下拉加载更多
import number from "@/directive/numberHandle/number"; // 保留两位小数
/* 挂载axios*/
import axios from "api/config";
import "./icons";
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
Vue.prototype.$axios = axios;
Vue.use(loadMore);
Vue.use(preview);

Vue.use(number);
Vue.use(has);
Vue.use(dbClick);
/* 生产环境 */
if (process.env.NODE_ENV === "production") {
  Vue.config.productionTip = false; //关闭警告
  Vue.config.devtools = false; //vue-devtools
}

let isToRightRouter = (routes, to) => {
  return routes.some(route => {
    return to.path.indexOf(route.path) > -1;
  });
};
router.beforeEach((to, from, next) => {
  //next()
  if (store.state.token) {
    //有token说明已登录 进行动态路由添加
    if (to.name === "login") {
      next();
    } else {
      if (!store.state.alreadyAddRouters) {
        //如果没添加过动态路由
        store
          .dispatch("generateAsyncRouters", store.getters.roles)
          .then(res => {
            router.addRoutes(store.state.addRouters);
            if (to.path === "/") {
              next("/dashboard");
            } else {
              next({ ...to, replace: true });
            }
          });
      }
      next();
    }
  } else {
    if (to.name === "login") {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
