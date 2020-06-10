<template>
  <div class="tl-rl">
    <!-- v-if="dataTable.data.length > 0" -->
    <template :table="dataTable">
      <!--:row-class-name="rowClassName"-->
      <!--:span-method="objectSpanMethod"-->
      <el-table
        ref="TlRlTable"
        v-loading="dataTable.loading"
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
        @setCurrentRow="getCurrentRow"
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
      >
        <!--header-row-class-name="thClassName"-->
        <el-table-column v-if="dataTable.hasSelect" type="selection" fixed width="55" />
        <!--        :selectable="selectInit"-->
        <el-table-column v-if="dataTable.hasRadio" fixed style="text-align: center" width="55">
          <template slot-scope="scope">
            <el-radio-group v-model="dataTable.radio">
              <el-radio
                :label="scope.row.userId"
                @change.native="getCurrentRow(scope.$index, scope)"
              >&nbsp;</el-radio>
            </el-radio-group>
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
        <el-table-column
          type="index"
          label="序号"
          style="text-align: center"
          align="center"
          :index="indexMethod"
          v-if="!dataTable.hasSerialNumber"
        ></el-table-column>
        <template v-for="(item) in dataTable.tr">
          <el-table-column
            v-if="item.isView != 0 && item.show === 'template'"
            :label="item.label"
            :class-name="item.className ? item.className : ''"
            :key="item.id"
            :sortable="item.sortable"
            :fixed="item.fixed"
            :width="item.width"
            :align="item.align"
            :header-align="item.headerAlign"
            :show-overflow-tooltip="item.overflow"
          >
            <template slot-scope="scope">
              <slot :name="item.prop" :obj="scope" />
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
            :align="item.align"
            :header-align="item.headerAlign"
            :show-overflow-tooltip="item.overflow"
          >
            <template slot-scope="scope">
              <slot :name="item.prop" :obj="scope" />
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
            :align="item.align"
            :header-align="item.headerAlign"
            :show-overflow-tooltip="item.overflow"
          />
        </template>
        <el-table-column
          v-if="dataTable.hasOperation"
          :label="dataTable.operation.label"
          :class-name="dataTable.operation.className"
          :width="dataTable.operation.width"
          :fixed="dataTable.operation.fixed"
          column-key="operation"
        >
          <template slot-scope="scope">
            <!--<el-button>{{ item.name }}</el-button>-->
            <div
              v-for="(item, index) in dataTable.operation.data"
              class="float-left"
              :style="index === 0 ? 'margin-left: 0px': 'margin-left: 10px'"
            >
              <el-button
                v-has="item.name"
                v-if="item.name"
                class="operation-btn"
                :key="item.id"
                :class="item.classname ? item.classname : ''"
                :size="item.size"
                :type="item.type"
                :disabled="scope.row.disabled && item.label === item.disabledName ? scope.row.disabled: false"
                @click.stop="handleOperation(scope.$index, scope.row, item.id)"
              >{{ item.label }}</el-button>
              <el-button
                v-else
                :key="item.id"
                class="operation-btn"
                :class="item.classname ? item.classname : ''"
                :size="item.size"
                :type="item.type"
                :disabled="scope.row.disabled && item.label === item.disabledName ? scope.row.disabled: false"
                @click.stop="handleOperation(scope.$index, scope.row, item.id)"
              >{{ item.diyLabel ? getStatus(scope.row.status) : (scope.row[item.labelShow] ? '' :item.label) }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="dataTable.totalCount > 0"
        :total="dataTable.totalCount"
        :page.sync="dataTable.pageNum"
        :limit.sync="dataTable.pageSize"
        class="pagination-style"
        @pagination="searchList"
      />

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

    <!-- <no-data v-else></no-data> -->
  </div>
</template>

<script>
import "./tableConfigure.scss";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
// import NoData from "@/components/noData"; // 无数据时的显示
export default {
  name: "TableConfig",
  components: {
    Pagination
    // NoData
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
            radio: false,
            hasCenterCol: true,
            templateData: [], // 需要自定义的数据
            clearSelection: true,
            hasSelectable: false, // 复选框是否禁用
            tr: [
              // 表头数据 —— className:列的class名
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
            operation: {
              // 操作功能
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
            expands: [
              // 展开行数据
              // {
              //     id: '1',
              //     label: 'label',
              //     prop: 'prop'
              // }
            ],
            getSummaries(param) {
              // 自定义表位合计行数据
              // *** 此函数传入param参数
              // *** 最后返回一个数组，合计行会显示数组中的内容
              return [];
            },
            pageNum: 0,
            pageSize: 10,
            totalCount: 0,
            paginationShow: true // 是否需要分页
          };
        }
      }
    };
  },
  watch: {
    dataTable: "initTable"
  },
  created() {
    this.initTable(); // 表格初始化
  },
  computed: {
    // getStatus: function(val) {
    //   return val;
    //   // return this.table.operationSatatus[val];
    // }
  },
  mounted() {
    this.table = this.dataTable;
  },
  methods: {
    initTable() {
      // 表格初始化
      this.tableDataHandle();
      this.table = this.dataTable;
      // this.$emit('tableDataHandle')
    },
    getStatus(val) {
      return this.table.operationSatatus[val];
    },
    // 点击某一行时触发的函数
    rowClick(Row, Event, Column) {
      if (
        !Column ||
        Column.type === "selection" ||
        Column.columnKey === "operation" ||
        Column.type === "expand"
      ) {
        return;
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      };
      if (this.dataTable.clearSelection) {
        this.$refs.TlRlTable.toggleRowSelection(Row);
      }
      // this.dataTable.radio = 1
      // console.log(Row, data)
      this.$emit("onRowClick", data);
    },
    handleSelectionChange(val) {
      if (this.dataTable.hasRadio) {
        // 这个为了防止用户选了单选之后，多选触发
      } else {
        this.$emit("onHandleSelectionChange", val);
      }
    },
    onRowClick(data) {
      this.$emit("onRowClick", data);
    },
    handleSizeChange(val) {
      // size选择
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      // 页码选择
      this.$emit("handleCurrentChange", val);
    },
    handleOperation(a, b, id) {
      // 点了操作按钮触发的函数
      const data = this.table.operation.data;
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].id) {
          this.$emit(data[i].Fun, a, b);
        }
      }
    },
    searchList(data) {
      // data.offset = (data.page - 1) * 10
      // delete data.page
      // this.$emit('paginationData', data)
      let params = {
        // 这里转化成自己需要的key
        pageNum: data.page, // 当前页
        pageSize: data.limit // 每页多少数量
      };
      if ((data.page - 1) * data.limit > this.table.totalCount) {
        params.pageNum = 1;
      }
      this.$emit("paginationData", params);
    },
    getCurrentRow(index, data) {
      this.$emit("radioRow", data);
    },
    selectInit(row, index) {},
    clearSelection() {
      this.$refs.TlRlTable.clearSelection();
    },
    tableDataHandle() {
      // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr));
      handleTableData.forEach((item, index) => {
        // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName; // 表头名称
        item.id = item.fieldId; // 表头ID
        item.sortable = false; // 是否要排序
        item.prop = item.propName; // 这个是相应的显示字段
        if (Array.isArray(this.dataTable.templateData)) {
          // 先判断用户是不是传数组进来的，不是就不处理
          this.dataTable.templateData.map(items => {
            if (item.prop === items) {
              // 相同就让他自定义
              item.hasCenterCol = true;
              item.show = "template";
            }
          });
        }
        // item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left': 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      });
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData));
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = {
        // 表格的样式
        // textAlign: 'center',
        width: "100%"
      };
      // this.dataTable.headerCellStyle = { // 表头文字的样式
      //   textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      // }
      // 为了让组件重新渲染更新
      // this.$refs.tableConfig.domShow = false
      // this.$nextTick(() => {
      //   this.$refs.tableConfig.domShow = true
      // })
    },
    indexMethod(index) {
      // 索引
      let numberIndex = Number(index) + 1; // 从1开始
      if (numberIndex < 10) {
        numberIndex = "0" + numberIndex;
      }
      return numberIndex;
    }
  }
};
</script>

<style scoped>
</style>
