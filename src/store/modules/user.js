import { loginByUsername, logout } from '@/api/login'
import { loginMe } from '@/api/login'
// logout
import { getToken, setToken, removeToken, getSession } from '@/utils/auth'
// getUserInfo
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    uploadUrl: 'http://mch.dm.com',
    imgUrl: '',
    sex: [
      {
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 2
      },
      {
        label: '全部',
        value: 0
      }
    ],
    type: [
      {
        label: '商品推荐',
        value: 1
      },
      {
        label: '新手招募',
        value: 2
      },
      {
        label: '每日心语',
        value: 3
      }
    ],
    friendsType: [
      {
        label: '视频类型',
        value: 1
      },
      {
        label: '图片类型',
        value: 2
      },
      {
        label: '招贴',
        value: 3
      }
    ],
    coursewareType: [ // 课件类型
      {
        label: '视频',
        value: 1
      },
      {
        label: '音频',
        value: 2
      },
      {
        label: '问答',
        value: 3
      }
    ],
    agreementType: [
      {
        label: '经销商服务协议',
        value: 1
      },
      {
        label: '云仓服务协议',
        value: 2
      }
    ]
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_IMGURL: (state, imgUrl) => {
      state.imgUrl = imgUrl
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        // loginByUsername(username, userInfo.password).then(response => {
        //   const data = response.data
        let res = {
          data: {
            user: {
              username: 'admin'
            },
            menus: ['admin'],
            OSS_CDN_DOMAIN: '123'
          }
        }
        let data = res.data
          sessionStorage.setItem('userInfo', JSON.stringify(data))
          let userRoles = [data.user.username]
          if (Array.isArray(data.menus)) {
            commit('SET_ROLES', data.menus.concat(userRoles))
          } else {
            commit('SET_ROLES', userRoles)
          }
          commit('SET_TOKEN', '111')
          setToken('111')
          commit('SET_AVATAR', data.user.avatar)
          commit('SET_IMGURL', data.OSS_CDN_DOMAIN)
          commit('SET_NAME', data.user.username)
          resolve()
        // }).catch(error => {
        //   console.log(error)
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        // getUserInfo(state.token).then(response => {
        //   if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
        //     reject('error')
        //   }
        if (userInfo) {
          commit('SET_TOKEN', '111')
          setToken('111')
          commit('SET_AVATAR', userInfo.user.avatar)
          commit('SET_IMGURL', userInfo.OSS_CDN_DOMAIN)
          commit('SET_NAME', userInfo.user.username)
          const data = userInfo.menus
          if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data)
          } else {
            commit('SET_ROLES', [])
            // reject('getInfo: roles must be a non-null array !')
          }
          resolve(userInfo)
        } else {
          // next('/login')
          resolve()
        }

        //
        //   commit('SET_NAME', data.name)
        //   commit('SET_AVATAR', data.avatar)
        //   commit('SET_INTRODUCTION', data.introduction)

        // }).catch(error => {
        //   reject(error)
        // })
      })
    },
    getWhetherLoginInfo({ commit }, data) { // 获取用户信息
      return new Promise((resolve, reject) => {
        // loginMe().then(res => {
          // console.log(res, 'loginme')
          // if (res.code === 401) {
          //   reject(res)
          // } else {
          //   const data = res.data
            let res = {
              data: {
                user: {
                  username: 'admin'
                },
                menus: ['admin'],
                OSS_CDN_DOMAIN: '123'
              }
            }
            let data = res.data
            sessionStorage.setItem('userInfo', JSON.stringify(data))
            commit('SET_TOKEN', '111')
            let userRoles = [data.user.username]
            if (Array.isArray(data.menus)) {
              commit('SET_ROLES', data.menus.concat(userRoles))
            } else {
              commit('SET_ROLES', userRoles)
            }
            commit('SET_IMGURL', data.OSS_CDN_DOMAIN)
            // console.log(data.OSS_CDN_DOMAIN)
            // commit('SET_ROLES', data)
            // setToken(res.data.token)
            resolve(res)
          // }
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then((res) => {
          // if (res.code === 0) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken() // 清token
          sessionStorage.clear() // 清session
          resolve(res)
          // }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        sessionStorage.clear() // 清session
        resolve()
      })
    }

    // 动态修改权限
    // ChangeRoles({ commit, dispatch }, role) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', role)
    //     setToken(role)
    //     getUserInfo(role).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default user
