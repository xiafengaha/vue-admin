//状态异步变化
import * as types from "./mutations-types";
import axios from "api/config";
// import teammateApi from 'api/teammate-api'
import { asyncRouterMap } from "src/router";

//收放侧边栏
export const toggleSideBar = function({ commit }) {
  commit(types.TOGGLE_SIDEBAR);
};

/*
 * 获取组织树存放在vuex,销售团队选择器使用、组织树使用
 * */

function insertDisabled(arrObj) {
  for (let i = 0, len = arrObj.length; i < len; i++) {
    let itemObj = arrObj[i];
    itemObj.disabled = itemObj.status != "ENABLED";
    if (itemObj.childDepartment && !!itemObj.childDepartment.length) {
      insertDisabled(itemObj.childDepartment);
    }
  }
  return arrObj;
}

// export const getTreeLayerr = function ({commit}) {
//   axios({
//     method:teammateApi.treeLayerr.method,
//     url:teammateApi.treeLayerr.url
//      })
//     .then(response => {
//       let resData = response.data.data || []
//       commit(types.SALES_DEPARTMENT_LIST, insertDisabled(resData))
//     })
//     .catch(error => {

//     })
// }
function hasPermission(route, roles) {
  // 1. 判断路由是否有权限
  // if (route.meta && route.meta.code) {
  //   return roles.some(role => role.code === route.meta.code);
  // } else {
  //   return true;
  // }
  return true;
}
function filterAsyncRouter(asyncRouterMap, roles) {
  // 2. 把异步路由数组里有权限的过滤出来
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(route, roles)) {
      if (route.children && !!route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }

      return true;
    }
    return false;
  });
  return accessedRouters;
}

export const generateAsyncRouters = function({ commit }, roles) {
  //过滤出路由后 使用action
  return new Promise(resolve => {
    let accessRouters = filterAsyncRouter(asyncRouterMap, roles);
    commit(types.CHANGE_ROUTERS, accessRouters);
    resolve(accessRouters);
  });
};
