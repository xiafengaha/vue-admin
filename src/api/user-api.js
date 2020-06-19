// const userApi = {
//   getToken: {
//     method: "post",
//     url: "/session"
//   },
//   getUserInfo: {
//     method: "get",
//     url: "/user"
//   },
//   changePassWord: {
//     method: "post",
//     url: "/user/password/new"
//   },
//   getVerifyApi: {
//     method: "post",
//     url: "/anonymous/captcha"
//   }
// };
import request from "@/utils/request";
export function getToken(query) {
  // 登录
  return request({
    method: "post",
    url: "/session",
    data: query
  });
}
export function getUserInfo(query) {
  // 获取用户信息
  return request({
    method: "get",
    url: "/user",
    data: query
  });
}
export function changePassWord(query) {
  // 修改密码
  return request({
    method: "post",
    url: "/password/reset",
    data: query
  });
}
export function getVerifyApi(query) {
  // 获取验证码图片
  return request({
    method: "post",
    url: "/anonymous/captcha",
    params: query
  });
}
export function verifyCode(query) {
  // 验证码信息校验
  return request({
    method: "post",
    url: "/anonymous/verifyCode",
    data: query
  });
}
