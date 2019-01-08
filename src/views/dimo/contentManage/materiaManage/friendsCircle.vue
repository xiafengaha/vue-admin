<template>
  <!--<span>朋友圈</span>-->
  <div>
    <el-row :gutter="16">
      <el-col :span="2">
        <el-button v-db-click v-has="'friends.add'" type="primary" @click="clickRelease">
          发布
        </el-button>
      </el-col>
      <el-col :span="20" :offset="2" style="text-align: right">
        <el-select
          v-model="ruleForm.category"
          clearable
          placeholder="请选择素材归类">
          <el-option
            v-for="item in categoryTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select
          v-loadmore="loadMore"
          v-model="ruleForm.tag"
          clearable
          placeholder="请选择场景标签"
          @focus="initCatTags(false)">
          <el-option
            v-for="item in sceneTags"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
        <el-select
          v-model="ruleForm.level"
          clearable
          placeholder="请选择开放权限">
          <el-option
            v-for="item in levelTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select
          v-model="ruleForm.sexy"
          clearable
          placeholder="请选择性别属性">
          <el-option
            v-for="item in sexTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select
          v-model="ruleForm.location"
          clearable
          placeholder="请选择地区属性">
          <el-option
            v-for="item in areaTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select
          v-model="ruleForm.age"
          clearable
          placeholder="请选择年龄属性">
          <el-option
            v-for="item in ageTags"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-button type="primary" style="margin-left: 20px" @click="clearAll">重置</el-button>
        <el-button type="primary" style="margin-left: 20px;" @click="searchList(ruleForm)">搜索</el-button>
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
          <div v-for="(item, indexs) in props.obj.row.img" :key="item.id">
            <img
              v-preview="imgPrefix + item"
              v-show="indexs === 0"
              :src="imgPrefix + item"
              :alt="props.obj.row.goods_title"
              style="width: 100%;height: 100px"
              class="img-small"
              preview-title-enable="true"
              preview-nav-enable="true"
            >
          </div>
        </div>
        <div v-else>
          <video :src="imgPrefix + props.obj.row.video" :preload="imgPrefix + props.obj.row.video_img + '?x-oss-process=image/resize,h_100'" style="width: 100%;height: 100px" controls/>
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
import tableConfigure from '@/components/table/tableConfig'
import { uploadGrouping } from '@/api/common'
import { getSession } from '@/utils/auth'
import { friendsList, friendsDel } from '@/api/contentManage/friends'
import imgPrefix from '@/utils/imgPrefix'
export default {
  name: 'FriendsCircle',
  components: {
    tableConfigure
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
    }
  },
  data() {
    return {
      ruleForm: {
        offset: 0,
        limit: 10
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
            fieldName: '素材名称',
            fieldId: 1,
            propName: 'share_title'
          },
          {
            fieldName: '栏目归属',
            fieldId: 2,
            propName: 'category'
          },
          {
            fieldName: '类型',
            fieldId: 3,
            propName: 'type'
          },
          {
            fieldName: '开放权限',
            fieldId: 4,
            propName: 'levelName'
          },
          {
            fieldName: '发布人',
            fieldId: 5,
            propName: 'realname'
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
              name: 'friends.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'friends.del'
            }
          ]
        }
      },
      imgPrefix: imgPrefix,
      cancelLoadMore: true // 是否需要加载更多
    }
  },
  created() {
    this.initSession() // 获取年龄和区域，权限
    // this.initCatTags() // 初始化素材分组
    this.initSex() // 性别
    this.initType() // 素材分类
    this.searchList(this.ruleForm)
  },
  methods: {
    searchList(data) {
      friendsList(data).then(res => {
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
    initType() { //  获取素材类型
      let storeType = this.$store.state.user.type
      this.categoryTags = JSON.parse(JSON.stringify(storeType))
    },
    initCatTags(type) { // 初始化素材分组
      let oldData = JSON.parse(JSON.stringify(this.sceneTags)) // 旧数据
      uploadGrouping(this.catList).then(res => {
        // console.log(res, 'res')
        // this.sceneTags = JSON.parse(JSON.stringify(res.data.data))
        type // 需要累加
          ? this.sceneTags = oldData.concat(res.data.data)
          : this.sceneTags = JSON.parse(JSON.stringify(res.data.data))
        if (res.data._count === this.sceneTags.length) { // 相同就没必要在加载更多了
          this.cancelLoadMore = false
        } else {
          this.cancelLoadMore = true
        }
      })
    },
    initSex() { // 初始化性别
      let storeSex = this.$store.state.user.sex
      this.sexTags = JSON.parse(JSON.stringify(storeSex))
      // console.log(this.addSexTags)
    },
    initSession() {
      let sessionData = JSON.parse(getSession('userInfo'))
      let sessionAge = sessionData.constant.age // 年龄数据
      let sessionArea = sessionData.constant.location // 区域数据
      let sessionLevel = sessionData.constant.level // 权限数据
      for (let item in sessionAge) {
        this.ageTags.push(
          {
            label: sessionAge[item],
            value: item
          })
      }
      for (let item in sessionArea) {
        this.areaTags.push(
          {
            label: sessionArea[item],
            value: item
          })
      }
      for (let item in sessionLevel) {
        this.levelTags.push(
          {
            label: sessionLevel[item],
            value: item
          })
      }
    },
    loadMore() { // 下拉加载更多
      this.catList.offset += 10
      if (this.cancelLoadMore) {
        this.initCatTags(true)
      }
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
        path: '/content/material/circleFriends',
        query: {
          id: row.id
        }
      })
    },
    delRow(index, row) { // 删除
      // console.log(index, row, '删除')
      // 删除
      this.$confirm('此操作将永久删除该朋友圈（' + row.realname + '）, 是否继续?', '提示', {
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
      friendsDel(id).then(res => {
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
      this.$router.push({ path: '/content/material/circleFriends' })
    },
    clearAll() {
      this.ruleForm = {}
    }
  }
}
</script>

<style scoped>

</style>
