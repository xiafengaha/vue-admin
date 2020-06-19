<template>
  <!-- 加人页子组件 -->
  <div class="add-table">
    <!--头部-->
    <div class="add-header">
      <ul>
        <li class="dib add-header-item common-width-140">姓名</li>
        <li class="dib add-header-item common-width-140">证件类型</li>
        <li class="dib add-header-item common-width-240">证件号码</li>
        <li class="dib add-header-item common-width-160">出生日期</li>
        <li class="dib add-header-item common-width-160">性别</li>
        <li class="dib add-header-item common-width-160">工种</li>
        <li class="dib add-header-item common-width-140">职业类别</li>
        <li class="dib add-header-item common-width-128">操作</li>
      </ul>
    </div>
    <!--body-->
    <div class="add-body" v-loading="loadingTable">
      <!--列表-->
      <div class="add-list-content" v-for="(item, index) in tableData" :key="index">
        <!--显示信息 isEditor == false-->
        <ul>
          <!-- 姓名 -->
          <li class="list-item-dib common-width-140">
            <!--            {{item.name}}-->
            <!--            <span>{{item.name}}</span>-->
            <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
              <span>{{item.name}}</span>
            </el-tooltip>
          </li>
          <!-- 证件类型 -->
          <li class="list-item-dib common-width-140">{{formatArrText(certTypeArr, item.certType)}}</li>
          <!-- 证件号码-->
          <li class="list-item-dib common-width-240">{{item.certNo}}</li>
          <!-- 出生日期 -->
          <li class="list-item-dib common-width-160">{{item.birthDate}}</li>
          <!--性别  -->
          <li class="list-item-dib common-width-160">{{formatArrText(sexArr, item.sex)}}</li>

          <!-- 工种 -->
          <li class="list-item-dib common-width-160">
            <el-tooltip class="item" effect="dark" :content="item.occTypeName" placement="top">
              <span>{{item.occTypeName}}</span>
            </el-tooltip>
          </li>
          <!-- 职业类别 -->
          <li class="list-item-dib common-width-140">{{item.jobTypeName}}</li>
          <li class="list-item-dib common-width-128">
            <!-- <span class="dib editor-table them-color"
                  @click.prevent="editorRow(index)">
              编辑
            </span>-->
            <span class="dib editor-table them-color" @click.prevent="deleteRow(index)">移除</span>
          </li>
        </ul>

        <!--显示输入框 isEditor == true-->
        <!-- <ul v-show="item.isEditor">
          <li class="list-item-dib common-width-140">
            <el-input :ref="name(index)"
                      class="text-input"
                      v-model="formData.name"
                      @change="changeInput"
                      placeholder="姓名">
            </el-input>
            <div class="err-tips"
                 v-show="codeObj['202022'].code">
              <i class="arrow-bottom"></i>
              {{codeObj['202022'].reason}}
            </div>
          </li>

          <li class="list-item-dib common-width-140">
            <el-select :ref="certType(index)"
                       v-model="formData.certType"
                       placeholder="证件类型">
              <el-option
                v-for="item in certTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>

          <li class="list-item-dib common-width-240">
            <el-input
              :maxlength="18"
              :ref="certNo(index)"
              class="cert-no text-input"
              v-model="formData.certNo"
              @change="changeCert"
              placeholder="证件号码">
            </el-input>
            <div class="err-tips"
                 v-show="codeObj['202023'].code ||
                codeObj['202030'].code ||
                codeObj['202029'].code ||
                codeObj['202016'].code ||
                codeObj['202015'].code ||
                codeObj['202038'].code ||
                codeObj['202039'].code">
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
          </li>

          <li class="list-item-dib common-width-150">
            <el-date-picker :ref="birthDate(index)"
                            v-model="formData.birthDate"
                            type="date"
                            @change="changeInput"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            placeholder="出生日期">
            </el-date-picker>
            <div class="err-tips"
                 v-show="codeObj['202031'].code">
              <i class="arrow-bottom"></i>
              {{codeObj['202031'].reason}}
            </div>
          </li>

          <li class="list-item-dib common-width-132">
            <el-select :ref="sex(index)"
                        v-model="formData.sex"
                        placeholder="性别">
              <el-option
                v-for="item in sexArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>

          <li class="list-item-dib common-width-140">
            <el-select :ref="jobTypeName(index)"
                       v-model="formData.jobTypeName"
                       placeholder="职业类别">
              <el-option
                v-for="item in jobTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>

          <li class="list-item-dib common-width-138">
            <span class="dib editor-table them-color"
                  @click.prevent="editorRowFinshed(index)">
              {{verifyLoadingText}}
              <i class="el-icon-loading them-color"
                 v-show="verifyLoading"
                 style="font-size: 15px;">
            </i>
            </span>
            <span class="dib editor-table them-color"
                  @click.prevent="editorRowCancel(index)"
                  style="margin-left: 18px;">
            取消
          </span>
          </li>
        </ul>-->
      </div>
    </div>
  </div>
</template>

<script>
// import policyServer from 'api/policy-server'
import { getSession } from "utils/json-parse";
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
  data() {
    return {
      jobCodes: "",
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
      ]
    };
  },
  props: {
    tableData: Array,
    loadingTable: Boolean
  },
  mounted() {
    // 获取工种json
    this.jobCodes = this.getSession("jobCodes");
  },
  methods: {
    getSession,
    //只要加载到这个页面了，就必须获取工种json
    getJobCodes() {
      this.$axios({
        url: policyServer.getJobCodes.url,
        method: policyServer.getJobCodes.method
      })
        .then(res => {
          let data = res.data.data;
          let code = res.data.code;
          if (code === "SUCCESS") {
            this.jobTypeArr = data;
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    deleteRow(index) {
      //点击移除
      this.$emit("deleteRow", index);
    },
    formatArrText(arr, val) {
      let str = "";
      arr.forEach((item, index) => {
        if (item.value == val) {
          str = item.label;
        }
      });
      return str;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import "~styles/variable.scss";
.add-table {
  /*header*/
  .add-header {
    font-size: 0;
    .add-header-item {
      font-size: 14px;
      text-align: center;
      line-height: 54px;
      color: $textColor;
      font-weight: 600;
      background-color: #f3f2f0;
    }
  }
  .editor-table {
    cursor: pointer;
  }
  /*列表*/
  .add-list-content {
    font-size: 0;
  }
  .list-item-dib {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
