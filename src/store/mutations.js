import * as types from "./mutations-types";
import {
  saveUserInfo,
  saveToken,
  removeSidebarStatus,
  removeToken,
  removeUserInfo,
  saveSidebarStatus
} from "../utils/storage";
import { constantRouterMap } from "src/router";
const mutations = {
  [types.LOGIN](state, user) {
    //登录
    saveUserInfo(user);
    state.user = user;
  },
  [types.TOKEN](state, token) {
    //token
    saveToken(token);
    state.token = token;
  },
  [types.LOG_OUT](state) {
    //登出
    removeSidebarStatus();
    removeToken();
    removeUserInfo();
    state.user = {};
    state.token = "";
  },
  [types.TOGGLE_SIDEBAR](state) {
    state.sidebar.opened = !state.sidebar.opened;
    saveSidebarStatus(state.sidebar.opened);
  },
  [types.SALES_DEPARTMENT_LIST](state, data) {
    //团队组织树
    state.salesDepartmentList = data;
  },

  [types.CHANGE_ROUTERS](state, routers) {
    //路由数组变化
    state.alreadyAddRouters = true;
    state.addRouters = routers;
    state.routers = constantRouterMap.concat(routers);
  },
  [types.CHANGE_SUCCESS_DIALOG](state, obj) {
    //改变成功提示框的显示与隐藏
    state.successDialogObj = obj;
  },

  [types.CHANGE_PROCESS_DIALOG](state, isShow) {
    //是否显示上传模态框
    state.processDialogVisible = isShow;
  },
  [types.CHANGE_PROCESS_PERCENT](state, percent) {
    //改变上传进度数值
    state.processPercent = percent;
  }
};

export default mutations;
