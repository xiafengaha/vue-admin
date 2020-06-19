import {getSidebarStatus,getUserInfo,getToken} from "../utils/storage";
import {constantRouterMap, asyncRouterMap} from 'src/router'
import constant from "./fixedData";
const state = {
  sidebar: {
    opened: getSidebarStatus()
  }, //侧边栏
  user: getUserInfo(),  //@param {Object} 用户信息
  token: getToken(),
  salesDepartmentList: [],//销售团队组织树
  routers: constantRouterMap, //路由总数组
  addRouters: [],              //新增的数组
  alreadyAddRouters: false,        //路由是否添加过动态路由
  fixedData: constant
}
export default state
