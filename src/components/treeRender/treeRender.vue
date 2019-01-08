<template>
  <span class="tree-expand">
    <span v-show="DATA.isEdit" class="tree-label">
      <el-input
        v-model="DATA.name"
        :ref="'treeInput'+DATA.id"
        class="edit"
        size="mini"
        autofocus
        @click.stop.native="nodeEditFocus"
        @blur.stop="nodeEditPass(STORE,DATA,NODE)"
        @keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"/>
    </span>
    <span
      v-show="!DATA.isEdit"
      :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
      <span>{{ DATA.name }}</span>
    </span>
    <span v-show="!DATA.isEdit" class="tree-btn">
      <el-tooltip v-has="'goodsCategory.add'" class="item" effect="dark" content="新增" placement="top">
        <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"/>
      </el-tooltip>
      <el-tooltip v-has="'goodsCategory.edit'" class="item" effect="dark" content="编辑" placement="top">
        <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"/>
      </el-tooltip>
      <el-tooltip v-has="'goodsCategory.del'" class="item" effect="dark" content="删除" placement="top">
        <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"/>
      </el-tooltip>
    </span>
  </span>
</template>

<script>
import './style/tree.scss'
export default{
  name: 'TreeExpand',
  // props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
  props: {
    NODE: {
      type: Object,
      required: true
    },
    DATA: {
      type: Object,
      required: true
    },
    STORE: {
      type: Object,
      required: true
    },
    maxexpandId: {
      type: Number,
      required: true
    }
  },
  created() {
  },
  methods: {
    nodeAdd(s, d, n) { // 新增
      this.$emit('nodeAdd', s, d, n)
    },
    nodeEdit(s, d, n) { // 编辑
      d.isEdit = true
      this.$nextTick(() => {
        this.$refs['treeInput' + d.id].$refs.input.focus()
      })
      this.$emit('nodeEdit', s, d, n)
    },
    nodeDel(s, d, n) { // 删除
      this.$emit('nodeDel', s, d, n)
    },
    nodeEditPass(s, d, n) { // 编辑完成
      d.isEdit = false
    },
    nodeEditFocus() {
      // 阻止点击节点的事件冒泡
    }
  }
}
</script>

<style >

</style>
