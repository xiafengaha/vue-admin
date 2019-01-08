<template>
  <div>
    <el-row :gutter="16">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true" label-width="100px">
        <el-col :span="2">
          <el-button v-db-click type="primary">
            <a :href="'admin/wareGoodsOutPutLog.json?member_id=' + ruleForm.member_id + '&goods_id=' + ruleForm.goods_id " target="_blank">导出报表</a>
          </el-button>
        </el-col>
        <el-col :xl="22" :lg="24" :md="24" :sm="24" :xs="24" style="text-align: right">
          <el-form-item>
            <el-select
              v-loadmore="loadMore"
              v-model="ruleForm.group_id"
              clearable
              placeholder="请选择所属团队"
              @focus="initTeam(false)">
              <el-option
                v-for="item in teamData"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="ruleForm.level_id"
              clearable
              placeholder="请选择经销商">
              <el-option
                v-for="item in levelTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-db-click type="primary" style="margin-left: 20px" @click="clearAll">重置</el-button>
            <el-button v-db-click type="primary" style="margin-left: 20px;" @click="searchList(ruleForm)">搜索</el-button>
          </el-form-item>
        </el-col>
        <!--</el-col>-->
      </el-form>

      <!--<el-select-->
      <!--v-model="ruleForm.category"-->
      <!--clearable-->
      <!--placeholder="请选择所属团队">-->
      <!--<el-option-->
      <!--v-for="item in categoryTags"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value"/>-->
      <!--</el-select>-->

      <!--<search style="margin-left: 20px;" @searchList="searchList"/>-->
      <!--</el-col>-->
    </el-row>
    <table-configure
      v-if="tableConfig"
      ref="tableConfig"
      :data-table="dataTable"
      style="margin-top: 10px"
      @tableDataHandle="tableDataHandle"
      @paginationData="paginationData"
    >
      <template slot-scope="props" slot="type">
        <span>{{ props.obj.row.type | typeFilter }}</span>
      </template>
    </table-configure>
  </div>

</template>

