<template>
  <el-card>
    <el-row :gutter="16">
      <el-col :span="24">
        <table-configure
          v-if="tableConfig"
          ref="tableConfig"
          :data-table="dataTable"
          style="margin-top: 10px"
          @tableDataHandle="tableDataHandle"
          @editorRow="editorRow"
        >
        </table-configure>
      </el-col>
    </el-row>
    <el-dialog
      title="【奖励政策】"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <table-configure
        ref="tableReward"
        :data-table="rewardTable"
        style="margin-top: 10px"
        @tableDataHandle="tableDataHandleReward"
        @editorRow="editorRowReward"
        @delRow="delRowReward"
      >
      </table-configure>
      <el-button type="text" v-db-click @click="addGoods">添加商品</el-button>
      <!--添加商品的弹窗-->
      <el-dialog
        :visible.sync="addGoodsVisible"
        width="30%"
        append-to-body
      >
        <table-reward :parent-data="rewardGoodsData" @addChildData="addChildData">
        </table-reward>
      </el-dialog>
      <!--设置奖励弹窗-->
      <el-dialog
        :visible.sync="configVisible"
        width="30%"
        append-to-body
      >
        <el-row :gutter="16">
          <el-form label-width="100px" :model="ruleForm" ref="ruleForm">
            <el-col :span="24">
              <el-form-item label="直属奖励:">
                <el-input style="width: 194px" placeholder="请输入直属奖励" v-model="ruleForm.directlyprice"></el-input><span style="margin-left: 10px">元/盒</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="下属奖励:">
                <el-input style="width: 194px" placeholder="请输入下属奖励" v-model="ruleForm.underprice"></el-input><span style="margin-left: 10px">元/盒</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-button type="primary" v-db-click>确定</el-button>
            </el-col>
          </el-form>
        </el-row>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="dialogVisible = false">取 消</el-button>
        <el-button v-db-click type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import { levelList, levelGoods } from '@/api/reward/list'
  import tableConfigure from '@/components/table/tableConfig'
  import tableReward from './components/goodsConfig'
  export default {
    name: "list",
    components: {
      tableConfigure,
      tableReward
    },
    data() {
      return {
        ruleForm: {},
        dataTable: { // 表格配置
          tr: [
            {
              fieldName: '经销商名称',
              fieldId: 0,
              propName: 'name'
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
          paginationShow: false, // 是否需要分页
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
                label: '奖励政策',
                Fun: 'editorRow',
                type: 'text',
                size: 'mini',
                id: '0',
                name: 'member.edit'
              }
            ]
          }
        },
        rewardTable: {
          tr: [
            {
              fieldName: '商品名称',
              fieldId: 0,
              propName: 'title'
            },
            {
              fieldName: '商品零食价格',
              fieldId: 1,
              propName: 'price'
            },
            {
              fieldName: '直属奖励',
              fieldId: 2,
              propName: 'price_vip1'
            },
            {
              fieldName: '下属奖励',
              fieldId: 3,
              propName:'price_vip2'
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
                label: '删除',
                Fun: 'delRow',
                type: 'text',
                size: 'mini',
                id: '0'
              },
              {
                label: '设置',
                Fun: 'editorRow',
                type: 'text',
                size: 'mini',
                id: '1'
              }
            ]
          }
        },
        tableConfig: true,
        dialogVisible: false,
        addGoodsVisible: false,
        rewardGoodsData: [],
        configVisible: false // 奖励设置弹窗
      }
    },
    created() {
      this.initTable()
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
      tableDataHandleReward() {
        const handleTableData = JSON.parse(JSON.stringify(this.rewardTable.tr))
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
        this.rewardTable.tr = JSON.parse(JSON.stringify(handleTableData))
        // this.dataTable.hasSelect = false; // 是否多选
        // this.dataTable.hasExpand = false; // 是否展开
        // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
        // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
        this.rewardTable.tableStyle = { // 表格的样式
          // textAlign: 'center',
          width: '100%'
        }
        this.rewardTable.headerCellStyle = { // 表头文字的样式
          textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
        }
        // 为了让组件重新渲染更新
        // this.$refs.tableConfig.domShow = false
        // this.$nextTick(() => {
        //   this.$refs.tableConfig.domShow = true
        // })
      },
      paginationData(data) {
        // this.$emit('paginationData', data)
      },
      initTable() { // 初始化table数据
        levelList().then(res => {
          console.log(res, 'res')
          if (Array.isArray(res.data)) {
            this.dataTable.data = JSON.parse(JSON.stringify(res.data))
          } else {
            this.dataTable.data = []
          }
        })
      },
      editorRow(index, row) {
        console.log(index, row)
        this.dialogVisible = true
        this.initGoodsReward(row.level_id)
      },
      editorRowReward(index, data) {
        this.configVisible = true
        console.log(index, data)
        this.ruleForm = JSON.parse(JSON.stringify(data))
      },
      initGoodsReward(id) { // 初始化奖励商品列表
        levelGoods(id).then(res => {
          console.log(res, id)
          this.rewardTable.data = [
            {
              "id": 1,
              "level_id": 103,//当前等级
              "goods_id": 2,//商品ID
              "price_vip1": "8.00",//上级奖励N元每盒
              "price_vip2": "4.00",//上上级奖励N元每盒
              "price": "578.00",//商品零售价格
              "title": "大健康1号"//商品标题
            },
            {
              "id": 2,
              "level_id": 104,//当前等级
              "goods_id": 3,//商品ID
              "price_vip1": "1.00",//上级奖励N元每盒
              "price_vip2": "9.00",//上上级奖励N元每盒
              "price": "888.00",//商品零售价格
              "title": "大健康2号"//商品标题
            }
          ]
        })
      },
      addGoods() { // 添加商品
        this.addGoodsVisible = true
        this.initRewardGoods()
      },
      initRewardGoods() { // 奖励商品的添加列表
        this.rewardGoodsData = [
          {
            name: '榴莲',
            price: '99',
            add: 0 // 0是没有添加
          },
          {
            name: '芒果',
            price: '69',
            add: 1 // 0是没有添加1是已添加
          }
        ]
      },
      delRowReward(index, data) { // 删除奖励政策table
        this.rewardTable.data.splice(index, 1)
      },
      addChildData(row) {
        this.rewardTable.data.splice(0, 0, row)
        this.addGoodsVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
