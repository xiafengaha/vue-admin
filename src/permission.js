import router from './router'
import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css'// progress bar style
import { getSession } from '@/utils/auth' // getToken from cookie

// NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/content/protocol']// no redirect whitelist
let whetherLoad = true
router.beforeEach((to, from, next) => {
  // store.dispatch('getWhetherLoginInfo', '').then(res => {
  // if (to.path === '/login') {

  // }
  // console.log(to, 123)
  const userInfo = JSON.parse(getSession('userInfo'))
  console.log(userInfo, 'userInfo', to.path)
  if (userInfo) { // 判断是否有用户信息
    if (to.path === '/login') {
      // store.dispatch('getWhetherLoginInfo', '').then(res => {
      //   sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        next()
      // next({ path: '/' })
      // console.log('123')
    } else {
      if (whetherLoad) {
        if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
          // console.log(to, '1')
          store.dispatch('GetUserInfo').then(res => { // 拉取info
            // if (res.menus) { //后期有权限了在放出来
              store.dispatch('GenerateRoutes', res).then(() => { // 生成可访问的路由表
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                whetherLoad = false
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
            // } else {
            //   next()
            // }
          }).catch(err => {
            console.log(err)
          })
        } else {
          // console.log(to, '2')
          store.dispatch('GenerateRoutes', userInfo).then((res) => { // 生成可访问的路由表
            // console.log(res, store.getters.addRouters)
            router.addRoutes(res) // 动态添加可访问路由表
            whetherLoad = false
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      store.dispatch('getWhetherLoginInfo', '').then(res => {
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        next({ path: '/' })
      }).catch(() => {
        next('/login') // 否则全部重定向到登录页
      })
      next() // 避免死循环
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
  // }).catch(() => {
  //   if (to.path === '/login') {
  //     next()
  //   } else {
  //     next('/login') // 否则全部重定向到登录页
  //   }
  // console.log(err)
  // })
})

// router.afterEach(() => {
//   NProgress.done() // finish progress bar
// })
