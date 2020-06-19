<template>
  <div class="batch-add-dialog">
    <!-- 批量增加模态框 -->
    <el-dialog
      :before-close="closeBatchAddDialog"
      width="500px"
      custom-class="add-dialog"
      :title="dialogTitle"
      :visible.sync="dialogBatchAddVisible"
    >
      <el-form :model="batchAddForm">
        <el-form-item :class="{'is-error':isBatchAddFormError}">
          <el-input
            type="textarea"
            :rows="11"
            @change="changeBatchAddTextarea"
            id="a"
            :placeholder="batchAddDialogPlaceholder"
            v-model="batchAddForm.batchAddTexts"
          ></el-input>
          <div class="el-form-item__error" v-show="isBatchAddFormError">
            <i class="iconfont icon-exclamationcircle" style="margin-right: 2px;"></i>
            {{batchAddFormMsgError}}
          </div>
        </el-form-item>
      </el-form>
      <!-- :placeholder="batchAddDialogPlaceholder" -->
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          :loading="confirmButtonLoading"
          type="primary"
          @click="confirmBatchAdd"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 错误数据模态框 -->
    <el-dialog
      title="错误数据"
      width="744px"
      custom-class="wrong-table-dialog"
      :visible.sync="wrongDialogBatchAddVisible"
    >
      <div class="wrong-desc desc">
        <i class="icon el-icon-warning"></i>
        <span>数据错误，请根据错误提示进行修改后再次上传</span>
      </div>
      <el-table
        :data="wrongVerifyMessageVOList"
        height="386"
        :header-row-class-name="'table-header'"
        style="width: 100%"
      >
        <el-table-column
          v-if="!nameShow"
          prop="name"
          header-align="center"
          align="center"
          width="150"
          label="姓名"
        ></el-table-column>

        <el-table-column
          prop="certNo"
          header-align="center"
          align="center"
          width="280"
          label="证件号码"
        ></el-table-column>

        <el-table-column
          prop="reason"
          header-align="left"
          align="left"
          min-width="180"
          show-overflow-tooltip
          label="错误原因"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
// import policyServer from "api/policy-server";
var _utils = require("utils/format");
var _ID_CARD = "ID_CARD",
  _PASSPORT = "PASSPORT",
  errorMsg1 = "格式错误，请检查后重试",
  errorMsg2 = "该业务仅支持1~4类职业类型";
