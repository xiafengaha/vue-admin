<template>
  <div>
    <el-button v-db-click v-has="'role.add'" type="primary" style="margin-bottom: 16px" @click="clickAccountAdd">新增角色</el-button>
    <table-configure
      v-if="tableConfig"
      ref="tableConfig"
      :data-table="dataTable"
      @onRowClick="onRowClick"
      @onHandleSelectionChange="onHandleSelectionChange"
      @tableDataHandle="tableDataHandle"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @editorRow="editorRow"
      @delRow="delRow"
      @paginationData="paginationData"
    />
    <self-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="30%"
    >
      <el-row :gutter="16">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-col :span="24">
            <el-form-item label="角色名:" prop="name">
              <el-input v-model="ruleForm.name" maxlength="18" placeholder="请输入角色名"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职能说明:" prop="description">
              <el-input v-model="ruleForm.description" maxlength="255" placeholder="请输入职能说明"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限列表:">
              <!--<el-input v-model="ruleForm.realname"/>-->
              <check-list ref="checkList" :parent-checkbox="menusList"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="cancelResetForm('ruleForm')">取 消</el-button>
        <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
        <el-button v-db-click type="primary" @click="addAccount('ruleForm')">确 定</el-button>
      </span>
    </self-dialog>
  </div>
</template>

<script>
import tableConfigure from '@/components/table/tableConfig'
import { rolesList, roleAdd, roleUplate, roleDel, roleDetail } from '@/api/configPage/role'
import { menus } from '@/api/menuList/menus'
import checkList from './components/checkList'
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  name: 'Index',
  components: {
    tableConfigure,
    checkList,
    selfDialog
  },
  data() {
    return {
      tableConfig: true,
      roleListData: {
        limit: 99,
        offset: 0
      },
      dialogVisible: false,
      ruleForm: {}, // form数据
      roleList: [], // 角色列表存储数组
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '角色名',
            fieldId: 0,
            propName: 'name'
          },
          {
            fieldName: '职能说明',
            fieldId: 1,
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
              id: '0',
              name: 'role.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'role.del'
            }
          ]
        }
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      dialogTitle: '新增角色',
      uploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1, // 上传限制的数量
        accept: 'image/jpeg,image/gif,image/png', // 文件上传格式
        multiple: false, // 是否多选
        listType: 'picture-card', // 列表展示格式
        type: 2 // 2是图片，1是视频，3是音频
      },
      menusList: [], // 菜单列表权限
      updateMenusList: [], // 保存修改之前的数据
      addMenusList: [],
      updateRuleForm: {}
    }
  },
  created() {
    this.initList(this.roleListData) // 初始化账户列表
  },
  methods: {
    initList(params) {
      rolesList(params).then(res => {
        // console.log(res, 'res')
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        this.dataTable._count = res.data._count
        this.tableConfig = false
        this.$nextTick(() => {
          this.tableConfig = true
        })
      })
    },
    clickAccountAdd() { // 新增
      this.dialogTitle = '新增角色'

      this.$nextTick(() => {
        this.dialogVisible = true
        // this.resetForm('ruleForm')
        this.initMenus()
      })
    },
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
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
    onRowClick() { // 行点击

    },
    onHandleSelectionChange() { // 多选框选择

    },
    handleSizeChange() { // size选择

    },
    handleCurrentChange() { // 页码选择

    },
    addAccount(formName) {
      // console.log(rule)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newData = this.$refs.checkList.getAllCheckId()
          // console.log(newData, 'newData')
          this.ruleForm.menus = JSON.parse(JSON.stringify(newData))
          var addOrUplate
          // console.log(this.ruleForm, 'ruleForm')
          this.dialogTitle === '新增角色' ? addOrUplate = roleAdd(this.ruleForm) : addOrUplate = roleUplate(this.ruleForm)
          addOrUplate.then(res => {
            // console.log(res, '新增成功')
            var messageText
            this.dialogTitle === '新增角色' ? messageText = '新增成功' : messageText = '修改成功'
            this.$message.success(messageText)
            this.resetForm(formName)
            this.dialogVisible = false
            this.initList(this.roleListData) // 重新请求列表API
          })
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
      // for (const item in this.ruleForm) {
      //   this.ruleForm[item] = ''
      // }
    },
    editorRow(index, row) { // 编辑
      // console.log(index, row, '编辑')
      this.dialogVisible = true
      this.dialogTitle = '修改（' + row.name + '）角色'
      this.initDetail(row.id)
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.updateRuleForm = JSON.parse(JSON.stringify(row))
      // console.log(this.ruleForm, 'editor')
    },
    initDetail(id) { // 获取详情API
      roleDetail(id).then(res => {
        // console.log(res.data, 'ressss')
        res.data.menus.forEach(item => {
          item.indeterminate = false
          // indeterminate
          item.is_enabled ? item.is_enabled = true : item.is_enabled = false
          item._child.forEach(items => {
            items.is_enabled === 1 ? items.is_enabled = true : items.is_enabled = false
          })
        })
        this.menusList = JSON.parse(JSON.stringify(res.data.menus))
        this.updateMenusList = JSON.parse(JSON.stringify(res.data.menus))
        // console.log(this.menusList, 'res')
      })
    },
    delRow(index, row) {
      // 删除
      // console.log(index, row, '删除')
      this.$confirm('此操作将永久删除该账号（' + row.name + '）, 是否继续?', '提示', {
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
      roleDel(id).then(res => {
        this.$message.success('删除成功')
        // console.log(res, 'res')
        this.initList(this.roleListData) // 重新请求列表API
      })
    },
    getUploadSuccessUrl(url) {
      this.ruleForm.avatar = url
    },
    initMenus() { // 获取菜单权限
      menus().then(res => {
        // console.log(res.data, res)
        res.data.forEach(item => {
          item.indeterminate = false
        })
        this.menusList = JSON.parse(JSON.stringify(res.data))
        this.addMenusList = JSON.parse(JSON.stringify(res.data))
        // this.$refs.checkList.indeterminate = true
        // console.log(this.menusList,'menuList')
      })
    },
    paginationData(data) {
      this.initList(data)
    },
    cancelResetForm(formName) {
      this.resetForm(formName)
      this.dialogVisible = false
    },
    resetAll(formName) {
      this.resetForm(formName)
      if (this.dialogTitle === '新增角色') {
        this.menusList = JSON.parse(JSON.stringify(this.addMenusList))
      } else {
        this.menusList = JSON.parse(JSON.stringify(this.updateMenusList))
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .el-select, .el-select--medium{
    width: 100%;
  }
</style>
