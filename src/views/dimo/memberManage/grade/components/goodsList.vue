<template>
    <el-row :gutter="16">
      <el-col :span="24">
        <search-input ref="searchInput" @searchList="inputSearchList"/>
      </el-col>
      <el-col :span="24" style="margin-top: 10px">
        <table-configure
          v-if="tableConfig"
          ref="tableConfig"
          :data-table="dataTable"
          @tableDataHandle="tableDataHandle"
          @paginationData="paginationData"
        >
          <template slot-scope="props" slot="quantity">
            <!--123-->
            <!--{{props.obj.row.quantity}}-->
            <el-input placeholder="请输入正整数" type='text' @keyup.native="userInput(props.obj.row)" v-model="props.obj.row.quantity"></el-input>
          </template>
          <template slot-scope="props" slot="is_selected">
            <el-switch
              @change="switchType(props.obj.row)"
              v-model="props.obj.row.is_selected"
              active-text="确定"
              inactive-text="取消">
            </el-switch>
          </template>
        </table-configure>
        <!--@editorRow="editorRow"-->
        <!--@delRow="delRow"-->
      </el-col>
    </el-row>
</template>
<script>
  import searchInput from '@/components/search/index'
  import tableConfigure from '@/components/table/tableConfig'
  export default {
    name: "goodsList",
    components: {
      searchInput,
      tableConfigure
    },
    props: {
      parentData: {
        type: Object,
        required: true
      },
      parentRow: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        tableConfig: true,
        dataTable: {
          tr: [
            {
              fieldName: '商品 ',
              fieldId: 0,
              propName: 'title'
            },
            {
              fieldName: '数量',
              fieldId: 1,
              propName: 'quantity',
              width: '150px'
            },
            {
              fieldName: '操作',
              fieldId: 2,
              propName: 'is_selected',
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
        },
        changeGoods: {}, //这个是用户选择的商品
        changeGoodsData: {} // 这个是用户选择的商品的名字
      }
    },
    created() {
      this.goodsList()
      // 这个为了让子组件可以修改父组件的数据
      this.changeGoods = JSON.parse(JSON.stringify(this.parentRow.goods_package))
      this.changeGoodsData = JSON.parse(JSON.stringify(this.parentRow.goods_info))
    },
    watch: {
      'parentData': 'goodsList'
    },
    methods: {
      inputSearchList(data) {
        // this.$emit('')
        this.$emit('inputSearch', data)
      },
      paginationData(data) {
        this.$emit('paginationData', data)
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
          if (item.prop === 'is_selected' || item.prop === 'quantity') {
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
      goodsList() { //商品列表
        // console.log(this.parentData, '123')
        this.dataTable.data = JSON.parse(JSON.stringify(this.parentData.data))
        this.dataTable.data.forEach(item => {
          item.is_selected = item.is_selected ? true : false
        })
        this.dataTable._count = this.parentData._count
      },
      switchType(row) {
        if (row.is_selected) { // true存数量和名字
          this.changeGoods[row.id] = Number(row.quantity)
          this.changeGoodsData[row.id] = row.title
          // this.changeGoodsRow.splice(0,0, row)
        } else { //false就删除对应存在的数据
          for(let item in this.changeGoods) {
            if (item === String(row.id)) {
              delete this.changeGoods[item]
              delete this.changeGoodsData[item]
              // this.changeGoodsRow.splice()
            }
          }
        }
        console.log(this.changeGoods, 'this.changeGoods')
      },
      userInput(row) {
        let reg = /[^\d]+/g
        if (!reg.test(row.quantity)) { //这里面是输入正整数的
          if (row.is_selected) { //这里是先操作了在输入数量
            for(let item in this.changeGoods) {
              if (item === String(row.id)) {
                this.changeGoods[item] = Number(row.quantity)
              }
            }
          }// else不管
        } else { // 不是正整数
          // this.$message.warning('请输入正整数')
          row.quantity = row.quantity.replace(/[^\d]+/g, '')
        }
      }
    }
  }
</script>

<style scoped>

</style>
