<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="2">
        <el-button v-db-click v-has="'groups.add'" type="primary" @click="clickAddNews">
          新增
        </el-button>
      </el-col>
      <el-col :span="18" :offset="4" style="text-align: right">
        <!--<el-select-->
        <!--v-model="ruleForm.level"-->
        <!--style="margin-left: 20px;"-->
        <!--placeholder="请选择开放权限">-->
        <!--<el-option-->
        <!--v-for="item in levelTags"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value"/>-->
        <!--</el-select>-->
        <search-input :parent-placeholder="'团队名称/手机号'" @searchList="searchData"/>
        <!--<el-button type="primary" style="margin-left: 20px;" @click="searchList(ruleForm)">搜索</el-button>-->
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
      <!--<template slot-scope="props" slot="img">-->
      <!--&lt;!&ndash;<img src="" alt="">&ndash;&gt;-->
      <!--<div v-if="props.obj.row.type === 2">-->
      <!--<audio :src="imgPrefix + props.obj.row.url" controls/>-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--</div>-->
      <!--<div v-else-if="props.obj.row.type === 1">-->
      <!--<video :src="imgPrefix + props.obj.row.url" :preload="imgPrefix + props.obj.row.img + '?x-oss-process=image/resize,h_100'" style="width: 100%;height: 100px" controls/>-->
      <!--</div>-->
      <!--&lt;!&ndash;<span v-if="props.obj.row.roles.length !== 0">{{ props.obj.row.roles[0].name }}</span>&ndash;&gt;-->
      <!--</template>-->
      <!--<template slot-scope="props" slot="category">-->
      <!--<span>{{ props.obj.row.category | categoryFilter }}</span>-->
      <!--</template>-->
      <!--<template slot-scope="props" slot="type">-->
      <!--<span>{{ props.obj.row.type | typeFilter }}</span>-->
      <!--</template>-->
    </table-configure>
  </div>
</template>

<script>
import tableConfigure from '@/components/table/tableConfig'
import searchInput from '@/components/search/index'
import { teamList, teamDel } from '@/api/teamManage/list'
export default {
  name: 'Index',
  components: {
    tableConfigure,
    searchInput
  },
  data() {
    return {
      tableConfig: true,
      ruleForm: {
        offset: 0,
        limit: 10
      },
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '团队名称',
            fieldId: 0,
            propName: 'name'
          },
          {
            fieldName: '团长',
            fieldId: 1,
            propName: 'username'
          },
          {
            fieldName: '修改人',
            fieldId: 2,
            propName: 'admin_name'
          },
          {
            fieldName: '修改时间',
            fieldId: 3,
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
              label: '编辑',
              Fun: 'editorRow',
              type: 'text',
              size: 'mini',
              id: '0',
              name: 'groups.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'groups.del'
            }
          ]
        }
      }
    }
  },
  created() {
    this.initList()
  },
  methods: {
    initList() { // 初始化列表
      teamList(this.ruleForm).then(res => {
        // console.log(res, 'res')
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        this.dataTable._count = res.data._count
      })
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
        path: '/team/addTeam',
        query: {
          id: row.id
        }
      })
    },
    delRow(index, row) { // 删除
      // console.log(index, row, '删除')
      // 删除
      this.$confirm('此操作将永久删除该团队(' + row.name + '), 是否继续?', '提示', {
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
      teamDel(id).then(res => {
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
    searchData(data) {
      this.ruleForm.keywords = data
      this.initList()
    },
    clickAddNews() { //  新增消息
      this.$router.push({
        path: '/team/addTeam'
      })
    }
  }
}
</script>

<style scoped>

</style>
