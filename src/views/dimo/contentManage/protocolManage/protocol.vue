<template>
  <!--<span>这是协议管理页面</span>-->
  <el-card>
    <el-row :gutter="16">
      <el-col :span="24">
        <el-button v-db-click v-has="'protocol.add'" type="primary" @click="addNewPage">新增页面</el-button>
      </el-col>
      <el-col :span="24" style="margin-top: 10px">
        <table-configure
          v-if="tableConfig"
          ref="tableConfig"
          :data-table="dataTable"
          @tableDataHandle="tableDataHandle"
          @editorRow="editorRow"
          @delRow="delRow"
          @paginationData="paginationData"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import tableConfigure from '@/components/table/tableConfig'
import { richList, richDel } from '@/api/contentManage/rich'
export default {
  name: 'Protocol',
  components: {
    tableConfigure
  },
  data() {
    return {
      tableConfig: true,
      dataTable: {
        tr: [
          {
            fieldName: '自定义页面名称 ',
            fieldId: 0,
            propName: 'title'
          },
          {
            fieldName: '创建时间',
            fieldId: 1,
            propName: 'updated_at'
          },
          {
            fieldName: '链接地址',
            fieldId: 2,
            propName: 'description'
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
        hasOperation: true, // 有无操作功能
        operation: { // 操作功能
          label: '操作',
          width: '200',
          data: [
            {
              label: '编辑',
              Fun: 'editorRow',
              type: 'text',
              size: 'mini',
              id: '00',
              name: 'protocol.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '01',
              name: 'protocol.del'
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
  watch: {
    '$route': 'changeRouter'
  },
  created() {
    this.initList(this.tablePageData)
  },
  methods: {
    changeRouter() {
      this.initList(this.tablePageData)
    },
    initList(data) {
      richList(data).then(res => {
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        this.dataTable._count = res.data._count
      })
    },
    addNewPage() {
      this.$router.push({
        path: '/content/rich'
      })
    },
    paginationData(data) {
      console.log(data, 'paginationData')
    },
    editorRow(index, row) {
      // console.log(row, row.id)
      this.$router.push({
        path: '/content/rich',
        query: {
          id: row.id
        }
      })
    },
    delRow(index, row) {
      this.$confirm('此操作将永久删除该协议(' + row.title + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.delAddressList(row.id)
        this.delApi(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delApi(id) {
      richDel(id).then(res => {
        this.$message.success('删除成功')
        this.initList(this.tablePageData)
      })
    },
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        item.index = index
        // console.log(item, 'item')
        // if (item.prop === 'province_name' || item.prop === 'is_default') {
        //   item.hasCenterCol = true
        //   item.show = 'template'
        // }
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
        textAlign: 'center',
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
    }
  }
}
</script>

<style scoped>

</style>
