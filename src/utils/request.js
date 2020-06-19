import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "@/store";
import router from "../router/index";
import host from "@/api/hosts.js";
const env = process.env.NODE_ENV;
// import { showFullScreenLoading, tryHideFullScreenLoading } from './loading'
// create an axios instance
const service = axios.create({
  // baseURL: 'http://mch.dtest.com', // api 的 base_url
  timeout: 50000 // request timeout
  // withCredentials: true
});
let uploadMessageShow = true; //上传功能是否需要message,
let success = true; // 下载是否直接通过
// request interceptor
service.interceptors.request.use(
  config => {
    // header["Authorization"] = token;
    // Do something before request is sent
    if (store.state.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers["Authorization"] = store.state.token;
    }
    console.log(config, "config");
    if (
      [
        "http://bucket-oss-test.oss-cn-shanghai.aliyuncs.com",
        "https://oss.wellprotectedlove.com",
        "/anonymous/captcha"
      ].includes(config.url)
    ) {
      uploadMessageShow = false;
    } else {
      uploadMessageShow = true;
    }
    let newUrl = config.url.split("?");
    if (newUrl[0] === "/order/list/mailing/download") {
      success = false;
    } else {
      success = true;
    }

    // showFullScreenLoading() // load显示事件
    return config;
  },
  error => {
    // Do something with request error
    // tryHideFullScreenLoading()
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data;
    // tryHideFullScreenLoading()
    if (!uploadMessageShow) {
      return response.data;
    } else if (!success) {
      return response.data;
    } else {
      if (res.code !== "SUCCESS") {
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        // if (res.code === "27800001") {
        //   console.log(response, 'response')
        //   let that = this;
        //   MessageBox.confirm(
        //     "你已被登出，可以取消继续留在该页面，或者重新登录",
        //     "确定登出",
        //     {
        //       confirmButtonText: "重新登录",
        //       cancelButtonText: "取消",
        //       type: "warning"
        //     }
        //   ).then(() => {
        //     // ...mapMutations({
        //     //   log_out:'LOG_OUT'
        //     // }),
        //     router.replace({
        //       name: "login"
        //     });
        //   });
        // } else {
        // }
        if (res.code === "27800001") {
          router.replace({
            name: "login"
          });
        }
        if (res.message) {
          Message({
            message: res.message,
            type: "error",
            duration: 5 * 1000
          });
        }

        return Promise.reject("error");
      } else {
        return response.data;
      }
    }
  },
  error => {
    // tryHideFullScreenLoading()
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
    // if (error.config.url === '/auth/logout') {
    //   sessionStorage.clear()
    //   Message({
    //     message: '退出成功!',
    //     type: 'success',
    //     duration: 5 * 1000
    //   })
    // } else {

    // }
  }
);

export default service;
