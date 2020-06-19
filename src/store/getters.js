//取出状态
export const user = state => state.user
export const sidebar = state => state.sidebar
export const roles = state => state.user.functionList || []   //路由权限数组
export const routers = state => state.routers  //总路由数组
export const salesDepartmentList = state => state.salesDepartmentList  //组织树数据

