<!--suppress ALL -->
<template>
  <div>
    <el-button v-db-click v-has="'user.add'" type="primary" style="margin-bottom: 16px" @click="clickAccountAdd">新增账户</el-button>
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
    >

      <template slot-scope="props" slot="roleName">
        <span v-if="props.obj.row.roles.length !== 0">{{ props.obj.row.roles[0].name }}</span>
      </template>
      <template slot-scope="props" slot="enabled">
        <el-switch
          v-has="'user.enabled'"
          @change="changeSwitch(props.obj.row)"
          v-model="props.obj.row.enabled"
          active-color="#13ce66"
          active-text="启用"
          inactive-text="禁用"
          inactive-color="#ff4949">
        </el-switch>
      </template>
    </table-configure>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :before-close="closeCancel"
      :close-on-click-modal="false"
      width="30%">
      <el-row :gutter="16">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-col :span="24">
            <el-form-item label="账号:" prop="username">
              <el-input :disabled="userNameDisabled" v-model="ruleForm.username" maxlength="255" placeholder="长度在 5 到 255 个字符"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码:" prop="password">
              <el-input v-model="ruleForm.password" minlength="6" maxlength="18" placeholder="长度在 6 到 18 个字符"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="姓名:" prop="realname">
              <el-input v-model="ruleForm.realname" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系方式:" prop="mobile">
              <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属角色:" prop="role_id">
              <el-select v-has="'role.index'" v-model="ruleForm.role_id" placeholder="请选择角色" clearable @focus="initRoleList">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="头像:">
              <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getUploadSuccessUrl"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否禁用">
              <el-checkbox v-model="!ruleForm.enabled">是</el-checkbox>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="cancelResetForm('ruleForm')">取 消</el-button>
        <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
        <el-button v-db-click type="primary" @click="addAccount('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableConfigure from '@/components/table/tableConfig'
