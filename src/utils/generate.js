import policyStatusJSON from "common/json/policy-status.json";

/*
 * 把json转成对象
 * */
function transformArray(array) {
  let object = {};
  array.map(item => {
    object[item.value] = item.label;
  });
  return object;
}
/*
 * 路由对应码
 * */
const route = {
  underwriting: "待核保",
  refund: "待退费",
  "policy-details": "保单详情",
  insurance: "投保单详情",
  "employer-policy": "雇主责任险"
};

export function generateTitle(title) {
  return route[title];
}

/*
 * 投保类型
 * */
const type = {
  NEW: "新投",
  CONTINUED: "续保",
  PLUS: "批增",
  MINUS: "批减",
  SURRENDER: "退保"
};

export function generateType(code) {
  return type[code];
}

/*
 * 待操作保单状态
 * */

const status = {
  INIT: "待核保",
  ERROR: "出单失败",
  PROCESSING: "出单中",
  DONE: "已完成"
};
export function generateStatus(code) {
  return status[code];
}

/*
 * 保单状态
 * */

const policyStatus = transformArray(policyStatusJSON);
export function generatePolicyStatus(code) {
  return policyStatus[code];
}

/*
 * 行业类别
 * */

const industry = {
  BUZ_NAT_0877: "教育",
  BUZ_NAT_0727: "餐饮业",
  BUZ_NAT_0718: "零售业",
  BUZ_NAT_0831: "服务业",
  BUZ_NAT_0944: "其他"
};

export function generateIndustry(code) {
  return industry[code];
}

/*
 * 行业类别
 * */

const sex = {
  M: "男",
  F: "女"
};

export function generateSex(code) {
  return sex[code];
}
/*
 * 证件类型
 * */

const papers = {
  SOCIAL_CODE: "统一社会信用代码证",
  ORG_CODE: "组织机构代码证",
  ID_CARD: "身份证",
  RESIDENCE_BOOKLET: "户口簿",
  OFFICER_ID_CARD: "军官证/警官证",
  DRIVING_LICENSE: "驾照",
  BACK_HOME_CARD: "返乡证",
  SOLDIER_ID_CARD: "士兵证",
  PERMANENT_RESIDENCE_PERMIT: "永久居住证",
  VIR_ORG_CODE: "虚拟组织机构代码证",
  TAIWAN_PASS: "台湾通行证",
  HK_MACAO_PASS: "港澳通行证",
  PASSPORT: "护照",
  OTHERS: "其他"
};

export function generatePapers(code) {
  return papers[code];
}

/*
 * 保障期限
 * */
const TimeLimit = {
  YEAR: "年",
  MONTH: "个月",
  DAY: "天"
};
export function generateTimeLimit(insuPeriod, insuPeriodUnit) {
  return insuPeriod + TimeLimit[insuPeriodUnit];
}

/*
 * 数字
 * @params num {number}
 * */
export function formatCount(num) {
  if (!num) {
    return 0;
  }
  var t = parseInt(num),
    i,
    r;
  for (
    t = t.toString().replace(/^(\d*)$/, "$1."),
      t = (t + "00").replace(/(\d*\.\d\d)\d*/, "$1"),
      t = t.replace(".", ","),
      i = /(\d)(\d{3},)/;
    i.test(t);

  )
    t = t.replace(i, "$1,$2");
  return (
    (t = t.replace(/,(\d\d)$/, ".$1")),
    (r = t.split(".")),
    r[1] == "00" && (t = r[0]),
    t
  );
}

/*
 * 金额货币化
 * @params num {number}
 * */
export function formatCurrency(num) {
  if (!num) {
    return "0.00"; //金额空时使用标准'0.00'
  }
  num = num.toString().replace(/\$|\,/g, "");
  if (isNaN(num)) num = "0";
  let sign = num == (num = Math.abs(num));
  num = Math.floor(num * 100 + 0.50000000001);
  let cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      "," +
      num.substring(num.length - (4 * i + 3));
  return (sign ? "" : "-") + num + "." + cents;
}

/*
 * 订单状态
 * */

const orderStatus = {
  WAIT_CONFIRM: "待确认",
  NOT_SHIPPED: "未发货",
  WAIT_RECEIPT: "待收货",
  CANCEL_ORDER: "已取消",
  FINISH: "已完成"
};

export function getOrderStatus(code) {
  return orderStatus[code];
}
