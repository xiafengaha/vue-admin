<template>
  <div>
    <el-row :gutter="16">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true" label-width="100px" style="overflow: hidden">
        <el-col :span="24" style="text-align: right">
          <el-button v-db-click type="primary" style="float: left" @click="routeGo">
            提现设置
          </el-button>
          <el-form-item>
            <el-select
              v-model="ruleForm.level_id"
              clearable
              placeholder="请选择状态">
              <el-option
                v-for="item in levelTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <date-picker ref="datePicker" @getStartTime="getStartTime" @getEndTime="getEndTime"/>
          </el-form-item>
          <el-form-item>
            <search-input></search-input>
          </el-form-item>
          <el-form-item>
            <el-button v-db-click type="primary" @click="clearAll">重 置</el-button>
          </el-form-item>
        </el-col>
        <!--<el-col :xl="22" :lg="24" :md="24" :sm="24" :xs="24" style="text-align: right">-->
        <!---->
        <!--</el-col>-->
        <!--</el-col>-->
        <el-col>

        </el-col>
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
      @sendRow="sendRow"
      @rejectRow="rejectRow"
      @paginationData="paginationData"
    >
      <template slot-scope="props" slot="avatar">
        <img
          v-preview="imgPrefix + props.obj.row.avatar"
          v-if="props.obj.row.avatar"
          :src="imgPrefix + props.obj.row.avatar"
          :alt="props.obj.row.realname"
          style="width: 100%;height: 100px"
          class="img-small"
          preview-title-enable="true"
          preview-nav-enable="true"
        >
      </template>
      <template slot-scope="props" slot="enabled">
        <el-tag :type="props.obj.row.enabled === 0 ? 'danger' : 'success'">
          <span>{{ props.obj.row.enabled | enabledFilter }}</span>
        </el-tag>
      </template>
      <template slot-scope="props" slot="member_level">
        <span>{{ props.obj.row.member_level | levelFilter }}</span>
      </template>
    </table-configure>
    <p>共提现 <span>N</span>次，总计 ¥ <span>89</span></p>
    <!--这里是发放的弹窗-->
    <el-dialog
      :title="sendRejectTitle"
      :visible.sync="sendRejectVisible"
      width="30%"
      >
      <div v-if="sendRejectTitle === '发放'" style="display: flex;flex-direction: column;align-items: center">
        <h3>上传发放奖金凭证截图!</h3>
        <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getSuccessUrl" @delImg="getDel"/>
      </div>
      <div v-else>
        <textarea name="" id="" style="width: 100%;height: 150px"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendRejectVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendRejectVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import searchInput from '@/components/search/index'
  import datePicker from '@/components/DatePicker/index'
  import tableConfigure from '@/components/table/tableConfig'
  import myUpload from '@/components/Upload/uploadBtn'
  // import { uploadGrouping } from '@/api/common'
  import { getSession } from '@/utils/auth'
  import { teamList } from '@/api/teamManage/list'
  import { wareGoodsList } from '@/api/memberManage/warehouseList'
  import imgPrefix from '@/utils/imgPrefix'
  export default {
    name: 'Cash',
    components: {
      tableConfigure,
      datePicker,
      searchInput,
      myUpload
    },
    filters: {
      enabledFilter(value) {
        if (value === 0) {
          return '禁用'
        } else {
          return '可用'
        }
      },
      levelFilter(value) { // 过滤类型
        let val = String(value)
        switch (val) {
          case '1':
            return '游客'
          case '100':
            return '注册会员'
          case '101':
            return '分公司'
          case '102':
            return '区域'
          case '103':
            return '官方'
          case '104':
            return '梦想'
          case '105':
            return '天使'
          default:
            return '暂无'
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
              fieldName: '所属团队',
              fieldId: 0,
              propName: 'group_name'
            },
            {
              fieldName: '申请人',
              fieldId: 1,
              propName: 'realname'
            },
            {
              fieldName: '手机号',
              fieldId: 2,
              propName: 'title'
            },
            {
              fieldName: '提现金额',
              fieldId: 3,
              propName: 'price'
            },
            {
              fieldName: '申请时间',
              fieldId: 4,
              propName: 'stock'
            },
            {
              fieldName: '提现状态',
              fieldId: 5,
              propName: 'updated_at'
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
                label: '发放',
                Fun: 'sendRow',
                type: 'text',
                size: 'mini',
                id: '0'
              },
              {
                label: '驳回',
                Fun: 'rejectRow',
                type: 'text',
                size: 'mini',
                id: '1'
              }
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
        sendRejectVisible: false,
        uploadData: {
          showList: false, // 文件列表是否显示
          uploadUrl: '', // active
          autoUpload: false, // 是否自动上传
          limit: 1, // 上传限制的数量
          listShow: true, // 自定义图片列表是否显示
          accept: 'image/jpeg,image/gif,image/png', // 文件上传格式
          multiple: false, // 是否多选
          listType: 'text', // 列表展示格式
          type: 2 // 2是图片，1是视频，3是音频
        },
        sendRejectTitle: '发放'
      }
    },
    created() {
      this.initSession() // 获取年龄和区域，权限
      this.initEnabled() // 获取状态
      this.searchList(this.ruleForm)
    },
    methods: {
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
        // wareGoodsList(data).then(res => {
        // console.log(res, 'res')
        this.dataTable.data = [{
          'id': 1,
          'merchant_id': 1,
          'shop_id': 1,
          'group_id': 0,
          'warehouse_id': 1,
          'member_id': 1,
          'goods_id': 2,
          'product_id': 0,
          'stock': 10, // 库存
          'created_at': '2018-11-26 10:39:05', // 创建时间
          'updated_at': '2018-11-26 10:39:09', // 修改时间
          'realname': '李丕长', // 经销商名称
          'price': '578.00', // 零售价
          'title': '大健康1号', // 商品名称
          'group_name': '悦盛生物团队'// 团队名称
        }
        ]
        this.dataTable._count = 1
        // this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        // this.dataTable._count = res.data._count
        // })
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
          if (item.prop === 'avatar' || item.prop === 'enabled' || item.prop === 'member_level') {
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
      sendRow(index, row) { // 发送
        // console.log(index, row, '编辑')
        this.sendRejectTitle = '发放'
        this.sendRejectVisible = true
      },
      rejectRow(index, row) { // 驳回
        this.sendRejectTitle = '驳回'
        this.sendRejectVisible = true
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
      },
      getSuccessUrl(data, list) {
        // this.ruleForm.icon = data[0].url
        // this.ruleForm.pre_img = data[0].url
      },
      getDel(data) {
        // this.ruleForm.pre_img = ''
        // this.ruleForm.icon = ''
      },
      routeGo() { // 路由跳转
        this.$router.push({
          path: '/finance/cashConfig'
        })
      }
    }
  }
</script>

<style scoped>

</style>
