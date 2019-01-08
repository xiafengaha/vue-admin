<template>
  <div class="dashboard-editor-container">
    <!--<github-corner style="position: absolute; top: 0px; border: 0; right: 0;"/>-->
    <el-row :gutter="16">
      <el-col :span="24">
        <h3>自定义table</h3>
        <table-configure
          v-if="tableConfig"
          ref="tableConfig"
          :data-table="dataTable"
          style="margin-top: 10px"
          @tableDataHandle="tableDataHandle"
          @editorRow="editorRow"
        >
          <template slot-scope="props" slot="type">
            <el-tag :type="props.obj.row.type ? 'danger' : 'success'">
              {{props.obj.row.type | typeFilter}}
            </el-tag>
          </template>
        </table-configure>
      </el-col>
      <el-col :span="24">
        <h3>自定义树形table</h3>
        <tree-table :tree-data="treeTableData" border>
          <template slot-scope="props" slot="type">
            <el-tag v-if="props.obj.row.children" :type="props.obj.row.type ? 'danger' : 'success'">
              {{props.obj.row.type | typeFilter}}
            </el-tag>
          </template>
        </tree-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tableConfigure from '@/components/table/tableConfig'
import treeTable from '@/components/TreeTable'
export default {
  name: 'DashboardAdmin',
  components: {
    tableConfigure,
    treeTable
  },
  filters: {
    typeFilter(val) {
      switch (val) {
        case 0:
          return '待支付'
        case 1:
          return '已支付'
      }
    }
  },
  data() {
    return {
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '商品名称', // 这个是表头
            fieldId: 0, // 随意，不要重复就可以
            propName: 'name' // 这个是字段显示的key
          },
          {
            fieldName: '商品数量',
            fieldId: 1,
            propName: 'number',
            width: 100
          },
          {
            fieldName: '商品状态',
            fieldId: 2,
            propName: 'type',
            width: 150
          }
        ], // 表头数据
        data: [
          {
            name: 'Mac',
            number: 99,
            type: 0
          },
          {
            name: 'iphone',
            number: 998,
            type: 1
          }
        ], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        offset: 0,
        limit: 10,
        _count: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        hasOperation: true, // 有无操作功能
        operation: { // 操作功能
          label: '操作',
          width: '200px',
          data: [
            {
              label: '编辑', // 按钮名字
              Fun: 'editorRow', // 按钮方法
              type: 'text', // 按钮类型
              size: 'mini', // 按钮尺寸
              id: '0', // 按钮ID
              name: 'member.edit' // 这个是按钮权限
            }
          ]
        }
      }, // 自定义表格的数据
      tableConfig: true, // 组件是否重新加载
      treeTableData: {
        columns: [
          {
            text: '商品名称', //表头显示字段
            value: 'name', // 显示key
            show: false // 是否用自定义slot
          },
          {
            text: '数量',
            width: 150,
            value: 'number'
          },
          {
            text: '状态',
            width: 150,
            show: true,
            value: 'type'
          }
        ],
        data: [
          {
            name: 'Mac',
            number: 99,
            type: 0,
            children: [
              {
                name: 'Mac1',
                number: 100
              }
            ]
          },
          {
            name: 'iphone',
            number: 998,
            type: 1
          }
        ], // 表格内容数据
        offset: 0,
        limit: 10,
        _count: 0,
        paginationShow: false, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        hasOperation: true, // 有无操作功能
        operation: {
          label: '操作',
          width: '200',
          data: [
            {
              label: '详情',
              Fun: 'detailRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'goods.edit'
            }
          ]
        }
      }
    }
  },
  methods: {
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        item.index = index
        if (item.prop === 'type') { // 这里是是否用自定义slot显示
          item.hasCenterCol = true
          item.show = 'template'
        }
        // item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left': 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      })
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        // textAlign: 'center',
        width: '100%'
      }
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // 为了让组件重新渲染更新
      // this.$refs.tableConfig.domShow = false
      // this.$nextTick(() => {
      //   this.$refs.tableConfig.domShow = true
      // })
    },
    editorRow(index, data) {

    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
