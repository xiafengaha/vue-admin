
<template>
  <div class="management-container">
    <scroll-bar>
      <el-tree
        :data="salesDepartmentList"
        :props="defaultProps"
        empty-text=" "
        node-key="id"
        @node-click="handleNodeClick"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
      >
        <span
          class="custom-tree-node"
          :class="{isCurrentNode: node.data.id === $route.query.departmentId,
                        isDisabledNode: node.data.disabled }"
          slot-scope="{ node, data }"
        >
          <!-- <span> -->
          <!-- {{node.label}} -->
          <el-tooltip class="item" effect="dark" :content="node.label" placement="top">
            <span>{{node.label}}</span>
          </el-tooltip>
          <!-- </span> -->

          <!-- <span>
            
          </span>-->
          <span class="opera-con">
            <dropdown
              :node="node"
              @upMoveTeam="upMoveTeam"
              @downMoveTeam="downMoveTeam"
              @enableTeam="enableTeam"
              @disableTeam="disableTeam"
              @editTeam="editTeam"
              @addChildTeam="addChildTeam"
            ></dropdown>
          </span>
        </span>
      </el-tree>
    </scroll-bar>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Dropdown from "./dropdown";
// import teammateApi from "api/teammate-api.js";
import ScrollBar from "components/scrollBar/scrollBar.vue";

export default {
  components: {
    ScrollBar,
    Dropdown
  },
  name: "management",
  data() {
    return {
      defaultProps: {
        //树形组件映射规则
        label: "name",
        children: "childDepartment"
      }
    };
  },
  computed: {
    ...mapState(["salesDepartmentList"])
  },

  mounted() {},
  methods: {
    ...mapActions(["getTreeLayerr"]),
    handleNodeClick(data) {
      //console.log('点击的当前项=>', data)
      //console.log(this.salesDepartmentList)
      this.$router.push({ name: "teammate", query: { departmentId: data.id } });
    },
    upMoveTeam(node) {
      //部门内团队上移动
      console.log("upMoveTeam", node);
      this._moveTeam("upMove", node);
    },
    downMoveTeam(node) {
      //部门内团队下移动
      console.log("downMoveTeam", node);
      this._moveTeam("downMove", node);
    },
    _moveTeam(type, node) {
      //部门内团队上下移动
      let currentData = node.data; //点击项当前的数据 object
      let currentParentDataList =
        node.parent.data.childDepartment || node.parent.data; //点击项的父级数据 数组类型
      let currentIndex = currentParentDataList.findIndex(item => {
        // 获取当前项在父级数据中所在的index
        return item.id === currentData.id;
      });
      let targetIndex; // 移动到的目标下标
      if (type === "upMove") {
        //如果是向上移 则获取currentIndex的前一位
        targetIndex = currentIndex - 1;
      } else {
        targetIndex = currentIndex + 1;
      }
      this.$axios({
        method: teammateApi.swap.method,
        url: teammateApi.swap.url,
        data: {
          srcDepartmentId: currentData.id,
          destDepartmentId: currentParentDataList[targetIndex].id
        }
      }).then(res => {
        this.getTreeLayerr(); //重新获取树形部门数据
      });
    },
    enableTeam(node) {
      //0204-启用团队
      console.log("enableTeam", node);
      let currentData = node.data; //点击项当前的数据 object
      if (currentData.status == "ENABLED") return false;
      this.$axios({
        method: teammateApi.enable.method,
        url: teammateApi.enable.url(currentData.id)
      }).then(res => {
        this.getTreeLayerr(); //重新获取树形部门数据
      });
    },
    disableTeam(node) {
      //0205-禁用团队
      console.log("disableTeam", node);
      let currentData = node.data; //点击项当前的数据 object
      if (currentData.status == "FORBIDDEN") return false;
      this.$axios({
        method: teammateApi.disable.method,
        url: teammateApi.disable.url(currentData.id)
      }).then(res => {
        this.getTreeLayerr(); //重新获取树形部门数据
      });
    },
    editTeam(node) {
      //0206更新团队名称
      console.log("editTeam", node);
      this._changeTeam("editTeam", node);
    },
    addChildTeam(node) {
      //0207-增加子团队
      console.log("addChildTeam", node);
      this._changeTeam("addChildTeam", node);
    },
    _changeTeam(type, node) {
      let title = "",
        isEditTeam = type === "editTeam",
        isAddChildTeam = type === "addChildTeam";
      if (isEditTeam) {
        //是否点击的是修改团队名称
        title = "请输入团队名称";
      } else if (isAddChildTeam) {
        //是否点击的是增加子级团队
        title = "请输入子团队名称";
      }
      this.$prompt(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder:
          "请输入4-10位字符(可包含中文,英文,中划线-,或者下划线_)",
        inputPattern: /^[A-Za-z0-9\u4E00-\u9FA5_\-—]{4,10}$/,
        inputErrorMessage: "输入的团队名称不合要求。"
      })
        .then(({ value }) => {
          console.log("输入的团队名称", value);
          if (isEditTeam) {
            //是否点击的是修改团队名称
            this.$axios({
              method: teammateApi.update.method,
              url: teammateApi.update.url(node.data.id),
              data: {
                departmentName: value.trim()
              }
            }).then(res => {
              this.getTreeLayerr(); //重新获取树形部门数据
            });
          } else if (isAddChildTeam) {
            //是否点击的是增加子级团队
            this.$axios({
              method: teammateApi.addable.method,
              url: teammateApi.addable.url,
              data: {
                departmentName: value.trim(),
                parentDepartmentId: node.data.id
              }
            }).then(res => {
              this.getTreeLayerr(); //重新获取树形部门数据
            });
          }
        })
        .catch(() => {
          console.log("点击了取消");
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~styles/variable.scss";
// 重置 操作图标opera-con位置
.management-container {
  .custom-tree-node {
    width: calc(100vw - 24px);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.el-tree-node {
  .el-tree-node__content {
    position: relative;
    .el-tree-node__expand-icon {
      color: #7e7e7f;
      &.is-leaf {
        color: transparent;
      }
    }
    .opera-con {
      position: absolute;
      // top: 5px;
      right: 0;
      display: none;
    }

    &:hover {
      background-color: #fff;
      .custom-tree-node,
      .el-dropdown {
        color: lighten($themeColor, 10%);
      }
      .opera-con {
        display: inline-block;
      }
    }
    // 根据每项状态的disabled 置灰颜色
    .isDisabledNode {
      color: $disabledColor;
    }
    // 根据当前departmentId高亮项
    .isCurrentNode {
      color: $themeColor;
      .el-dropdown {
        color: $themeColor;
      }
      .opera-con {
        display: inline-block;
      }
    }
  }
  // 重置子级的颜色
  .el-tree-node__children {
    .el-tree-node__content,
    .el-dropdown {
      color: #747474;
    }
  }
}
// 重置当前高亮项的颜色
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: none;
  .custom-tree-node,
  .el-dropdown {
    color: $themeColor;
  }
  .opera-con {
    display: inline-block;
  }
}

.management-container {
  transition: width 0.28s;
  width: $managementWidth;
  // position: fixed;
  // top: 0px;
  overflow: auto;
  // bottom: 0;
  height: calc(100vh - 205px);
  // height: calc(100% - 30px);
  z-index: 1001;
  padding: 15px 5px 15px 5px;
  margin-top: 24px;
  padding-top: 0;
  background-color: #fff;
  border-right: 1px solid #ebebeb;
}
</style>
