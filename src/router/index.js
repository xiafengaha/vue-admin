import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
// import contentRouter from './modules/content'
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menuList, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menuList
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    meta: {
      title: 'dashboard',
      role: ['admin']
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, role: ['admin'] }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // contentRouter,
  // tableRouter,
  // componentsRouter，
  // nestedRouter,
  // {
  //   path: '/commodity', // 商品管理
  //   component: Layout,
  //   redirect: {
  //     name: 'commodity'
  //   },
  //   meta: {
  //     title: 'commodity',
  //     icon: 'goods',
  //     role: ['goods.index', 'goodsTag', 'goodsCategory', 'brand']
  //   },
  //   children: [
  //     {
  //       path: 'list', // 商品列表
  //       component: () => import('@/views/dimo/commodity/list/index'),
  //       name: 'List',
  //       meta: { title: 'list',icon: 'goods-list', noCache: true, role: ['goods.index'] }
  //     },
  //     {
  //       path: 'release', // 商品发布
  //       component: () => import('@/views/dimo/commodity/list/releaseGoods'),
  //       name: 'Release',
  //       meta: { title: 'release', noCache: true, role: ['goods.add'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'label',
  //       component: () => import('@/views/dimo/commodity/label/index'),
  //       name: 'Label', // 标签
  //       meta: { title: 'label', icon: 'goods-label', noCache: true, role: ['goodsTag.index'] }
  //     },
  //     {
  //       path: 'classify',
  //       component: () => import('@/views/dimo/commodity/classify/index'),
  //       name: 'Classify', // 分类
  //       meta: { title: 'classify', icon: 'goods-classify', noCache: true, role: ['goodsCategory.index'] }
  //     },
  //     {
  //       path: 'brand',
  //       component: () => import('@/views/dimo/commodity/brand/index'),
  //       name: 'Brand', // 品牌
  //       meta: { title: 'brand', icon: 'goods-brand', noCache: true, role: ['brand.index'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/config', // 设置
  //   component: Layout,
  //   redirect: {
  //     name: 'config'
  //   },
  //   meta: {
  //     title: 'config',
  //     icon: 'config',
  //     role: ['role.index', 'user', 'warehouse', 'shipment']
  //   },
  //   children: [
  //     {
  //       path: 'configPage',
  //       component: () => import('@/views/dimo/configPage/accountAndRole/index'),
  //       name: 'ConfigPage',
  //       meta: { title: 'configPage', icon: 'role', noCache: true, role: ['role.index', 'user.index'] }
  //     },
  //     {
  //       path: 'logisticsInfo',
  //       component: () => import('@/views/dimo/configPage/logisticsInfo/index'),
  //       name: 'LogisticsInfo',
  //       meta: { title: 'logisticsInfo', icon: 'logistics-info', noCache: true, role: ['shipment.index'] }
  //     },
  //     {
  //       path: 'template',
  //       component: () => import('@/views/dimo/configPage/logisticsInfo/freightTemplate'),
  //       name: 'Template',
  //       meta: { title: 'template', icon: 'guide', noCache: true, role: ['shipment.add', 'shipment.edit'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'shipping',
  //       component: () => import('@/views/dimo/configPage/shippingAddress/index'),
  //       name: 'Shipping',
  //       meta: { title: 'shipping', icon: 'shipping', noCache: true, role: ['warehouse.index'] }
  //     },
  //     {
  //       path: 'news',
  //       component: () => import('@/views/dimo/configPage/news/index'),
  //       name: 'News',
  //       meta: { title: 'news', icon: 'guide', noCache: true, role: ['notification.index'] }
  //     },
  //     {
  //       path: 'addNews',
  //       component: () => import('@/views/dimo/configPage/news/addNews'),
  //       name: 'AddNews',
  //       meta: { title: 'addNews', icon: 'guide', noCache: true, role: ['notification.add'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'companyInfo',
  //       component: () => import('@/views/dimo/configPage/companyInfo/index'),
  //       name: 'CompanyInfo',
  //       meta: { title: 'companyInfo', icon: 'company-info', noCache: true, role: ['admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/team',
  //   component: Layout,
  //   redirect: '/team/list',
  //   meta: {
  //     title: 'team',
  //     role: ['groups.index']
  //   },
  //   children: [
  //     {
  //       path: 'teamList',
  //       component: () => import('@/views/dimo/teamManage/list'),
  //       name: 'TeamList',
  //       meta: { title: 'teamList', icon: 'team', noCache: true, role: ['groups.index'] }
  //     },
  //     {
  //       path: 'addTeam',
  //       component: () => import('@/views/dimo/teamManage/addTeam'),
  //       name: 'AddTeam',
  //       meta: { title: 'addTeam', icon: 'team', noCache: true, role: ['groups.add'] },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/member',
  //   component: Layout,
  //   redirect: '/member/list',
  //   meta: {
  //     title: 'member',
  //     icon: 'member-manage',
  //     role: ['member.index']
  //   },
  //   children: [
  //     {
  //       path: 'memberList',
  //       component: () => import('@/views/dimo/memberManage/member/list'),
  //       name: 'memberList',
  //       meta: { title: 'memberList', icon: 'member', noCache: true, role: ['member.index'] }
  //     },
  //     {
  //       path: 'addMember',
  //       component: () => import('@/views/dimo/memberManage/member/addMember'),
  //       name: 'AddMember',
  //       meta: { title: 'addMember', icon: 'documentation', noCache: true, role: ['member.add'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'grade',
  //       component: () => import('@/views/dimo/memberManage/grade/list'),
  //       name: 'Grade',
  //       meta: { title: 'grade', icon: 'grade', noCache: true, role: ['admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/reward',
  //   component: Layout,
  //   name: 'Reward',
  //   meta: { title: 'reward', icon: 'reward', noCache: true, role: ['admin'] },
  //   children: [
  //     {
  //       path: 'policy',
  //       name: 'RewardList',
  //       component: () => import('@/views/dimo/reward/list'),
  //       meta: { title: 'rewardList', icon: 'reward', noCache: true , role: ['admin']}
  //     }
  //   ]
  // },
  // {
  //   path: '/recommend',
  //   component: Layout,
  //   name: 'Recommend',
  //   meta: { title: 'recommend', icon: 'recommend', noCache: true, role: ['admin']},
  //   children: [
  //     {
  //       path: 'nexus',
  //       name: 'RecommendNexus',
  //       component: () => import('@/views/dimo/recommend/nexus'),
  //       meta: { title: 'recommendNexus', icon: 'recommend', noCache: true, role: ['admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/finance',
  //   component: Layout,
  //   name: 'Finance',
  //   meta: { title: 'finance', icon: 'finance', noCache: true, role: ['admin'] },
  //   children: [
  //     {
  //       path: 'cash',
  //       name: 'FinanceCash',
  //       component: () => import('@/views/dimo/finance/cash/cash'),
  //       meta: { title: 'financeCash', icon: 'finance', noCache: true, role: ['admin'] }
  //     },
  //     {
  //       path: 'cashConfig',
  //       name: 'FinanceConfig',
  //       component: () => import('@/views/dimo/finance/cash/config'),
  //       meta: { title: 'financeConfig', icon: 'config', noCache: true, role: ['admin'] },
  //       hidden: true
  //     },
  //     {
  //       path: 'memberAccount',
  //       name: 'MemberAccount',
  //       component: () => import('@/views/dimo/finance/account/memberAccount'),
  //       meta: { title: 'memberAccount', icon: 'account', noCache: true, role: ['admin'] }
  //     },
  //     {
  //       path: 'bonus',
  //       name: 'BonusList',
  //       component: () => import('@/views/dimo/finance/bonus/list'),
  //       meta: { title: 'bonusList', icon: 'bonus', noCache: true, role: ['admin'] }
  //     },
  //     {
  //       path: 'profit',
  //       name: 'ProfitList',
  //       component: () => import('@/views/dimo/finance/profit/list'),
  //       meta: { title: 'profitList', icon: 'profit', noCache: true, role: ['admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: {
  //     name: 'Guide'
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menuList
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/icon',
  //   component: Layout,
  //   meta: {
  //     title: 'icon',
  //     role: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true, role: ['admin'] }
  //     }
  //   ]
  // },

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab' }
  //     }
  //   ]
  // },
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/errorLog/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/exportExcel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/selectExcel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true, meta: { title: '404', role: ['admin'] }}
]
