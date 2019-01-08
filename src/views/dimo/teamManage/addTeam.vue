<template>
  <el-card>
    <el-row :gutter="16" class="team">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <h4>【团队资料】</h4>
        <el-col :span="24">
          <el-form-item label="团队名称:" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入团队名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="团队logo:" required>
            <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="关联团长:" prop="relating_phone">
            <el-input v-model="ruleForm.relating_phone" placeholder="请输入关联团长的手机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="账号名称:" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入登陆账号名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="登陆密码:" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入登陆密码"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button v-db-click type="primary" @click="returnPage">
              返 回
            </el-button>
            <el-button v-db-click @click="resetAll('ruleForm')">
              重 置
            </el-button>
            <el-button v-db-click type="primary" @click="submitData('ruleForm')">
              保 存
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-card>

</template>

<script>
import selfDialog from '@/components/selfDialog/selfDialog'
import myUpload from '@/components/Upload/uploadBtn'
import { teamAdd, teamUpdate, teamDetail } from '@/api/teamManage/list'
export default {
  name: 'AddTeam',
  components: {
    selfDialog,
    myUpload
  },
  data() {
    return {
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: '请输入团队名称', trigger: 'blur' }
        ],
        relating_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }
        ],
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 5, message: '请至少输入5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 5, message: '请至少输入5个字符', trigger: 'blur' }
        ]
      },
      selfVisible: false,
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
      routeId: '', // 路由ID参数
      updateRuleForm: {}
    }
  },
  created() {
    this.initRouteData()
  },
  methods: {
    initRouteData() { // 获取路由参数
      let routeId = this.$route.query.id
      this.routeId = routeId
      // 有ID就是详情
      routeId ? this.initDetail(routeId) : this.ruleForm = {}
    },
    initDetail(id) { // 获取用户详情
      teamDetail(id).then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
        this.updateRuleForm = JSON.parse(JSON.stringify(res.data))
        this.$refs.uploadBtn.uploadSuccessFilesList = [res.data.logo] // logo回显
      })
    },
    getUploadSuccessUrl(data, list) { // 文件上传成功
      // console.log(data, list)
      this.ruleForm.logo = list[0]
    },
    getUploadDel(data) { // 文件删除
      this.ruleForm.logo = ''
    },
    submitData(formName) { // 保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.routeId ? this.updateTeamApi() : this.addTeamApi()
        }
      })
    },
    addTeamApi() { //  新增团队API
      teamAdd(this.ruleForm).then(res => {
        this.$message.success('新增成功')
        this.$router.push({
          path: '/team/teamList'
        })
      })
    },
    updateTeamApi() { // 修改团队API
      teamUpdate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.$router.push({
          path: '/team/teamList'
        })
      })
    },
    returnPage() {
      this.$router.go(-1)
    },
    resetAll(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.logo = ''
      this.$refs.uploadBtn.uploadSuccessFilesList = []
      if (this.routeId) {
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
        this.$refs.uploadBtn.uploadSuccessFilesList = [this.updateRuleForm.logo] // logo回显
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .team{
    .el-input{
      width: 174px;
    }
  }
</style>
