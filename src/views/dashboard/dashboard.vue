
<template>
  <div class="dashboard">
    <form-title>
      <span slot="title">标题</span>
      <el-button type="primary" icon="el-icon-plus" v-db-click slot="btn">标题右侧的按钮</el-button>
    </form-title>
    <div class="employer-policy-content">
      <!-- 表格 -->
      <table-configure
        ref="tableConfig"
        :data-table="dataTable"
        @paginationData="paginationData"
        @checkRow="checkRow"
        @editorRow="editorRow"
        @staffListRow="staffListRow"
      >
        <template slot-scope="props" slot="province">
          <!-- 这里是自定义表格 -->
          <span>{{props.obj.row.addressDescription}}</span>
        </template>
      </table-configure>
    </div>
  </div>
</template>
<script>
import {
  formatCurrency,
  generateTimeLimit,
  generatePolicyStatus
} from "utils/generate";
// import PolicyStatusJSON from "common/json/policy-status.json";
import formTitle from "@/base/form-title/form-title.vue";
// import { getEnterpriseList } from "api/enterprise-api";
import tableConfigure from "@/components/table/tableConfig";
// import "./index.scss";
export default {
  components: {
    tableConfigure,
    formTitle
  },
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      dataTable: {
        tr: [
          {
            fieldName: "企业名称",
            propName: "name",
            fieldId: 1,
            overflow: true, // 是否省略号显示
            align: "left",
            headerAlign: "left"
          },
          {
            fieldName: "证件号码",
            propName: "certNo",
            fieldId: 2,
            overflow: true,
            align: "left",
            headerAlign: "left"
          },
          {
            fieldName: "省市",
            propName: "province",
            fieldId: 3,
            overflow: true,
            align: "left",
            headerAlign: "left"
          },
          {
            fieldName: "更新时间",
            propName: "updateAt",
            fieldId: 4,
            overflow: true,
            align: "left",
            headerAlign: "left"
          }
        ],
        data: [],
        templateData: ["province"],
        pageNum: 1,
        pageSize: 10,
        totalCount: 0,
        border: true,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: "right", // 靠右还是左
          marginTop: "10px"
        },
        hasOperation: true, // 有无操作功能
        operation: {
          label: "操作",
          width: "250",
          data: [
            {
              label: "查看",
              Fun: "checkRow",
              type: "text",
              size: "mini",
              id: "0",
              name: ""
            },
            {
              label: "修改",
              Fun: "editorRow",
              type: "text",
              size: "mini",
              id: "1",
              name: ""
            },
            {
              label: "员工维护",
              Fun: "maintainRow",
              type: "text",
              size: "mini",
              id: "2",
              name: ""
            },
            {
              label: "员工列表",
              Fun: "staffListRow",
              type: "text",
              size: "mini",
              id: "3",
              name: ""
            }
          ]
        },
        loading: false
      }
    };
  },
  mounted() {
    // this.$_getPolicyList();
  },
  methods: {
    resetForm(formName) {
      // 重置表单
      // this.$refs[formName].resetFields();
    },
    formatCurrency,
    generateTimeLimit,
    generatePolicyStatus,
    paginationData(data) {
      this.pageSize = data.pageSize;
      this.pageNum = data.pageNum;
      this.$_getPolicyList();
    },
    search() {
      this.pageNum = 1;
      this.$_getPolicyList();
    },
    $_getPolicyList() {
      this.dataTable.loading = false;
      // this.resultLoading = true
      let pagination = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      //手动清除后出现null
      // let policyForm = {
      //   name: this.policyForm.insurantName || '',
      //   salesDepartmentId: this.policyForm.salesDepartmentId[this.policyForm.salesDepartmentId.length - 1] || '',
      //   salesmanName: this.policyForm.salesmanName || '',
      //   signAt: this.policyForm.signAt || '',
      //   status: this.policyForm.status || '',
      // }

      //组合请求参数
      // let params = Object.assign({}, this.policyForm, pagination);
      let params = { ...this.policyForm, ...pagination };
      // this.$axios({
      //   method: enterpriseApi.getEnterpriseList.method,
      //   url: enterpriseApi.getEnterpriseList.url,
      //   data: params
      // })
      getEnterpriseList(params)
        .then(res => {
          this.resultLoading = false;
          this.enterpriseList = res.data || [];
          this.enterpriseList.forEach(item => {
            let newAddress = new Array();
            newAddress = item.addressDescription.split("|");
            if (newAddress?.length > 0) {
              item.addressDescription =
                newAddress[0] + "/" + (newAddress[1] ? newAddress[1] : "");
            } else {
              item.addressDescription = "暂无";
            }
          });
          this.dataTable.data = [...this.enterpriseList];
          this.dataTable.totalCount = res.pagination.totalCount;
          this.dataTable.pageSize = params.pageSize;
          this.dataTable.pageNum = params.pageNum;
          this.dataTable.loading = false;
          this.totalCount = res.pagination.totalCount;
        })
        .catch(() => {
          this.resultLoading = false;
          this.dataTable.loading = false;
        });
    },
    paginationEvents() {
      //翻页触发
      this.$_getPolicyList();
    },
    changeStatus() {
      this.$_getPolicyList();
    },
    checkRow(idx, row) {
      // 查看
    },
    editorRow(idx, row) {
      // 修改
    },
    maintainRow(idx, row) {
      this.$router.push({
        name: "EnterpriseDetail",
        query: {
          type: "editor",
          enterpriseNo: row.enterpriseNo,
          status: "staff"
        }
      });
    },
    staffListRow(idx, row) {
      // 员工列表
      this.$router.push({
        name: "StaffList",
        query: { enterpriseNo: row.enterpriseNo }
      });
    },
    clickAddEnterprise() {
      // 新增企业
      this.$router.push({
        name: "EnterpriseDetail",
        query: { type: "add" }
      });
    }
  }
};
</script>
<style lang="scss" scope>
.employer-policy-box {
  .search-form {
    // padding-left: 30px;
    background-color: #fff;
    padding-top: 24px;
  }
  .employer-policy-content {
    // margin: 24px;
    margin-bottom: 0;
    .hover-style {
      text-decoration: underline;
      &:hover {
        color: #ff8827;
      }
    }
  }
  .el-form-item__label {
    padding-right: 0px;
  }
}
</style>
