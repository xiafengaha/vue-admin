import axios from "axios";
import { Message } from "element-ui";
import store from "../store/index";
import router from "../router/index";
// import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loading'
const env = process.env.NODE_ENV;
const isMock = false; //mock开关

import hosts from "./hosts";
// let count = 0; // 记录错误次数，只想多个API请求错误的时候，message只提示一次
//设置baseURL
if (!isMock) axios.defaults.baseURL = hosts[env];

axios.defaults.timeout = 30000; // 请求超时时间

// request拦截器
axios.interceptors.request.use(
  config => {
    // Do something before request is sent

    if (store.state.token) {
      config.headers.Authorization = store.state.token;
    }
    // console.log(config, "config");
    // showFullScreenLoading()
    return config;
  },
  error => {
    // Do something with request error
    console.log("请求拦截错误", error); // for debug
    // tryHideFullScreenLoading()
    return Promise.reject(error);
  }
);

// respone拦截器
axios.interceptors.response.use(
  response => {
    // tryHideFullScreenLoading()
    //console.log('服务器成功返回消息=>', response)
    var resData = response.data || {},
      code = resData.code;
    // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
    if (code == "SUCCESS") {
      return response;
    } else {
      Message({
        message: resData.message,
        showClose: true,
        type: "error",
        duration: 3600
      });

      return Promise.reject(response);
    }
    return response;
  },
  error => {
    // tryHideFullScreenLoading()
    let errMsg = "";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errMsg = "请求错误(400)";
          break;
        case 401:
          errMsg = "登录时间过长，请重新登录！";
          store.commit("LOG_OUT");
          router.replace({
            name: "login"
          });
          break;
        case 403:
          errMsg = "拒绝访问(403)";
          break;
        case 404:
          errMsg = "请求出错(404)";
          break;
        case 408:
          errMsg = "请求超时(408)";
          break;
        case 500:
          errMsg = "服务器错误(500)";
          break;
        case 501:
          errMsg = "服务未实现(501)";
          break;
        case 502:
          errMsg = "网络错误(502)";
          break;
        case 503:
          errMsg = "服务不可用(503)";
          break;
        case 504:
          errMsg = "网络超时(504)";
          break;
        case 505:
          errMsg = "HTTP版本不受支持(505)";
          break;
        default:
          errMsg = "服务器错误";
      }
    } else {
      errMsg = "服务器错误";
    }
    Message({
      message: errMsg,
      showClose: true,
      type: "error",
      duration: 3600
    });
    return Promise.reject(error.response);
  }
);

export default axios;
