/**
 * Created by zhangjianmin on 2017/7/4.
 */

/*
 * 数字
 * @params num {number}
 * */
function formatCount(num) {
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
function formatCurrency(num) {
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

function formatTime(date, type = "half") {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (type == "half") {
    return [year, month, day].map(formatNumber).join("-");
  } else if (type == "all") {
    return (
      [year, month, day].map(formatNumber).join("-") +
      " " +
      [hour, minute, second].map(formatNumber).join(":")
    );
  } else if (type == "string") {
    return (
      [year, month, day].map(formatNumber).join("") +
      "" +
      [hour, minute, second].map(formatNumber).join("")
    );
  }
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}

function getNowDay() {
  //获取当前 yy-MM-DD
  let nowTime = new Date(),
    nowDay = formatTime(nowTime);
  return nowDay;
}

function getTomorrowDay() {
  //获取下一天  yy-MM-DD
  let nowTime = new Date(),
    TomorrowDay = formatTime(new Date(new Date().getTime() + 3600 * 1000 * 24));
  return TomorrowDay;
}

function getNowTime() {
  //获取当前 yy-MM-DD HH:mm:ss
  let _now = new Date(),
    nowTime = formatTime(_now, "all");
  return nowTime;
}
function getNowTimeString() {
  //获取当前年月日时分秒 字符串集
  let _now = new Date(),
    nowTimeString = formatTime(_now, "string");
  return nowTimeString;
}

var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
function formatIdCard(val) {
  //格式化身份证号码
  let birthDate = "",
    sex = "";
  if (regIdNo.test(val)) {
    if (val.length > 17) {
      birthDate =
        val.substring(6, 10) +
        "-" +
        val.substring(10, 12) +
        "-" +
        val.substring(12, 14);
      if (parseInt(val.substr(16, 1)) % 2 == 1) {
        sex = "M";
      } else {
        sex = "F";
      }
    }
  }
  return { birthDate, sex };
}
function compareDate(date1, date2) {
  var oDate1 = new Date(date1);
  var oDate2 = new Date(date2);
  if (oDate1.getTime() > oDate2.getTime()) {
    return false;
  } else {
    return true;
  }
}
module.exports = {
  formatCount,
  formatCurrency,
  getTomorrowDay,
  compareDate,
  formatTime: formatTime,
  getNowDay: getNowDay,
  getNowTime: getNowTime,
  getNowTimeString: getNowTimeString,
  formatIdCard
};
