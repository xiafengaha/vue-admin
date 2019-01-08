<template>
  <el-card class="grade-box">
    <el-row :gutter="16">
      <!--<el-col :span="24">-->
        <!--<el-button v-db-click type="primary" @click="addGrade">新增等级</el-button>-->
      <!--</el-col>-->
      <el-col :span="24">
        <table-configure
          v-if="tableConfig"
          ref="tableConfig"
          :data-table="dataTable"
          @tableDataHandle="tableDataHandle"
          @editorRow="editorRow"
        />
        <!--@editorRow="editorRow"-->
        <!--@delRow="delRow"-->
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogGradeTitle + '等级'"
      :visible.sync="dialogVisibleGrade"
      width="30%"
      @open="handleOpen">
      <el-row>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="rule-form">
          <el-col :span="24">
            <el-form-item label="等级名称:">
              <el-input disabled placeholder="等级名称" v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="升级条件:">
              <el-button type="text" v-db-click @click="addGoods">添加商品</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label=" ">
              <el-col :span="24" v-for="(item, index) in userNewConfig" :key="'0' + index">
                {{item}}
              </el-col>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-dialog
        width="50%"
        title="选择商品"
        append-to-body
        :visible.sync="changeGoodsVisible"
      >
        <goods-list v-if="goodsListShow" :parent-data="levelData" :parent-row="ruleForm" ref="goodsTable" @paginationData="paginationData" @inputSearch="inputSearch"></goods-list>
        <div slot="footer" class="dialog-footer">
          <el-button v-db-click @click="changeGoodsVisible = false">取 消</el-button>
          <el-button v-db-click type="primary"  @click="getUserChangeGoods" >确 定</el-button>
        </div>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="dialogVisibleGrade = false">取 消</el-button>
        <el-button v-db-click type="primary" @click="updateLevel">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import './style/list.less'
  import tableConfigure from '@/components/table/tableConfig'
  import { gradeList, gradeSetting, goodsLevel } from '@/api/memberManage/grade'
  import  goodsList from './components/goodsList'
  export default {
    name: 'Index',
    components: {
      tableConfigure,
      goodsList
    },
    data() {
      return {
        tableConfig: true,
        dataTable: {
          tr: [
            {
              fieldName: '经销商名称 ',
              fieldId: 0,
              propName: 'name'
            },
            {
              fieldName: '单笔成交额',
              fieldId: 1,
              propName: 'money'
            },
            {
              fieldName: '团队人数',
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
                label: '设置',
                Fun: 'editorRow',
                type: 'text',
                size: 'mini',
                id: '00'
              }
            ]
          },
          tablePageData: {
            offset: 0,
            limit: 10
          }
        },
        dialogGradeTitle: '新增',
        dialogVisibleGrade: false,
        ruleForm: {},
        levelPagination: {
          offset: 0,
          limit: 10
        },
        rules: {},
        conditionRadio: null,
        changeGoodsVisible: false,
        levelData: {}, // 等级设置商品列表总数据
        userNewConfig: [],
        goodsListShow: true // 商品表格组件显示隐藏
      }
    },
    created() {
      this.initList(this.tablePageData)
    },
    methods: {
      // changeRouter() {
      //   this.initList(this.tablePageData)
      // },
      inputSearch(data) {
        this.levelPagination.title = data
        this.getGoodsLevel()
      },
      initList() {
        gradeList().then(res => {
          // console.log(res, 'res123')
          this.dataTable.data = JSON.parse(JSON.stringify(res.data))
          // this.dataTable._count = res.data._count
        })
      },
      addNewPage() {
        this.$router.push({
          path: '/content/rich'
        })
      },
      paginationData(data) {
        // this.levelPagination.offset =
        this.levelPagination = JSON.parse(JSON.stringify(data))
        // console.log(data, 'data')
        this.getGoodsLevel()
      },
      editorRow(index, row) {
        this.dialogGradeTitle = '修改'
        this.dialogVisibleGrade = true
        this.ruleForm = JSON.parse(JSON.stringify(row))

        // this.getUserChangeGoods()
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
      },
      handleOpen() { // 弹窗的open事件
        // console.log('123')
        // this.$refs.goodsTable.changeGoods = JSON.parse(JSON.stringify(this.ruleForm.goods_package))
        this.childHandleData()
      },
      addGoods() {
        this.getGoodsLevel()
      },
      getGoodsLevel() { // 获取等级设置商品列表
        let params = {
          id: this.ruleForm.level_id
        }
        params = Object.assign({}, params, this.levelPagination)
        goodsLevel(params).then(res => {
          this.levelData = JSON.parse(JSON.stringify(res.data))
          console.log(this.levelData, 'levelData')
          this.changeGoodsVisible = true
          // this.goodsListShow = false
          // this.$nextTick(() => {
          //   this.goodsListShow = true
          // })
        })
      },
      getUserChangeGoods() { // 得到用户设置的商品
        this.ruleForm.goods_package = JSON.parse(JSON.stringify(this.$refs.goodsTable.changeGoods))
        this.ruleForm.goods_info = JSON.parse(JSON.stringify(this.$refs.goodsTable.changeGoodsData))
        this.childHandleData()
        this.changeGoodsVisible = false
      },
      updateLevel() { // 修改等级确定按钮
        gradeSetting({data: this.dataTable.data}).then(res => {
          // console.log(res, 'ressdasa')
          this.$message.success('修改成功')
          this.dialogVisibleGrade = false
          this.initList()
        })
      },
      childHandleData() {
        let userConfigId = JSON.parse(JSON.stringify(this.ruleForm.goods_package))
        let userConfigName = JSON.parse(JSON.stringify(this.ruleForm.goods_info))
        let newConfig = []
        for (let item in userConfigId) {
          newConfig.splice(0, 0, userConfigName[item] + ':' + userConfigId[item])
        }
        this.userNewConfig = JSON.parse(JSON.stringify(newConfig))
        this.dataTable.data.forEach(item => {
          if (item.level_id === this.ruleForm.level_id) {
            item.goods_package = JSON.parse(JSON.stringify(userConfigId))
            item.goods_info = JSON.parse(JSON.stringify(userConfigName))
            return false
          }
        })
        // console.log(newConfig, 'newConfig')
      }
    }
  }
</script>

<style scoped lang="less">

</style>
