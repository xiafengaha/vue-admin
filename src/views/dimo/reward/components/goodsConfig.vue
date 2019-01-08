<template>
  <el-row :gutter="16">
    <el-col :span="24">
      <table-configure
        v-if="tableConfig"
        ref="tableConfig"
        :data-table="dataTable"
        @tableDataHandle="tableDataHandle"
        @paginationData="paginationData"
      >
        <template slot-scope="props" slot="add">
          <el-button v-db-click type="text" @click="addChildGoods(props.obj.row)" :disabled="props.obj.row.add ? true : false">
            {{ props.obj.row.add ? '已添加' : '添加' }}
          </el-button>
        </template>
      </table-configure>
    </el-col>
  </el-row>
</template>

<script>
  import tableConfigure from '@/components/table/tableConfig'
  export default {
    name: "goodsConfig",
    components: {
      tableConfigure
    },
    props: {
      parentData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tableConfig: true,
        dataTable: {
          tr: [
            {
              fieldName: '商品名称',
              fieldId: 0,
              propName: 'name'
            },
            {
              fieldName: '商品零食价格',
              fieldId: 1,
              propName: 'price',
              width: '150px'
            },
            {
              fieldName: '操作',
              fieldId: 2,
              propName: 'add',
              width: '200px'
            }
          ], // 表头数据
          data: [], // 表格内容数据
          hasSelect: false, // 有无选中功能
          maxHeight: null, // 表格最大高度
          height: null, // 表格高度。
          border: true,
          offset: 0,
          limit: 10,
          _count: 0,
          paginationShow: true, // 是否需要分页
          paginationStyle: {
            textAlign: 'right', // 靠右还是左
            marginTop: '10px'
          },
          hasOperation: false, // 有无操作功能
          operation: { // 操作功能
            label: '操作',
            width: '200',
            data: [
              {
                label: '设置',
                Fun: 'editorRow',
                type: 'text',
                size: 'mini',
                id: '00',
                name: 'protocol.edit'
              }
            ]
          },
          tablePageData: {
            offset: 0,
            limit: 10
          }
        }
      }
    },
    created() {
      this.initData()
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
          // console.log(item, 'item')
          if (item.prop === 'add') {
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
      paginationData(data) {
        console.log(data, 'data')
      },
      initData() { //获取数据
        this.dataTable.data = JSON.parse(JSON.stringify(this.parentData))
      },
      addChildGoods(row) { //添加
        console.log(row, 'row')
        row.add = 1
        this.$emit('addChildData', row)
      }
    }
  }
</script>

<style scoped>

</style>
