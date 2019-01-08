<template>
  <div class="tl-rl">
    <template :table="dataTable">
      <!--:row-class-name="rowClassName"-->
      <!--:span-method="objectSpanMethod"-->
      <el-table
        ref="TlRlTable"
        :show-summary="dataTable.hasShowSummary"
        :summary-method="dataTable.getSummaries"
        :data="dataTable.data"
        :max-height="dataTable.maxHeight"
        :height="dataTable.height"
        :border="dataTable.border"
        :style="dataTable.tableStyle"
        :header-cell-style="dataTable.headerCellStyle"
        stripe
        empty-text="暂无数据"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        @row-click="rowClick">
        <!--header-row-class-name="thClassName"-->
        <el-table-column
          v-if="dataTable.hasSelect"
          type="selection"
          fixed
          width="55"/>
        <el-table-column
          v-if="dataTable.hasRadio"
          fixed
          style="text-align: center"
          width="55"
        >
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="dataTable.radio" @change.native="getCurrentRow(scope.$index)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column v-if="dataTable.hasExpand" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item v-for="item in dataTable.expands" :label="item.label" :key="item.id">
                <span>{{ props.row[item.prop] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <template v-for="item in dataTable.tr">
          <el-table-column
            v-if="item.isView != 0 && item.show === 'template'"
            :label="item.label"
            :class-name="item.className ? item.className : ''"
            :key="item.id"
            :sortable="item.sortable"
            :fixed="item.fixed"
            :width="item.width"
          >
            <template slot-scope="scope">
              <slot :name="item.prop" :obj="scope"/>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.isView != 0 && item.show !== 'template'&& item.hasCenterCol"
            :label="item.label"
            :class-name="item.className ? item.className : ''"
            :key="item.id"
            :sortable="item.sortable"
            :fixed="item.fixed"
            :width="item.width"
          >
            <template slot-scope="scope">
              <slot :name="item.prop" :obj="scope"/>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.isView != 0 && item.show !== 'template'"
            :label="item.label"
            :sortable="item.sortable"
            :prop="item.prop"
            :class-name="item.className ? item.className : ''"
            :key="item.id"
            :fixed="item.fixed"
            :width="item.width"
          />
        </template>
        <el-table-column
          v-if="dataTable.hasOperation"
          :label="dataTable.operation.label"
          :class-name="dataTable.operation.className"
          column-key="operation"
          :width="dataTable.hasOperation.width"
        >
          <template slot-scope="scope">
            <!--v-has="item.name"权限先不要-->
            <el-button
              v-for="item in dataTable.operation.data"
              :key="item.id"
              :class="item.classname ? item.classname : ''"
              :size="item.size"
              :type="item.type"
              :disabled="scope.row.disabled && item.label === '删除' ? scope.row.disabled: false"
              @click.stop="handleOperation(scope.$index, scope.row, item.id)">{{ item.label }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="dataTable._count > 0" :total="dataTable._count" :page.sync="dataTable.offset" :limit.sync="dataTable.limit" style="text-align: right;" @pagination="searchList" />
      <!--<div class="fixed-bottom">-->
      <!--<el-pagination-->
      <!--v-if="dataTable.paginationShow"-->
      <!--:style="dataTable.paginationStyle"-->
      <!--:current-page="dataTable.start"-->
      <!--:page-sizes="[10, 20, 30, 50,100]"-->
      <!--:page-size="dataTable.limit"-->
      <!--:total="dataTable.total"-->
      <!--background-->
      <!--prev-text="上一页"-->
      <!--next-text="下一页"-->
      <!--layout="total, sizes, prev, pager, next, jumper"-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handleCurrentChange"/>-->

    </template>
  </div>
</template>

<script>
import './tableConfigure.scss'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'TableConfig',
  components: {
    Pagination
  },
  props: {
    dataTable: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // domShow: true,
      dialogVisible: false, // 配置的弹窗显示隐藏
      checkBoxData: [], // 左侧可选的数据字段
      selectListData: [], // 这个是右侧选中的列表字段
      noSelectListData: [], // 用户没选中的
      table: {
        type: Object,
        default() {
          return {
            hasMergeRowOrColumn: false, // 是否合并单元格
            hasShowSummary: false, // 是否显示表位合计行
            border: false, // 是否带有纵向边框，默认为false
            hasSelect: false, // 有无选中功能
            hasRadio: false, // 单选功能
            hasOperation: false, // 有无操作功能
            hasExpand: false, // 有无展开行功能
            radio: '',
            hasCenterCol: true,
            tr: [ // 表头数据 —— className:列的class名
              //                             {
              //                                 id: '1',
              //                                 label: 'label',
              //                                 prop: 'prop',
              //                                 className: 'classname',
              //                                 minWidth: '80',
              //                                 show: true           // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
              // //          <template slot-scope="props" slot="example">
              // //                <a class="list-a" target="_blank" :href="'/#/bombscreen?mobile=' + props.obj.row.mobile">{{ props.obj.row.username }}</a>
              // //          </template>
              //                             }
            ],
            data: [], // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
            operation: { // 操作功能
              // label: '操作',                // 操作列的行首文字
              // width: '200',                // 操作列的宽度
              // className: '',               // 操作列的class名
              // data: [                      // 操作列数据
              //     // {
              //     //     label: '通过',                // 按钮文字
              //     //     Fun: 'handleSubmit',         // 点击按钮后触发的父组件事件
              //     //     size: 'mini',                // 按钮大小
              //     //     id: '1',                     // 按钮循环组件的key值
              //     //     classname: 'show'            // 按钮的类名
              //     // }
              // ]
            },
            expands: [ // 展开行数据
              // {
              //     id: '1',
              //     label: 'label',
              //     prop: 'prop'
              // }
            ],
            getSummaries(param) { // 自定义表位合计行数据
              // *** 此函数传入param参数
              // *** 最后返回一个数组，合计行会显示数组中的内容
              return []
            },
            offest: 1,
            limit: 10,
            _count: 0,
            paginationShow: true // 是否需要分页
          }
        }
      }
    }
  },
  watch: {
    'dataTable': 'initTable'
  },
  created() {
    this.initTable() // 表格初始化
  },
  mounted() {
    this.table = this.dataTable
  },
  methods: {
    initTable() { // 表格初始化
      this.$emit('tableDataHandle')
    },
    // 点击某一行时触发的函数
    rowClick(Row, Event, Column) {
      if (!Column || Column.type === 'selection' || Column.columnKey === 'operation' || Column.type === 'expand') {
        return
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      }
      this.$refs.TlRlTable.toggleRowSelection(Row)
      this.$emit('onRowClick', data)
    },
    handleSelectionChange(val) {
      if (this.dataTable.hasRadio) { // 这个为了防止用户选了单选之后，多选触发
      } else {
        this.$emit('onHandleSelectionChange', val)
      }
    },
    onRowClick(data) {
      this.$emit('onRowClick', data)
    },
    handleSizeChange(val) { // size选择
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) { // 页码选择
      this.$emit('handleCurrentChange', val)
    },
    handleOperation(a, b, id) { // 点了操作按钮触发的函数
      const data = this.table.operation.data
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

<style scoped>

</style>
