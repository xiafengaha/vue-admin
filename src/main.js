import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data
import * as filters from './filters' // global filters
import dbClick from '@/directive/btnClick/clickBtn' // 防止按钮重复点击
import loadMore from '@/directive/loadMore/loadMore' // 下拉加载更多
import number from '@/directive/numberHandle/number' // 保留两位小数
import vuePicturePreview from '@/components/vue-picture-preview'
import has from '@/directive/authBtn/hasBtn' // 按钮权限
Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.use(dbClick)
Vue.use(loadMore)
Vue.use(number)
Vue.use(vuePicturePreview)
Vue.use(has)
// Vue.prototype.filteNumber = function(params) {
//   params += '' // 转字符串
//   const newStr = params.split('.')
//   params = '.' + newStr[1]
//   return params
// }
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
