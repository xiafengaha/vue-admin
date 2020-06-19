<template>
  <!-- 此为表格组件 -->
  <div class="table staff-table">
    <el-table
      v-loading="loadingTable"
      element-loading-text="拼命加载中..."
      :data="tableData"
      style="width: 100%"
      :header-row-class-name="'table-header'"
    >
      <el-table-column
        type="index"
        label="序号"
        header-align="center"
        align="center"
        width="50"
        fixed
      ></el-table-column>
      <el-table-column
        prop="name"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center"
        width="100"
        label="姓名"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.diyInput">
            <el-input
              class="text-input"
              :maxlength="32"
              ref="name"
              v-model="tableformData.name"
              @change="changeInput"
              placeholder="姓名"
            ></el-input>
            <div class="err-tips" v-show="codeObj['202022'].code">
              <i class="arrow-bottom"></i>
              {{codeObj['202022'].reason}}
            </div>
          </div>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="certTypeName"
        header-align="center"
        align="center"
        width="100"
        label="证件类型"
      >
        <template slot-scope="scope">
          <!-- v-model="tableformData.certType" -->
          <!-- ref="certType" -->
          <!-- @change="changeInput" -->
          <div v-if="scope.row.diyInput">
            <el-select
              v-model="tableformData.certType"
              ref="certType"
              @change="changeInput"
              placeholder="证件类型"
            >
              <el-option
                v-for="item in certTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div class="err-tips" v-show="codeObj['202002'].code">
              <i class="arrow-bottom"></i>
              {{codeObj['202002'].reason}}
            </div>
          </div>

          <span
            v-else
          >{{scope.row.certTypeName ? scope.row.certTypeName : (scope.row.certType === 'ID_CARD' ? '身份证' : '护照')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="certNo" header-align="center" align="center" width="180" label="证件号码">
        <template slot-scope="scope">
          <div v-if="scope.row.diyInput">
            <el-input
              class="cert-no text-input"
              :maxlength="18"
              ref="certNo"
              v-model="tableformData.certNo"
              @change="changeCertNo(tableformData.certNo, 'form')"
              placeholder="证件号码"
            ></el-input>
            <div
              class="err-tips"
              v-show="codeObj['202023'].code ||
                codeObj['202030'].code ||
                codeObj['202029'].code ||
                codeObj['202016'].code ||
                codeObj['202015'].code ||
                codeObj['202038'].code ||
                codeObj['202039'].code"
            >
              <i class="arrow-bottom"></i>
              {{
              codeObj['202023'].reason ||
              codeObj['202030'].reason ||
              codeObj['202029'].reason ||
              codeObj['202016'].reason ||
              codeObj['202015'].reason ||
              codeObj['202038'].reason ||
              codeObj['202039'].reason
              }}
            </div>
          </div>
          <span v-else>{{scope.row.certNo}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="birthDate"
        header-align="center"
        align="center"
        width="160"
        label="出生日期"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.diyInput">
            <el-date-picker
              ref="birthDate"
              v-model="tableformData.birthDate"
              @change="changeInput"
              type="date"
              :default-value="dateDefaultValue"
              value-format="yyyy-MM-dd"
              placeholder="出生日期"
            ></el-date-picker>
            <div class="err-tips" v-show="codeObj['202031'].code">
              <i class="arrow-bottom"></i>
              {{ codeObj['202031'].reason}}
            </div>
          </div>
          <span v-else>{{scope.row.birthDate}}</span>
        </template>
      </el-table-column>

      <el-table-column header-align="center" align="center" width="100" label="性别">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.diyInput"
            ref="sex"
            v-model="tableformData.sex"
            @change="changeInput"
            placeholder="性别"
          >
            <el-option
              v-for="item in sexArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>{{scope.row.sex == 'F' ? '女': '男'}}</span>
        </template>
      </el-table-column>
      <!-- NOTICE:增加工种字段,需要修改 -->
      <el-table-column
        header-align="center"
        :show-overflow-tooltip="true"
        align="center"
        width="240"
        label="工种"
        prop="occTypeName"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.diyInput">
            <el-cascader
              @change="changeTypes(tableformData.occTypeCode, 'form')"
              placeholder="工种"
              :props="defaultParams"
              :options="jobCodes"
              :clearable="true"
              :show-all-levels="false"
              ref="jobTypes"
              v-model="tableformData.occTypeCode"
            ></el-cascader>
          </div>
          <span v-else>{{scope.row.occTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="jobTypeName"
        header-align="center"
        align="center"
        width="110"
        label="职业类别"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.diyInput">
            <el-input
              ref="jobTypeName"
              v-model.trim="tableformData.jobTypeName"
              placeholder="职业类别"
              @change="changeInput"
            ></el-input>
            <div class="err-tips" v-show="codeObj['202025'].code">
              <i class="arrow-bottom"></i>
              {{codeObj['202025'].reason}}
            </div>
          </div>
          <span v-else>{{scope.row.jobTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="staffInfo"
        header-align="center"
        align="center"
        width="100"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            @click="updateOrSubmit(scope.row, scope.row.diyInput, scope.$index)"
            type="text"
            size="small"
          >{{scope.row.diyInput ? '提交' : '修改'}}</el-button>
          <el-button @click="delRow(scope.row, scope.$index)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改雇员信息"
      append-to-body
      :visible.sync="dialogVisible"
      width="640px"
      :before-close="handleClose"
      :modal-append-to-body="true"
    >
      <div>
        <el-form :model="updateForm" :rules="rulesForm" ref="updateForm" label-width="88px">
          <el-form-item label="姓名：">
            <el-input v-model="updateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="证件类型：">
            <el-select
              v-model="updateForm.certType"
              ref="certType"
              @change="changeInput"
              placeholder="证件类型"
            >
              <el-option
                v-for="item in certTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码：">
            <el-input
              class="cert-no text-input"
              :maxlength="18"
              v-model="updateForm.certNo"
              @change="changeCertNo(updateForm.certNo, 'dialogForm')"
              placeholder="证件号码"
            ></el-input>
            <div
              class="err-tips"
              v-show="codeObj['202023'].code ||
                codeObj['202030'].code ||
                codeObj['202029'].code ||
                codeObj['202016'].code ||
                codeObj['202015'].code ||
                codeObj['202038'].code ||
                codeObj['202039'].code"
            >
              <i class="arrow-bottom"></i>
              {{
              codeObj['202023'].reason ||
              codeObj['202030'].reason ||
              codeObj['202029'].reason ||
              codeObj['202016'].reason ||
              codeObj['202015'].reason ||
              codeObj['202038'].reason ||
              codeObj['202039'].reason
              }}
            </div>
          </el-form-item>
          <el-form-item label="出生日期：">
            <el-date-picker
              ref="birthDate"
              v-model="updateForm.birthDate"
              @change="changeInput"
              type="date"
              :default-value="dateDefaultValue"
              value-format="yyyy-MM-dd"
              placeholder="出生日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="性别：">
            <el-select ref="sex" v-model="updateForm.sex" @change="changeInput" placeholder="性别">
              <el-option
                v-for="item in sexArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工种：">
            <el-cascader
              @change="changeTypes(updateForm.occType, 'dialogForm')"
              placeholder="工种"
              :props="defaultParams"
              :options="jobCodes"
              :clearable="true"
              :show-all-levels="false"
              v-model="updateForm.occType"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="职业类别：">{{updateForm.jobTypeName}}</el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUpdateData">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import policyServer from "api/policy-server";
import { getSession } from "utils/json-parse";
import "./index.scss";
var _utils = require("utils/format");
const objectAssign = require("object-assign");
var _ID_CARD = "ID_CARD",
  _PASSPORT = "PASSPORT",
  _M = "M",
  _F = "F",
  _U = "U",
  _ONE = "1类",
  _TWO = "2类",
  _TREE = "3类",
  _FOUR = "4类",
  _FIVE = "5类";
export default {
  name: "",
  props: {
    tableData: Array,
    loadingTable: Boolean,
    staffInfo: {
      require: false,
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      rulesForm: {},
      updateForm: {
        name: "",
        certType: _ID_CARD,
        certNo: "",
        birthDate: "",
        sex: "",
        jobTypeName: "",
        occTypeCode: [],
        occTypeName: ""
      },
      query: {},
      verifyLoading: false,
      dateDefaultValue: new Date(
        new Date().getTime() - 3600 * 1000 * 24 * 365 * 18
      ),
      defaultParams: {
        label: "name",
        value: "number",
        children: "children"
      },
      formVerifyMessageVOList: [],
      tableformData: {
        name: "",
        certType: _ID_CARD,
        certNo: "",
        birthDate: "",
        sex: "",
        jobTypeName: "",
        occTypeCode: [],
        occTypeName: ""
      },
      errorObj: {
        "202002": {
          reason: "不支持该证件类型!",
          code: "202002"
        },
        "202023": {
          reason: "雇员证件号码为空",
          code: "202023"
        },
        "202022": {
          reason: "雇员姓名为空",
          code: "202022"
        },
        "202025": {
          reason: "工种代码为空",
          code: "202025"
        },
        "202031": {
          reason: "雇员出生年月不为空",
          code: "202031"
        },
        "202030": {
          reason: "雇员年龄需小于等于65岁",
          code: "202030"
        },
        "202029": {
          reason: "雇员年龄需大于等于16岁",
          code: "202029"
        },
        "202016": {
          reason: "请求雇员重复",
          code: "202016"
        },
        "202015": {
          reason: "雇员已投保",
          code: "202015"
        },
        "202038": {
          reason: "请求雇员附加列表已存在",
          code: "202038"
        },
        "202039": {
          reason: "无效身份证号码",
          code: "202039"
        }
      },

      certTypeArr: [
        {
          value: _ID_CARD,
          label: "身份证"
        },
        {
          value: _PASSPORT,
          label: "护照"
        }
      ],
      sexArr: [
        {
          value: _M,
          label: "男"
        },
        {
          value: _F,
          label: "女"
        }
      ],
      jobTypeArr: [
        {
          value: _ONE,
          label: "1类"
        },
        {
          value: _TWO,
          label: "2类"
        },
        {
          value: _TREE,
          label: "3类"
        },
        {
          value: _FOUR,
          label: "4类"
        },
        {
          value: _FIVE,
          label: "5类"
        }
      ],
      typeNumber: "",
      tableList: {
        pageNum: 1,
        pageSize: 10
      },
      rowIndex: 0, // 表格下标
      sessionData: {} // session参数
    };
  },

  components: {},

  computed: {
    codeObj() {
      //把后端返回的错误数组格式化为一个code对象
      let obj = {};
      if (!!this.formVerifyMessageVOList.length) {
        this.formVerifyMessageVOList.forEach((item, index) => {
          for (let key in this.errorObj) {
            if (item.code && item.code == key) {
              obj[key] = item;
            } else {
              obj[key] = {};
            }
          }
        });
      } else {
        for (let key in this.errorObj) {
          obj[key] = {};
        }
      }
      return obj;
    }
  },

  beforeMount() {},

  mounted() {},
  created() {
    this.query = this.$route.query;
    this.jobCodes = this.getSession("jobCodes");
    this.sessionData = sessionStorage.getItem("policyType");
  },
  methods: {
    // initTableList() {
    //   // 请求列表数据
    //   this.$axios({
    //     url: policyServer.getStaffInfo(this.policyNo).url,
    //     method: policyServer.getStaffInfo(this.policyNo).method,
    //     data: this.tableList
    //   }).then(res => {
    //     console.log(res, 'res')
    //   });
    // },
    getSession,
    saveUpdateData() {
      // 保存修改的数据
      // this.pushTableData(this.updateForm, "MINUS");

      // if (this.sessionData) {
      //   // 有就不需要请求API
      // } else {
      // }
      this.pushTableData(this.updateForm, "UPDATE");

      // this.tableData.splice(0, 1, _tableformData);
    },
    changeInput(val) {
      //输入框值改变时
      if (!!this.formVerifyMessageVOList.length)
        this.formVerifyMessageVOList = [];
      // if (!this.isTableformFinshed) return false;
      //   this.pushTableData();
    },
    childVerifyData() {
      this.pushTableData(this.tableData, "PLUS", "PARENT");
    },
    childDelVerify() {
      this.pushTableData(this.tableData, "MINUS", "PARENT");
    },
    pushTableData(data, operateType, parent) {
      //表单向表格里增加 所加人的数据 operateType为区分增还是减
      let api = policyServer.postVerifyEndorse(this.query.policyNo);
      delete data.diyInput;
      let newObj = JSON.parse(JSON.stringify(data));
      let _tableformData;
      if (Array.isArray(newObj)) {
        // 是不是数组
        _tableformData = newObj.map(item => {
          (item.occTypeCode = newObj.typeCode),
            (item.operateType = operateType);
          return item;
        });
      } else {
        newObj.occTypeCode = newObj.typeCode;
        _tableformData = objectAssign({}, newObj);
        _tableformData.operateType = operateType;
      }

      this.verifyLoading = true; //如果不传参数 说明是在表单里输入的 传了说明是在模态里粘贴的
      return this.$axios({
        //请求0337校验数据接口
        url: api.url,
        method: api.method,
        data: Array.isArray(_tableformData) ? _tableformData : [_tableformData]
      })
        .then(res => {
          let resData = res.data.data;
          this.verifyLoading = false;
          if (!resData) {
            //如果没错误
            this.formVerifyMessageVOList = [];
            // this.canAdd = true // 是否可以新增
            this.$emit("canAdd", true);
            console.log(this.sessionData, "this.sessionData");
            if (this.sessionData) {
              // 有policyType说明是批单
              // 不需要调接口自己缓存数据
              if (operateType === "UPDATE") {
                // 修改
                this.$message.success("修改成功！");
                this.dialogVisible = false;
                this.tableData.splice(this.rowIndex, 1, this.updateForm);
              } else {
                if (parent) {
                  // 有这个说明是父页面调用
                  this.$emit("verifySuccess");
                } else {
                  this.$message.success("新增成功! ");
                  // this.$emit('submitData', _tableformData)
                  console.log(this.tableData, "table");
                  this.tableData.splice(0, 1, _tableformData);
                }
              }
            } else {
              // 这里是保单状态
              this.addStaff(_tableformData);
            }
            // this.initTableList();

            this.clearTableFormData();
          } else {
            //   this.canAdd = false // 是否可以新增
            let reason = resData[0].reason;
            this.$message({
              type: "warning",
              message: resData[0].reason
            });
            //否则有错误 则第一个出错的框聚焦
            this.formVerifyMessageVOList = resData || [];
            let refName = this.getRefName(this.firstErrCode);
            if (!refName) {
              return false;
            }
            this.$refs[refName].focus();
          }
          return res;
        })
        .catch(err => {
          this.verifyLoading = false;
          return Promise.reject(err);
        });
    },
    delTableData() {
      // 这个是给父组件请求保存雇员失败，删除已显示的数据
      this.tableData.splice(0, 1);
    },
    getRefName(code) {
      //获取ref输入框的ref值
      if (code == "202022") {
        return "name";
      } else if (code == "202002") {
        return "certType";
      } else if (code == "202031") {
        return "birthDate";
      } else if (code == "202025") {
        return "jobTypeName";
      } else if (
        code == "202023" ||
        code == "202030" ||
        code == "202029" ||
        code == "202016" ||
        code == "202015" ||
        code == "202038" ||
        code == "202039"
      ) {
        return "certNo";
      } else {
        return "";
      }
    },
    changeCertNo(val, type) {
      //身份证输入框输入时  如是身份证 则根据身份号 自动改变生日 和性别
      let data =
        type === "form"
          ? JSON.parse(JSON.stringify(this.tableformData))
          : JSON.parse(JSON.stringify(this.updateForm));
      if (data.certType == _ID_CARD) {
        let idCardObj = _utils.formatIdCard(val);
        if (idCardObj.birthDate && idCardObj.sex) {
          data.birthDate = idCardObj.birthDate;
          data.sex = idCardObj.sex;
        } else {
          data.birthDate = "";
          data.sex = "";
        }
      }
      if (!!this.formVerifyMessageVOList.length) {
        this.formVerifyMessageVOList = [];
      }
      if (type === "form") {
        this.tableformData = JSON.parse(JSON.stringify(data));
      } else {
        this.updateForm = JSON.parse(JSON.stringify(data));
      }

      // if (!this.isTableformFinshed) return false;

      //   this.pushTableData();
    },
    addStaff(data) {
      this.$axios({
        url: policyServer.addStaffInfo(this.query.policyNo).url,
        method: policyServer.addStaffInfo(this.query.policyNo).method,
        data: [data]
      })
        .then(res => {
          if (data.operateType === "UPDATE") {
            // 修改
            this.$message.success("修改成功! ");
            this.dialogVisible = false;
          } else {
            // 新增
            this.$message.success("新增成功! ");
          }

          this.$emit("initData");
        })
        .catch(err => {
          // console.log(this.$refs['staffTable'])
          this.delTableData();
          // this.$refs['staffTable'].delTableData();
        });
    },
    // 修改大中小类类别 NOTICE:blur:可能获取的typeCode即occCode有问题
    changeTypes(val, type) {
      console.log(val, "type");
      console.log(this.updateForm, "update");

      let firstVal = val[0];
      let secondVal = val[1];
      let thirdVal = val[2];
      let len = this.jobCodes.length;
      let jobCodes = this.jobCodes;
      console.log(jobCodes, "jobCodes");
      for (let i = 0; i < len; i++) {
        if (jobCodes[i].number === firstVal) {
          let firstChildren = jobCodes[i].children;
          for (let k = 0; k < firstChildren.length; k++) {
            if (firstChildren[k].number === secondVal) {
              let secondChildren = firstChildren[k].children;
              for (let j = 0; j < secondChildren.length; j++) {
                if (secondChildren[j].number === thirdVal) {
                  this.targetName = secondChildren[j].name;
                  // occTypeCode
                  if (type === "form") {
                    this.tableformData.occTypeName = this.targetName;
                    this.tableformData.jobTypeName =
                      secondChildren[j].chinalifeCategory + "类";
                    this.tableformData.typeCode = secondChildren[j].typeCode; // OCCtype code
                  } else {
                    this.updateForm.occTypeName = this.targetName;
                    this.updateForm.jobTypeName =
                      secondChildren[j].chinalifeCategory + "类";
                    this.updateForm.typeCode = secondChildren[j].typeCode;
                  }

                  // this.tableformData
                }
              }
            }
          }
        }
      }
      // for (let i = 0; i < len; i++) {
      //   if(this.jobCodes[i].number === val[0]){
      //   this.targetVal =this.jobCodes[i].typeCode;
      //   this.tableformData.occTypeCode = this.targetVal;
      //   }
      // }
      // this.getJobType(this.targetVal)
      //   this.pushTableData();
    },
    workEcho(data, val) {
      // 工种回显
      console.log(data, val);
      let typeNumber = "";
      // if (!!this.typeNumber) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length > 0) {
          return this.workEcho(data[i].children, val);
        } else {
          if (data[i].typeCode === val) {
            typeNumber = data[i].number;
            break;
          }
        }
      }
      console.log(typeNumber, "typeNumber");
      return typeNumber;
    },
    clearTableFormData() {
      //清除表格表单数据
      this.tableformData = {
        name: "",
        certType: _ID_CARD,
        certNo: "",
        birthDate: "",
        sex: "",
        jobTypeName: "",
        occTypeCode: [],
        occTypeName: ""
      };
      if (!!this.formVerifyMessageVOList.length)
        this.formVerifyMessageVOList = [];
    },
    judgeForm(data) {
      // 判断数据是否存在空
      //表单中的框是否都填了 如果有一个框没填  就会返回false  否则返回true
      let isTableformFinshed = true,
        _tableformData = data;
      // for (let key in _tableformData) {
      //   if (!_tableformData[key] && key !== "operateType" && key !== "id") {
      //     isTableformFinshed = false;
      //   }
      // }
      // switch(_tableformData) {
      //   case _tableformData.name
      // }
      if (!_tableformData.name) {
        isTableformFinshed = false;
      } else if (!_tableformData.certType) {
        isTableformFinshed = false;
      } else if (!_tableformData.certNo) {
        isTableformFinshed = false;
      } else if (!_tableformData.birthDate) {
        isTableformFinshed = false;
      } else if (!_tableformData.sex) {
        isTableformFinshed = false;
      } else if (!_tableformData.occTypeCode) {
        isTableformFinshed = false;
      } else if (!_tableformData.occTypeName) {
        isTableformFinshed = false;
      } else if (!_tableformData.jobTypeName) {
        isTableformFinshed = false;
      }
      for (let key in _tableformData) {
        if (key === "occTypeCode") {
          if (_tableformData[key].length <= 0 || !_tableformData[key]) {
            isTableformFinshed = false;
          }
        }
      }
      return isTableformFinshed;
    },
    updateOrSubmit(rows, type, index) {
      this.rowIndex = index; // 点了第几个row
      let row = {};
      if (type) {
        row = JSON.parse(JSON.stringify(this.tableformData));
        row.diyInput = rows.diyInput;
      } else {
        row = JSON.parse(JSON.stringify(rows));
      }
      if (this.judgeForm(row)) {
        // 不为空
        if (row.diyInput) {
          // 为真就是需要它提交的
          this.pushTableData(row, "PLUS");
        } else {
          // console.log(index, "indexupdate");
          this.dialogVisible = true;
          this.updateForm = JSON.parse(JSON.stringify(row));
          let typeNumber = this.workEcho(
            this.jobCodes,
            this.updateForm.occTypeCode
          );
          this.updateForm.occType = [
            typeNumber.slice(0, 2),
            typeNumber.slice(0, 4),
            typeNumber
          ];

          // 点了修改
        }
      } else {
        this.$message.warning("请填写完要提交的雇员信息！");
        return false;
      }
    },
    checkRepeat(arr) {
      // 校验重复
      // data.
      var obj = {};
      arr = arr.reduce(function(item, next) {
        obj[next.key] ? "" : (obj[next.key] = true && item.push(next));
        return item;
      }, []);
      return arr;
    },
    delRow(row, index) {
      // 移除
      let sessionTable = sessionStorage.getItem(this.query.policyNo);
      let sessionTableData = sessionTable ? JSON.parse(sessionTable) : [];
      let that = this;
      this.$confirm("是否删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (that.sessionData) {
            that.$message.success("移除成功!");
            for (let i = 0; i < sessionTableData.length; i++) {
              if (sessionTableData[i].certNo === row.certNo) {
                sessionTableData.splice(i, 1);
                break;
              }
            }
            sessionStorage.setItem(
              this.query.policyNo,
              JSON.parse(JSON.stringify(sessionTableData))
            );
            that.tableData.splice(index, 1);
            that.$emit("canAdd", true);
          } else {
            console.log(row, "row");
            if (row.id) {
              that.delApi(row);
            } else {
              that.$message.success("移除成功!");
              for (let i = 0; i < sessionTableData.length; i++) {
                if (sessionTableData[i].certNo === row.certNo) {
                  sessionTableData.splice(i, 1);
                  break;
                }
              }
              sessionStorage.setItem(
                this.query.policyNo,
                JSON.parse(JSON.stringify(sessionTableData))
              );
              that.tableData.splice(index, 1);
              that.$emit("canAdd", true);
            }
          }

          // that.delApi(row)
        })
        .catch(() => {});
    },
    delApi(data) {
      // delStaffInfo
      this.$axios({
        url: policyServer.delStaffInfo(
          this.query.policyNo,
          data.name,
          data.certType,
          data.certNo
        ).url,
        method: policyServer.delStaffInfo(
          this.query.policyNo,
          data.name,
          data.certType,
          data.certNo
        ).method
      })
        .then(res => {
          this.$message.success("删除成功!");
          this.$emit("initData");
          this.$emit("canAdd", true);
        })
        .catch(err => {
          console.log(err, "err");
        });
    },
    handleClose() {
      this.dialogVisible = false;
    }
  },

  watch: {}
};
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
