<template>
  <div>
    <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
      <el-table-column v-if="treeData.columns.length===0" width="150">
        <template slot-scope="scope">
          <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
          <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-plus"/>
            <i v-else class="el-icon-minus"/>
          </span>
          {{ scope.$index }}
        </template>
      </el-table-column>
      <template v-else >
        <el-table-column
          fixed
          width="55"
        >
          <template slot-scope="scope">
            <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
            <span v-if="iconShow(0 ,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-plus"/>
              <i v-else class="el-icon-minus"/>
            </span>
          </template>
        </el-table-column>
        <template v-for="(column) in treeData.columns">
          <el-table-column v-if="!column.show" :key="column.value" :label="column.text" :width="column.width">
            <template slot-scope="scope">
              <!-- Todo -->
              <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
              {{ scope.row[column.value] }}
            </template>
          </el-table-column>
          <el-table-column v-else :key="column.value" :label="column.text" :width="column.width">
            <template slot-scope="scope">
              <!--<span>{{ scope.row.text }}</span>-->
              <slot :name="column.value" :obj="scope"/>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-if="treeData.hasOperation"
          :label="treeData.operation.label"
          :class-name="treeData.operation.className"
          :width="treeData.operation.width"
          column-key="operation"
        >
          <template slot-scope="scope">
            <!--&lt;!&ndash;v-has="item.name"&ndash;&gt;这个是按钮权限-->
            <el-button
              v-for="item in treeData.operation.data"
              v-if="scope.row.children"
              :key="item.id"
              :class="item.classname ? item.classname : ''"
              :size="item.size"
              :type="item.type"
              @click.stop="handleOperation(scope.$index, scope.row, item.id)">{{ item.label }}</el-button>
          </template>

        </el-table-column>
      </template>

      <slot/>
    </el-table>
    <pagination v-if="treeData._count > 0" :total="treeData._count" :page.sync="treeData.offset / 10 + 1" :limit.sync="treeData.limit" style="text-align: right;" @pagination="searchList" />
  </div>
</template>

<script>
  /**
   Auth: Lei.j1ang
   Created: 2018/1/19-13:59
   */
  import treeToArray from './eval'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: 'TreeTable',
    props: {
      /* eslint-disable */
      treeData: {
        type: Object,
        required: true
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Pagination
    },
    data() {
      return{
        treeTable: {}
      }
    },
    mounted() {
      this.treeTable = Object.assign({}, this.treeData)
    },
    computed: {
      // 格式化数据源
      formatData: function() {
        let tmp
        if (!Array.isArray(this.treeData.data)) {
          tmp = [this.treeData.data]
        } else {
          tmp = this.treeData.data
        }
        const func = this.evalFunc || treeToArray
        const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
        return func.apply(null, args)
      }
    },
    methods: {
      showRow: function(row) {
        const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
        row.row._show = show
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      // 切换下级是否展开
      toggleExpanded: function(trIndex) {
        const record = this.formatData[trIndex]
        record._expanded = !record._expanded
      },
      // 图标显示
      iconShow(index, record) {
        return (index === 0 && record.children && record.children.length > 0)
      },
      handleOperation(a, b, id) { // 点了操作按钮触发的函数
        const data = this.treeTable.operation.data
        for (let i = 0; i < data.length; i++) {
          if (id === data[i].id) {
            this.$emit(data[i].Fun, a, b)
          }
        }
      },
      searchList(data) {
        data.offset = (data.page - 1) * 10
        delete data.page
        this.$emit('paginationData', data)
      }
    }
  }
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
</style>
