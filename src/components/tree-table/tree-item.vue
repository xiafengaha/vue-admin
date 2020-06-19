<template>
  <div :class="tdClass">
    <span class="before-line" v-if="root !== 0 && nodes !== 1" :style="{'left':model.bLeft + 'px'}"></span>
    <table>
      <tr>
        <td :colspan="colSpan">
          <table>
            <tr class="leve" :class="levelClass">
              <td class="td0">{{this.model.level === 1 ? indexMethod(num) : ''}}</td>
              <td class="td1" :style="{'padding-left': model.level * 16 + 'px'}">
                <div class="td-title" @dblclick="handlerExpand(model)">
                  <span
                    v-if="model.children.length > 0"
                    class="tree-close"
                    :class="{'tree-open':model.isExpand}"
                    @click="handlerExpand(model)"
                  ></span>
                  <a class="ellipsis">
                    <span :title="model.depatmentName">{{model.name}}</span>
                  </a>
                </div>
              </td>
              <td class="td2">{{model.level|| '/'}}</td>
              <td class="td3">{{model.category|| '/'}}</td>
              <td class="td4">
                <span :title="model.quantity" class="ellipsis">{{model.quantity}}</span>
              </td>
              <td class="td5">{{model.creator|| '/'}}</td>
              <td class="td6">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="model.createAt || '/'"
                  placement="top"
                >
                  <div style="white-space: nowrap;overflow:hidden;text-overflow: ellipsis;">
                    <span>{{model.createAt || '/'}}</span>
                  </div>
                </el-tooltip>
              </td>
              <td class="td7">
                <span :class="model.actived? 'success' : 'error'">·</span>
                <span>{{model.actived ? '启用' : '停用'}}</span>
              </td>
              <td class="td8">
                <!-- <div > -->
                <el-tooltip class="item" effect="dark" :content="model.memo || '/'" placement="top">
                  <div style="white-space: nowrap;overflow:hidden;text-overflow: ellipsis;">
                    <span>{{model.memo || '/'}}</span>
                  </div>
                </el-tooltip>
                <!-- </div> -->
              </td>
              <td class="td9">
                <div class="fl up-down">
                  <i
                    class="el-icon-caret-top"
                    v-has="'BEACON-DEPARTMENT-MOVE'"
                    style="margin-bottom: -7px;"
                    @click="upHandle(model)"
                  ></i>
                  <i
                    v-has="'BEACON-DEPARTMENT-MOVE'"
                    class="el-icon-caret-bottom"
                    @click="downHandle(model)"
                  ></i>
                </div>
                <div class="fl handle-btn" style="display:flex;height:100%;">
                  <el-button
                    v-has="'BEACON-DEPARTMENT-CREATE'"
                    type="text"
                    @click="addLowerLevel(model)"
                  >新建下级部门</el-button>
                  <el-button
                    v-has="'BEACON-DEPARTMENT-CREATE'"
                    type="text"
                    @click="addCommonLevel(model)"
                  >新建平级部门</el-button>
                  <el-button
                    v-has="'BEACON-DEPARTMENT-DETAIL'"
                    type="text"
                    @click="editorFunc(model)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    v-has="'BEACON-DEPARTMENT-ENABLE'"
                    @click="handleActived(model)"
                  >{{model.actived ? '停用': '启用'}}</el-button>
                  <el-button
                    v-has="'BEACON-DEPARTMENT-DETAIL'"
                    type="text"
                    @click="checkFunc(model)"
                  >查看</el-button>
                </div>
              </td>
              <!-- <td class="td10"></td> -->
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <div v-show="model.isExpand" class="other-node" :class="otherNodeClass">
      <tree-item
        v-for="(m, i) in model.children"
        :key="String('child_node'+i)"
        :num="i"
        :root="1"
        @checkFunc="checkFunc"
        @handleActived="handleActived"
        @addLowerLevel="addLowerLevel"
        @addCommonLevel="addCommonLevel"
        @editorFunc="editorFunc"
        @downHandle="downHandle"
        @upHandle="upHandle"
        @handlerExpand="handlerExpand"
        :nodes.sync="model.children.length"
        :trees.sync="trees"
        :model.sync="m"
      ></tree-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "treeItem",
  props: ["model", "num", "nodes", "root", "trees"],
  data() {
    return {
      parentNodeModel: null
    };
  },
  computed: {
    colSpan() {
      return this.root === 0 ? "" : 6;
    },
    tdClass() {
      return this.root === 0 ? "td-border" : "not-border";
    },
    levelClass() {
      return this.model ? "leve-" + this.model.level : "";
    },
    childNodeClass() {
      return this.root === 0 ? "" : "child-node";
    },
    otherNodeClass() {
      return this.model ? "other-node-" + this.model.level : "";
    }
  },
  watch: {
    // 'model': {
    // 	handler() {
    // 		console.log('对象变化', this.model.isExpand)
    // 	},
    // 	deep: true
    // }
  },
  methods: {
    getParentNode(m) {
      // 查找点击的子节点
      var recurFunc = (data, list) => {
        data.forEach(l => {
          if (l.id === m.id) this.parentNodeModel = list;
          if (l.children) {
            recurFunc(l.children, l);
          }
        });
      };
      recurFunc(this.trees, this.trees);
    },
    handlerExpand(m) {
      this.$emit("handlerExpand", m);
    },
    editorFunc(m) {
      this.$emit("editorFunc", m);
    },
    addCommonLevel(m) {
      this.$emit("addCommonLevel", m);
    },
    addLowerLevel(m) {
      this.$emit("addLowerLevel", m);
      // this.getParentNode(m)
      // console.log(this.parentNodeModel)
      // if (this.parentNodeModel.hasOwnProperty('children')) {
      // 	console.log('父级是跟节点', this.parentNodeModel)
      // 	this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(m), 1)
      // } else if (this.parentNodeModel instanceof Array) {
      // 	console.log('跟节点', this.parentNodeModel)
      // 	this.parentNodeModel.splice(this.parentNodeModel.indexOf(m), 1)
      // }
    },
    handleActived(m) {
      // 启停
      this.$emit("handleActived", m);
    },
    checkFunc(m) {
      // 查看
      this.$emit("checkFunc", m);
    },
    upHandle(m) {
      //上移
      console.log("up", m);
      this.$emit("upHandle", m);
    },
    downHandle(m) {
      // 下移
      console.log("down", m);
      this.$emit("downHandle", m);
    },
    indexMethod(index) {
      // 索引
      let numberIndex = Number(index) + 1; // 从1开始
      if (numberIndex < 10) {
        numberIndex = "0" + numberIndex;
      }
      return numberIndex;
    }
  },
  filters: {
    formatDate: function(date) {
      // 后期自己格式化
      return date; //Utility.formatDate(date, 'yyyy/MM/dd')
    }
  }
};
</script>
<style lang="scss" scope>
@import "~styles/variable.scss";
.el-icon-caret-top,
.el-icon-caret-bottom {
  color: #b5b5b5;
  &:hover {
    color: $themeColor;
    cursor: pointer;
  }
}
.handle-btn {
  button {
    font-weight: 350;
  }
}
</style>
