<template>
  <!--<el-card style="height: calc(100vh - 84px);overfloww: auto">-->
  <div class="expand">
    <div>
      <el-button v-db-click v-has="'goodsCategory.add'" type="primary" @click="handleAddTop">
        新增一级分类
      </el-button>
      <el-tree
        v-if="isLoadingTree"
        ref="expandMenuList"
        :data="setTree"
        :props="defaultProps"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :default-expanded-keys="defaultExpandKeys"
        class="expand-tree"
        node-key="id"
        highlight-current
        @node-click="handleNodeClick"/>
      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogTitle + nodeName"
        width="30%">
        <el-row>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-col :span="24">
              <el-form-item label="分类名" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="属性">
                <el-col v-for="(item, index) in ruleForm.pro" :span="24" :key="index" style="margin-top: 10px">
                  <el-input v-model="ruleForm.pro[index]" style="width: 80%"/>
                  <el-button v-db-click type="text" @click="delInput(index)">删除</el-button>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label=" ">
                <el-button type="primary" @click="addInput">
                  新增
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button v-db-click @click="cancelDialog">取 消</el-button>
          <!--<el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>-->
          <el-button v-db-click type="primary" @click="addOrUplate('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
  <!--</el-card>-->
</template>
<script>
import TreeRender from '@/components/treeRender/treeRender'
import { goodsCateApi, classifyAdd, classifyUplate, classifyDel } from '@/api/commodity/classify'
import './style/classify.scss'
export default {
  name: 'Classify',
  components: {
    TreeRender
  },
  data() {
    return {
      treeData: {},
      api: {
        maxexpandId: 95,
        treelist: []
      },
      maxexpandId: '', // 新增节点开始id
      non_maxexpandId: '', // 新增节点开始id(不更改)
      isLoadingTree: false, // 是否加载节点树
      setTree: [], // 节点树数据
      defaultProps: {
        children: '_child',
        label: 'name'
      },
      defaultExpandKeys: [], // 默认展开节点列表,
      dialogTitle: '新增',
      ruleForm: {
        pro: ['']
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      handleThisDom: '',
      nodeName: ''
    }
  },
  created() {
    this.apiTree() // 获取tree数据
  },
  mounted() {
  },
  methods: {
    apiTree() {
      goodsCateApi().then(res => {
        this.api.treelist = JSON.parse(JSON.stringify(res.data.data))
        this.setTree = this.api.treelist
        this.maxexpandId = this.api.maxexpandId
        this.non_maxexpandId = this.api.maxexpandId
        this.initExpand()
      })
    },
    initExpand() {
      this.setTree.map((a) => {
        this.defaultExpandKeys.push(a.id)
      })
      this.isLoadingTree = true
    },
    handleNodeClick(d, n, s) { // 点击节点
      // console.log(d,n)
      d.isEdit = false// 放弃编辑状态
    },
    renderContent(h, { node, data, store }) { // 加载节点
      const that = this
      return h(TreeRender, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store,
          maxexpandId: that.non_maxexpandId
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
          nodeDel: (s, d, n) => that.handleDelete(s, d, n)
        }
      })
    },
    handleAddTop() {
      this.dialogTitle = '新增'
      this.nodeName = '一级分类' + '的子级'
      // this.addOrUplate()
      this.dialogVisible = true
      // console.log(this.ruleForm)
      this.resetForm('ruleForm')
      this.ruleForm.parent_id = 0
    },
    handleAdd(s, d, n) { // 增加节点
      if (n.level >= 6) {
        this.$message.error('最多只支持五级！')
        return false
      }
      this.dialogTitle = '新增'
      this.nodeName = d.name + '的子级'
      this.dialogVisible = true
      this.ruleForm.parent_id = d.id
      this.handleThisDom = JSON.parse(JSON.stringify(d))
    },
    handleEdit(s, d, n) { // 编辑节点
      this.dialogTitle = '修改'
      this.nodeName = d.name + '的子级'
      this.ruleForm.id = d.id // 当前节点的ID
      // this.ruleForm.parent_id = d.id
      this.dialogVisible = true
      this.ruleForm.name = d.name
      this.ruleForm.parent_id = d.parent_id
      this.ruleForm.pro = JSON.parse(JSON.stringify(d.pro))
    },
    handleDelete(s, d, n) { // 删除节点
      const that = this
      // 有子级不删除
      if (d._child && d._child.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新增节点直接删除，否则要询问是否删除
        that.$confirm('是否删除此节点(' + d.name + ')', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delTreeList(d.id)
        }).catch(() => {
          return false
        })
      }
    },
    delTreeList(id) {
      classifyDel(id).then(res => {
        this.$message.success('删除成功')
        this.apiTree() // 获取tree数据
      })
    },
    delInput(index) {
      this.ruleForm.pro.splice(index, 1)
    },
    addInput() { // 新增input
      this.ruleForm.pro.push('')
    },
    addOrUplate(formName) { // 新增或者修改
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var addOrUplateApi // 定义axios变量
          this.dialogTitle === '新增' ? addOrUplateApi = classifyAdd(this.ruleForm) : addOrUplateApi = classifyUplate(this.ruleForm)
          addOrUplateApi.then(res => {
            if (this.dialogTitle === '新增') {
              // handleThisDom
              this.$message.success('新增成功')
              this.apiTree()
              // this.findChildDom(this.api.treelist, res.data)
            } else {
              this.$message.success('修改成功')
              this.apiTree()
            }
            // console.log(res, this.)
            this.resetForm('ruleForm')
            this.$nextTick(() => {
              this.dialogVisible = false
            })
          })
        } else {
          return false
        }
      })
    },
    findChildDom(allData, data) {
      if (data.parent_id === 0) {
        this.api.treelist.splice(0, 0, data)
      } else {
        allData.forEach(item => {
          if (item.id === data.parent_id) {
            console.log(item, 'item')
            if (!Array.isArray(item._child)) {
              item._child = []
            }
            item._child.splice(0, 0, data)
            return false
          } else {
            if (item._child) { // 没有子级就不让它递归
              this.findChildDom(item._child, data)
            }
          }
        })
      }

      // var childs = data.children,item;
      // //对node的处理
      // if(node){
      //   arr_dom.push(node);
      // }
      // for(var i=0; i < childs.length ; i++){
      //   item = childs[i];
      //   if(item.nodeType === 1){
      //     //递归先序遍历子节点
      //     preOrder(item);
      //   }
      // }
    },
    cancelDialog() {
      this.resetForm('ruleForm')
      this.$nextTick(() => {
        this.dialogVisible = false
      })
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      for (const item in this.ruleForm) {
        if (item === 'pro') {
          this.ruleForm.pro = ['']
        } else {
          this.ruleForm[item] = ''
        }
      }
    },
    resetAll(formName) {
      this.resetForm(formName)
    }
  }
}
</script>