import { accountList, accountAdd, accountUplate, accountDel, changeEnabled } from '@/api/configPage/account'
import { rolesList } from '@/api/configPage/role'
import myUpload from '@/components/Upload/uploadBtn'
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  name: 'Index',
  components: {
    tableConfigure,
    myUpload,
    selfDialog
  },
  data() {
    return {
      roleListData: {
        limit: 99,
        offset: 0
      },
      tableConfig: true, // 表格组件
      dialogVisible: false,
      ruleForm: {}, // form数据
      roleList: [], // 角色列表存储数组
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '账号',
            fieldId: 0,
            propName: 'username'
          },
          {
            fieldName: '姓名',
            fieldId: 1,
            propName: 'realname'
          },
          {
            fieldName: '联系方式',
            fieldId: 2,
            propName: 'mobile'
          },
          {
            fieldName: '角色',
            fieldId: 3,
            propName: 'roleName'
          },
          {
            fieldName: '添加时间',
            fieldId: 4,
            propName: 'created_at'
          },
          {
            fieldName: '启用禁用',
            fieldId: 5,
            propName: 'enabled'
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
              name: 'user.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'user.del'
            }
          ]
        }
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 5, max: 255, message: '长度在 5 到 255 个字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }
        ],
        role_id: [
          { required: true, message: '请选择所属角色', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      dialogTitle: '新增账号',
      uploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1, // 上传限制的数量
        listShow: true,
        accept: 'image/jpeg,image/gif,image/png', // 文件上传格式
        multiple: false, // 是否多选
        listType: 'text', // 列表展示格式
        type: 2 // 2是图片，1是视频，3是音频
      },
      editorData: [], // 存储编辑数据
      userNameDisabled: false // 账号名是否可编辑
    }
  },
  created() {
    this.initAccountList() // 初始化账户列表
    // this.initRoleList() // 初始化角色列表
  },
  methods: {
    initRoleList() {
      rolesList(this.roleListData).then(res => {
        this.roleList = JSON.parse(JSON.stringify(res.data.data))
      })
    },
    initAccountList() {
      const params = {
        limit: this.dataTable.limit,
        offset: this.dataTable.offset
      }
      this.accountApi(params)
    },
    accountApi(params) {
      accountList(params).then(res => {
        res.data.data.forEach(item => {
          if (item.is_admin) { // 为了和封装的table功能统一
            item.disabled = true
          }
          // 0 是启用1禁用
          item.enabled = Number(item.enabled) ? false : true
        })
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        // console.log(res.data, 'res.data')
        this.dataTable._count = res.data._count
        this.tableConfig = false
        this.$nextTick(() => { // 为了组件重新加载
          this.tableConfig = true
        })
      })
    },
    clickAccountAdd() { // 新增
      this.dialogTitle = '新增账号'
      this.userNameDisabled = false
      // this.$nextTick(() => {
      this.dialogVisible = true
      // this.$nextTick(() => {
      this.ruleForm = {}
      if (this.$refs['ruleForm']) {
        this.$refs['ruleForm'].clearValidate()
        this.$refs.uploadBtn.uploadSuccessFilesList = []
      }
      // })
      //   this.resetForm('ruleForm')
      // this.$
      // })
    },
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop === 'roleName' || item.prop === 'enabled') {
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
    onRowClick() { // 行点击

    },
    onHandleSelectionChange() { // 多选框选择

    },
    handleSizeChange() { // size选择

    },
    handleCurrentChange() { // 页码选择

    },
    addAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var addOrUplate
          this.ruleForm.password_confirmation = this.ruleForm.password
          this.ruleForm.enabled = this.ruleForm.enabled ? 1 : 0
          this.dialogTitle === '新增账号' ? addOrUplate = accountAdd(this.ruleForm) : addOrUplate = accountUplate(this.ruleForm)
          addOrUplate.then(res => {
            var messageText
            this.dialogTitle === '新增账号' ? messageText = '新增成功' : messageText = '修改成功'
            this.$message.success(messageText)
            this.resetForm(formName)
            this.dialogVisible = false
            this.dataTable.offset = 0
            this.dataTable.limit = 10
            this.initAccountList() // 重新请求列表API
          })
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(() => {
        if (this.$refs[formName]) {
          this.$refs[formName].resetFields()
        }
      })
      for (const item in this.ruleForm) {
        this.ruleForm[item] = ''
      }
      this.$refs.uploadBtn.uploadSuccessFilesList = []
    },
    editorRow(index, row) { // 编辑
      this.dialogVisible = true
      this.userNameDisabled = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
        this.dialogTitle = '修改（' + row.username + '）账号'
        this.ruleForm = JSON.parse(JSON.stringify(row))
        this.editorData = JSON.parse(JSON.stringify(row)) // 存储
        if (row.roles.length !== 0) {
          this.ruleForm.role_id = row.roles[0].id
        }
        this.ruleForm.enabled = !!Number(this.ruleForm.enabled)
        this.$refs.uploadBtn.uploadSuccessFilesList = [row.avatar]
      })
    },
    delRow(index, row) {
      // 删除
      this.$confirm('此操作将永久删除该账号（' + row.username + '）, 是否继续?', '提示', {
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
      accountDel(id).then(res => {
        this.$message.success('删除成功')
        this.dataTable.offset = 0
        this.dataTable.limit = 10
        this.initAccountList() // 重新请求列表API
      })
    },
    getUploadSuccessUrl(data) {
      // console.log(data, '头像')
      this.ruleForm.avatar = data[0].url
    },
    paginationData(data) {
      let params = {
        offset: data.offset,
        limit: data.limit
      }
      this.accountApi(params)
    },
    cancelResetForm(formName) {
      this.resetForm(formName)
      this.dialogVisible = false
    },
    resetAll(formName) {
      this.resetForm(formName)
      if (this.dialogTitle !== '新增账号') {
        this.ruleForm = JSON.parse(JSON.stringify(this.editorData))
        if (this.editorData.roles.length !== 0) {
          this.ruleForm.role_id = this.editorData.roles[0].id
        }
        this.$refs.uploadBtn.uploadSuccessFilesList = [this.editorData.avatar]
      }
    },
    closeCancel() {
      this.resetForm('ruleForm')
      this.dialogVisible = false
    },
    changeSwitch(row) { // 启用或禁用
      // console.log(row, 'row')
      this.changeEnabledApi(row.id)
    },
    changeEnabledApi(id) {
      changeEnabled(id).then(res => {
        this.$message.success(res.message)
        this.dataTable.offset = 0
        this.dataTable.limit = 10
        this.initAccountList()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .el-select, .el-select--medium{
    /*为了下拉框和input长度统一*/
    width: 100%;
  }
</style>
