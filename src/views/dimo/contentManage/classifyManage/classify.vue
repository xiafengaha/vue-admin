<template>
  <div class="expand">
    <div>
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
    </div>
  </div>
</template>
<script>
import TreeRender from '@/components/treeRender/treeRender'
import './style/classify.scss'
export default {
  name: 'Classify',
  components: {
    TreeRender
  },
  data() {
    return {
      treeData: {},
      apiTreeData: [
        {
          'id': 1,
          'name': '技术部',
          'level': 1,
          'child': [
            {
              'id': 2,
              'name': '运维组',
              'level': 2,
              'child': [
                {
                  'id': 3,
                  'name': 'godo',
                  'level': 3,
                  'child': []
                }
              ]
            },
            {
              'id': 4,
              'name': '测试组',
              'level': 2,
              'child': []
            }
          ]
        }
      ],
      api: {
        maxexpandId: 95,
        treelist: [
          {
            id: 1,
            name: '北京市',
            ProSort: 1,
            remark: '直辖市',
            pid: '',
            isEdit: false,
            children: [{
              id: 35,
              name: '朝阳区',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 36,
              name: '海淀区',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 37,
              name: '房山区',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 38,
              name: '丰台区',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 39,
              name: '昌平区',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 40,
              name: '大兴区',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }]
          },
          {
            id: 2,
            name: '天津市',
            ProSort: 2,
            remark: '直辖市',
            pid: '',
            isEdit: false,
            children: [{
              id: 41,
              name: '北辰区',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 42,
              name: '河北区',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 43,
              name: '西青区',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            }, {
              id: 44,
              name: '东丽区',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            }]
          }]
      },
      maxexpandId: '', // 新增节点开始id
      non_maxexpandId: '', // 新增节点开始id(不更改)
      isLoadingTree: false, // 是否加载节点树
      setTree: [], // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: [] // 默认展开节点列表
    }
  },
  created() {
    this.apiTree() // 获取tree数据
  },
  mounted() {
    this.initExpand()
  },
  methods: {
    apiTree() {
      this.treeData.is_superuser = true // true为可操作
      this.treeData.data = JSON.parse(JSON.stringify(this.apiTreeData))
      this.maxexpandId = this.api.maxexpandId
      this.non_maxexpandId = this.api.maxexpandId
      this.setTree = this.api.treelist
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
      this.setTree.push({
        id: ++this.maxexpandId,
        name: '新增节点',
        pid: '',
        isEdit: false,
        children: []
      })
    },
    handleAdd(s, d, n) { // 增加节点
      console.log(s, d, n)
      if (n.level >= 6) {
        this.$message.error('最多只支持五级！')
        return false
      }
      // 添加数据
      d.children.push({
        id: ++this.maxexpandId,
        name: '新增节点',
        pid: d.id,
        isEdit: false,
        children: []
      })
      // 展开节点
      if (!n.expanded) {
        n.expanded = true
      }
    },
    handleEdit(s, d, n) { // 编辑节点
      console.log(s, d, n)
    },
    handleDelete(s, d, n) { // 删除节点
      console.log(s, d, n)
      const that = this
      // 有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新增节点直接删除，否则要询问是否删除
        const delNode = () => {
          var list = n.parent.data.children || n.parent.data// 节点同级数据
          var _index = 99999// 要删除的index
          /* if(!n.parent.data.children){//删除顶级节点，无children
            list = n.parent.data
          }*/
          list.map((c, i) => {
            if (d.id === c.id) {
              _index = i
            }
          })
          // var k = list.splice(_index, 1)
          // console.log(_index,k)
          this.$message.success('删除成功！')
        }
        const isDel = () => {
          that.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delNode()
          }).catch(() => {
            return false
          })
        }
        // 判断是否新增
        d.id > this.non_maxexpandId ? delNode() : isDel()
      }
    }
  }
}
</script>
