<template>
  <!--<span>朋友圈</span>-->
  <div>
    <el-row :gutter="16">
      <el-col :span="2">
        <el-button v-db-click v-has="'school.add'" type="primary" @click="clickRelease">
          发布
        </el-button>
      </el-col>
      <el-col :span="22" style="text-align: right">
        <date-picker ref="datePicker" @getStartTime="getStartTime" @getEndTime="getEndTime"/>
        <el-select
          v-model="ruleForm.level"
          placeholder="请选择开放权限">
          <el-option
            v-for="item in levelTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <search-input ref="searchInput" @searchList="searchData"/>
        <el-button type="primary" style="margin-left: 20px;" @click="clearAll">重置</el-button>
        <!--<search style="margin-left: 20px;" @searchList="searchList"/>-->
      </el-col>
    </el-row>
    <table-configure
      v-if="tableConfig"
      ref="tableConfig"
      :data-table="dataTable"
      style="margin-top: 10px"
      @tableDataHandle="tableDataHandle"
      @editorRow="editorRow"
      @delRow="delRow"
      @paginationData="paginationData"
    >
      <template slot-scope="props" slot="img">
        <!--<img src="" alt="">-->
        <div v-if="props.obj.row.type === 2">
          <!--<div v-for="(item, indexs) in props.obj.row.img" :key="item.id">-->
          <!--<img-->
          <!--v-preview="imgPrefix + item"-->
          <!--v-show="indexs === 0"-->
          <!--:src="imgPrefix + item"-->
          <!--:alt="props.obj.row.goods_title"-->
          <!--style="width: 100%;height: 100px"-->
          <!--class="img-small"-->
          <!--preview-title-enable="true"-->
          <!--preview-nav-enable="true"-->
          <!--&gt;-->
          <audio :src="imgPrefix + props.obj.row.url" style="width: 100%" controls/>
          <!--</div>-->
        </div>
        <div v-else-if="props.obj.row.type === 1">
          <video :src="imgPrefix + props.obj.row.url" :poster="imgPrefix + props.obj.row.img + '?x-oss-process=image/resize,h_100'" style="width: 100%;height: 100px" controls/>
        </div>
        <!--<span v-if="props.obj.row.roles.length !== 0">{{ props.obj.row.roles[0].name }}</span>-->
      </template>
      <template slot-scope="props" slot="category">
        <span>{{ props.obj.row.category | categoryFilter }}</span>
      </template>
      <template slot-scope="props" slot="type">
        <span>{{ props.obj.row.type | typeFilter }}</span>
      </template>
    </table-configure>
  </div>

</template>

<script>
import datePicker from '@/components/DatePicker/index'
import tableConfigure from '@/components/table/tableConfig'
import searchInput from '@/components/search/index'
import { getSession } from '@/utils/auth'
import { hotList, hotDel } from '@/api/contentManage/school/hot'
import imgPrefix from '@/utils/imgPrefix'
export default {
  name: 'Common',
  components: {
    tableConfigure,
    datePicker,
    searchInput
  },
  filters: {
    categoryFilter(value) {
      if (value === 1) {
        return '商品推荐'
      } else if (value === 2) {
        return '新手招募'
      } else {
        return '每日心语'
      }
    },
    typeFilter(value) { // 过滤类型
      if (value === 1) {
        return '视频'
      } else if (value === 2) {
        return '图片'
      } else {
        return '音频'
      }
    },
    levelFilter(value) {
      // let newArr = []
      // value.forEach(item => {
      //   if (item.value === Number()) {
      //
      //   }
      // })
    }
  },
  props: {
    collegeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      ruleForm: {
        offset: 0,
        limit: 10,
        college_id: this.collegeId
      }, // 搜索form
      sceneTags: [], // 场景标签
      sexTags: [], // 性别标签
      areaTags: [], // 地区标签
      ageTags: [], // 年龄标签
      categoryTags: [], // 素材类型标签
      levelTags: [], // 开放权限标签
      catList: { // 场景标签的请求数据
        offset: 0,
        limit: 10
      },
      tableConfig: true,
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '预览图',
            fieldId: 0,
            propName: 'img'
          },
          {
            fieldName: '标题',
            fieldId: 1,
            propName: 'title'
          },
          {
            fieldName: '简介',
            fieldId: 2,
            propName: 'des'
          },
          {
            fieldName: '开放权限',
            fieldId: 3,
            propName: 'rights_name'
          },
          {
            fieldName: '发布人',
            fieldId: 5,
            propName: 'manipulator'
          },
          {
            fieldName: '发布时间',
            fieldId: 6,
            propName: 'created_at'
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
              id: '0',
              name: 'school.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'school.del'
            }
          ]
        }
      },
      imgPrefix: imgPrefix
    }
  },
  created() {
    this.initSession() // 获取年龄和区域，权限
    this.searchList(this.ruleForm)
  },
  methods: {
    searchList(data) {
      hotList(data).then(res => {
        // console.log(res, 'res')
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
    initSession() {
      let sessionData = JSON.parse(getSession('userInfo'))
      // let sessionAge = sessionData.constant.age // 年龄数据
      // let sessionArea = sessionData.constant.location // 区域数据
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

    },
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop === 'img' || item.prop === 'category' || item.prop === 'type') {
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
        path: '/content/school/schoolRelease',
        query: {
          id: row.id,
          college_id: this.collegeId
        }
      })
    },
    delRow(index, row) { // 删除
      // 删除
      this.$confirm('此操作将永久删除该课程(' + row.title + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delApi(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delApi(id) {
      hotDel(id).then(res => {
        this.$message.success('删除成功')
        this.initList()
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
      this.$router.push({ path: '/content/school/schoolRelease', query: { college_id: this.collegeId }})
    },
    searchData(data) { // 用户点了搜索
      // console.log(data, 'search')
      this.ruleForm.keywords = data
      this.searchList(this.ruleForm)
    },
    getStartTime(data) {
      this.isdate(data) ? this.ruleForm.startDate = data : this.ruleForm.startDate = ''
    },
    getEndTime(data) {
      this.isdate(data) ? this.ruleForm.endDate = data : this.ruleForm.endDate = ''
    },
    isdate(str) { // 判断是否是有效日期
      var result = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (result == null) return false
      var d = new Date(result[1], result[3] - 1, result[4])
      return (d.getFullYear() == result[1] && d.getMonth() + 1 == result[3] && d.getDate() == result[4])
    },
    clearAll() {
      this.ruleForm = {
        offset: 0,
        limit: 10,
        college_id: this.collegeId
      }
      this.$refs.datePicker.resetTime()
      this.$refs.searchInput.clearInput()
    }
  }
}
</script>

<style scoped>

</style>