<script>
import searchInput from '@/components/search/index'
import datePicker from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfig'
// import { uploadGrouping } from '@/api/common'
import { getSession } from '@/utils/auth'
import { teamList } from '@/api/teamManage/list'
import { wareGoodsLog } from '@/api/memberManage/warehouseList'
import imgPrefix from '@/utils/imgPrefix'
export default {
  name: 'Detail',
  components: {
    tableConfigure,
    datePicker,
    searchInput
  },
  filters: {
    typeFilter(value) {
      value = String(value)
      if (value === '1') {
        return '补货'
      } else if (value === '2') {
        return '划拨'
      } else {
        return '提货'
      }
    }
  },
  data() {
    return {
      ruleForm: {
        offset: 0,
        limit: 10
      }, // 搜索form
      rules: {},
      enabledType: [], // 场景标签
      levelTags: [], // 开放权限标签
      tableConfig: true,
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '变更类型',
            fieldId: 0,
            propName: 'type'
          },
          {
            fieldName: '变更时间',
            fieldId: 1,
            propName: 'created_at'
          },
          {
            fieldName: '关联单号',
            fieldId: 2,
            propName: 'order_sn'
          },
          {
            fieldName: '数量',
            fieldId: 3,
            propName: 'stock'
          },
          {
            fieldName: '结余库存',
            fieldId: 4,
            propName: 'stock_balance'
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
            // {
            //   label: '编辑',
            //   Fun: 'editorRow',
            //   type: 'text',
            //   size: 'mini',
            //   id: '0',
            //   name: 'member.edit'
            // },
            // {
            //   label: '查看',
            //   Fun: 'detailRow',
            //   type: 'text',
            //   size: 'mini',
            //   id: '1',
            //   name: 'member.detail'
            // }
          ]
        }
      },
      imgPrefix: imgPrefix,
      teamPageData: { // 团队列表请求数据
        offset: 0,
        limit: 10
      },
      teamData: [], // 团队数据
      teamLoadMore: true,
      memberId: ''
    }
  },
  created() {
    this.initSession() // 获取年龄和区域，权限
    this.initEnabled() // 获取状态
    this.initRouteData()
  },
  methods: {
    initRouteData() { // 获取路由参数
      let routeData = this.$route.query
      if (!this.isEmptyObject(routeData)) { // 非空对象
        this.ruleForm.member_id = routeData.member_id
        this.ruleForm.goods_id = routeData.goods_id
      }
      this.searchList(this.ruleForm)
    },
    isEmptyObject(obj) { // 是否是空对象
      for (var key in obj) {
        return false
      }
      return true
    },
    initTeam(type) { // 获取团队列表
      let oldData = JSON.parse(JSON.stringify(this.teamPageData)) // 旧数据
      teamList(this.teamPageData).then(res => {
        // console.log(res, 'res')
        type
          ? this.teamData = oldData.concat(res.data.data)
          : this.teamData = JSON.parse(JSON.stringify(res.data.data))
        if (res.data._count === this.teamData.length) { // 相同就没必要在加载更多了
          this.teamLoadMore = false
        } else {
          this.teamLoadMore = true
        }
      })
    },
    searchList(data) {
      wareGoodsLog(data).then(res => {
        // console.log(res, 'res')
        // this.dataTable.data = [
        //   {
        //     'id': 1,
        //     'member_id': 1, // 会员ID
        //     'goods_id': 2, // 商品ID
        //     'product_id': 0,
        //     'stock': 10, // 库存变化数量
        //     'stock_balance': 18, // 操作后库存剩余数量
        //     'type': 1, // 1 补货 2 划拨 3 提货
        //     'created_at': '2018-12-21 10:11:34', // 创建日期
        //     'order_id': 1, // 订单ID
        //     'order_sn': 'D12312312131313123' // 订单号
        //   }
        // ]
        // this.dataTable._count = 1
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        this.dataTable._count = res.data._count
      })
    },
    initList() {
      let params = {
        limit: 10,
        offset: 0
      }
      this.searchList(params)
    },
    initEnabled() { // 初始化启用禁用
      let storeEnabled = this.$store.state.fixed.MEMBER_ENABLED
      this.enabledType = JSON.parse(JSON.stringify(storeEnabled))
      // console.log(this.addSexTags)
    },
    initSession() {
      let sessionData = JSON.parse(getSession('userInfo'))
      let sessionLevel = sessionData.constant.level // 权限数据
      for (let item in sessionLevel) {
        this.levelTags.push(
          {
            label: sessionLevel[item],
            value: item
          })
      }
    },
    loadMore() { // 下拉加载更多
      this.teamPageData.offset += 10
      if (this.teamLoadMore) {
        this.initTeam(true)
      }
    },
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop === 'type') {
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
    editorRow(index, row) { // 编辑
      // console.log(index, row, '编辑')
      this.$router.push({
        path: '/member/addMember',
        query: {
          id: row.id
        }
      })
    },
    paginationData(data) { // 分页功能
      // console.log(data)
      let params = {
        offset: data.offset,
        limit: data.limit
      }
      this.searchList(params)
    },
    clickRelease() { // 切换到发布页面
      this.$router.push({ path: '/member/addMember' })
    },
    clearAll() {
      this.ruleForm = {
        offset: 0,
        limit: 10
      }
    },
    searchData(data) {
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(data)) {
        this.ruleForm.username = ''
        this.ruleForm.realname = data
      } else {
        this.ruleForm.realname = ''
        this.ruleForm.username = data
      }
    },
    getStartTime(data) { // 得到开始时间
      // console.log(data, 'start')
      this.ruleForm.created_at_start = data
    },
    getEndTime(data) { // 得到结束时间
      // console.log(data, 'end')
      this.ruleForm.created_at_end = data
    }
  }
}
</script>

<style scoped>

</style>
