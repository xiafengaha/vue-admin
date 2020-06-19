import request from "@/utils/request";

export function getOssToken(query) {
  // 获取osstoken
  return request({
    method: "get",
    url: "/oss/token/attachment",
    params: query
  });
}
export function uploadAli(url, query) {
  // 文件上传
  return request({
    method: "post",
    url: url,
    data: query
  });
}
