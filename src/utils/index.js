//防抖
export function debounce(func, delay) {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
/*
 * 校验手机号
 * @params num {number}
 * */
export function testPhoneNumer(num) {
  const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  return reg.test(parseInt(num));
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
 * 校验证件号码
 * @params num {number}
 * */
export function checkIdCard(num) {
  num = num.toUpperCase();
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
    return false;
  }
  //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  //下面分别分析出生日期和校验位
  var len, re;
  len = num.length;
  if (len == 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    var arrSplit = num.match(re);

    //检查生日日期是否正确
    var dtmBirth = new Date(
      "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
    );
    var bGoodDay;
    bGoodDay =
      dtmBirth.getYear() == Number(arrSplit[2]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
      dtmBirth.getDate() == Number(arrSplit[4]);
    if (!bGoodDay) {
      return false;
    } else {
      //将15位身份证转成18位
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var arrInt = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      );
      var arrCh = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );
      var nTemp = 0,
        i;
      num = num.substr(0, 6) + "19" + num.substr(6, num.length - 6);
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }
      num += arrCh[nTemp % 11];
      return true;
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    var arrSplit = num.match(re);

    //检查生日日期是否正确
    var dtmBirth = new Date(
      arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
    );
    var bGoodDay;
    bGoodDay =
      dtmBirth.getFullYear() == Number(arrSplit[2]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
      dtmBirth.getDate() == Number(arrSplit[4]);
    if (!bGoodDay) {
      // alert(dtmBirth.getYear());
      //  alert(arrSplit[2]);
      return false;
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum;
      var arrInt = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      );
      var arrCh = new Array(
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      );
      var nTemp = 0,
        i;
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[nTemp % 11];
      if (valnum != num.substr(17, 1)) {
        return false;
      }
      return true;
    }
  }
  return false;
}
/*
 * 保留几位小数点函数
 * 因为指令保留操作有个问题就是循环出来的输入框没法同步更新数据
 * 所以就单独再弄了一个，跟指令的代码一样
 * @params num {number}
 * */
export function retainNumHandle(value, retainNum) {
  let val = value.replace(/[^\d^\.]+/g, ""); // 去除数字和小数点以外的
  let valArr = val.split(".");
  // let retainNum = 0; // 这个是保留几位
  if (!retainNum) {
    // 不传就是不保留
    // 这个是判断用户有没有限制几位小数
    retainNum = 0;
  } else {
    retainNum = Number(retainNum);
  }
  if (valArr.length > retainNum) {
    // 获取有多少小数点
    valArr.splice(2, valArr.length - retainNum); // 去除第一个小数点之后的所有
  }
  if (valArr[1]) {
    valArr[1] = valArr[1].substr(0, retainNum);
  }
  // 这里的2写死。因为不管保留几位小数，都只需要第一位小数点前后的数据，其他都不需要
  valArr.splice(2, valArr.length - 2);
  let valStr = valArr.join("."); // 最后的结果
  return valStr;
}
/*
 * 两个数相除
 * @params num {number}
 * */
export function division(arg1, arg2)
 {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = new String(arg1).split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  r1 = Number(new String(arg1).replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  //放大倍数后两个数相除 后，乘以两个小数位数长度相减后的10的次幂
  var money = Mul(r1 / r2, Math.pow(10, t2 - t1));
  //保留2个小数位数
  return money.toFixed(2);
}
/*
 * 两个数相乘
 * @params num {number}
 * */
export function Mul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  //获取两个相乘数据的小数点后面的数据的长度，即获取小数的位数，因为最终相乘计算的结果：结果小数的位数=第一个数的小数位数+第二个数的小数位数
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  //将两个小数去掉小数点，强制转换整个值（即进行数值放开小数点位数的倍数），然后进行相乘的操作，相乘的结果除去10的m次方
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
},