// errorMsg3 = "雇员列表中"
export default {
  data() {
    return {
      dialogBatchAddVisible: false, //批量增加模态框
      batchAddForm: {
        //批量增加输入 框
        batchAddTexts: ""
      },
      isBatchAddFormError: false, //批量增加输入框数据是否有错误（前端校验）
      batchAddFormMsgError: errorMsg1,
      confirmButtonLoading: false, //确定按钮loading
      wrongDialogBatchAddVisible: false, //错误数据模态框
      wrongVerifyMessageVOList: [], //批量增加错误数据
      nameShow: false
    };
  },
  props: {
    batchAddDialogPlaceholder: String,
    dialogTitle: {
      type: String,
      require: false,
      default: "批量新增"
    },
    batchType: {
      type: String,
      require: false,
      default: "add"
    },
    resultData: {
      // 雇员列表，删除时用的到
      type: Array,
      require: false,
      default: () => []
    }
  },
  methods: {
    confirmBatchAdd() {
      this.nameShow = false;
      //批量新增模态框 按钮确定方法
      console.log("打印输入框内容=>", this.batchAddForm);
      this.confirmButtonLoading = true; //点击按钮后 按钮loading
      this.isBatchAddFormError = false; //重置 isBatchAddFormError为false

      let batchAddTexts = this.batchAddForm.batchAddTexts,
        batchAddTextsArr,
        employeeVOList = [],
        trimReg = /^\s+|\s+$/g,
        sReg = /\s+/g,
        nReg = /\n+/g,
        splitStr = "^&^";

      if (!batchAddTexts) {
        //如没有输入值 则 return false
        this.confirmButtonLoading = false;
        return false;
      }

      batchAddTextsArr = batchAddTexts
        .replace(trimReg, "")
        .replace(nReg, "\n")
        .split("\n"); //对输入的字符串trim,再把中间的换行符替换成一个然后根据换行符分隔成数组
      batchAddTextsArr = batchAddTextsArr.map(item => {
        //再对batchAddTextsArr中对每项数据trim然后把中间的空格tab等替换成^&^
        return item.replace(trimReg, "").replace(sReg, splitStr);
      });
      console.log("batchAddTextsArr", batchAddTextsArr);
      let resultFilterArr = new Array();
      if (this.batchType === "del") {
        //
        batchAddTextsArr.forEach(item => {
          this.resultData.forEach(items => {
            if (item === items.certNo) {
              items.operateType = "MINUS";
              resultFilterArr.push(items);
            }
          });
        });
        employeeVOList = JSON.parse(JSON.stringify(resultFilterArr));
      } else {
        for (let i = 0, len = batchAddTextsArr.length; i < len; i++) {
          //根据 '^&^ 每行数据分隔成一个数组
          let itemArr = batchAddTextsArr[i].split(splitStr),
            itemObj,
            idCardObj;
          console.log(itemArr, "itemArr");

          if (itemArr.length != 3) {
            //如果分隔后的数组长度不是3则说明批增输入框错误
            this.isBatchAddFormError = true;
            this.batchAddFormMsgError = errorMsg1;
            break;
          }
          idCardObj = _utils.formatIdCard(itemArr[1]); //根据certNo解析生日 和性别
          if (!idCardObj.birthDate || !idCardObj.sex) {
            this.isBatchAddFormError = true;
            this.batchAddFormMsgError = errorMsg1;
            break;
          } else if (parseFloat(itemArr[2]) < 1 || parseInt(itemArr[2]) > 5) {
            this.isBatchAddFormError = true;
            this.batchAddFormMsgError = errorMsg2;
            break;
          }
          itemObj = {
            name: itemArr[0],
            certType: _ID_CARD,
            certNo: itemArr[1],
            birthDate: "",
            sex: "",
            jobTypeName: itemArr[2] + "类"
          };
          itemObj.birthDate = idCardObj.birthDate;
          itemObj.sex = idCardObj.sex;
          employeeVOList.push(itemObj); //把处理好的itemObj放进employeeVOList
        }

        if (this.isBatchAddFormError) {
          //如果解析有错 则return false
          this.confirmButtonLoading = false;
          return false;
        }
      }
      if (employeeVOList.length === 0) {
        this.isBatchAddFormError = false;
        let newArr = batchAddTextsArr.map(item => {
          return (item = {
            reason: "证件号码格式不正确/雇员信息不存在",
            certNo: item
          });
        });
        this.nameShow = true;
        this.wrongDialogBatchAddVisible = true;
        this.dialogBatchAddVisible = false;
        this.confirmButtonLoading = false;
        this.wrongVerifyMessageVOList = JSON.parse(JSON.stringify(newArr));
        // this.batchAddFormMsgError = errorMsg1;
        return false;
      }
      this.verifyApi(employeeVOList, "child");

      // console.log()
    },
    verifyApi(list, type) {
      let api = policyServer.postVerifyEndorse(this.$route.query.policyNo);
      this.$axios({
        //
        url: api.url,
        method: api.method,
        data: list
      })
        .then(res => {
          console.log("验证批量增加返回的数据=>", res);
          let resData = res.data.data;
          if (!resData) {
            //如果没错误则向tableDta 增加此数据
            // console.log("验证没有错误", employeeVOList);
            if (!type) {
              // 没有type就是父节点
              this.$emit("verifySuccess");
            } else {
              this.$emit("batchAddTable", list);
            }
            this.dialogBatchAddVisible = false; //模态框隐藏
            this.batchAddForm.batchAddTexts = ""; //模态框中输入框清空
          } else {
            //否则有错误
            console.log("验证有错误");
            this.wrongDialogBatchAddVisible = true;
            this.wrongVerifyMessageVOList = resData;
          }
          this.confirmButtonLoading = false;
        })
        .catch(err => {
          this.confirmButtonLoading = false;
        });
    },
    showDialogBatchAdd() {
      //显示批量新增模态框
      this.dialogBatchAddVisible = true;
    },
    changeBatchAddTextarea(val) {
      //输入框改变时
      this.isBatchAddFormError = false; //报错重置
    },
    closeBatchAddDialog(done) {
      //关闭批量增加模态时的回调
      this.batchAddForm.batchAddTexts = ""; //模态框中输入框清空
      this.isBatchAddFormError = false; //报错重置
      done();
    }
  }
};
</script>

<style lang="scss">
@import "~styles/variable.scss";
.batch-add-dialog {
  // 批增模态框
  .add-dialog {
    .el-dialog__header {
      padding: 24px 23px 16px 32px;
      .el-dialog__title {
        font-size: 14px;
      }
    }
    .el-dialog__body {
      padding: 0 23px;
      .el-textarea__inner {
        background-color: #f7f7f7;
      }
    }
    .el-dialog__footer {
      padding: 0px 24px 17px;
      text-align: center;
      .el-button {
        width: 88px;
      }
    }
  }
  // 错误数据模态框
  .wrong-table-dialog {
    padding: 24px;
    .el-dialog__header {
      padding: 0;
      margin-bottom: 24px;
      .el-dialog__title {
        font-size: 24px;
        color: $textColor;
      }
      .el-dialog__headerbtn {
        top: 29px;
        right: 27px;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
    .wrong-desc {
      position: absolute;
      top: 25px;
      right: 70px;
      .icon {
        font-size: 18px;
        margin-right: 4px;
        color: $themColor;
      }
    }
  }
}
</style>
