<template>
  <el-card>
    <el-row :gutter="16">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="ruleForm">
        <el-col :span="24">
          <el-form-item label="主题:" prop="title">
            <el-input v-model="ruleForm.title" style="width: 220px" placeholder="请输入主题"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容:" prop="des">
            <textarea v-model="ruleForm.des" style="width: 50%;min-height: 150px" placeholder="最多可输入10000个字符"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发送时间:" prop="publish_at">
            <el-date-picker
              v-model="ruleForm.publish_at"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择发送时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发送给:">
            <el-checkbox :indeterminate="userIsIndeterminate" v-model="checkAllUser" :disabled="appointUser" @change="handleAllUser">所有用户</el-checkbox>
            <div style="margin: 15px 0;"/>
            <el-checkbox-group v-model="ruleForm.target_type" @change="handleUserChange">
              <el-checkbox v-for="item in levelTags" :disabled="appointUser" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label=" " >
            <el-checkbox v-model="appointUser" :disabled="ruleForm.target_type.length !== 0" style="float: left">指定用户</el-checkbox>
            <el-input v-model="ruleForm.appoint_phones" :disabled="ruleForm.target_type.length !== 0" style="float: left;width: 220px" placeholder="每个用户手机号用逗号隔开"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label=" ">
            <el-button v-db-click type="primary" @click="returnPage">返 回</el-button>
            <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
            <el-button v-db-click type="primary" @click="saveForm('ruleForm')">
              保 存
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-card>

</template>

<script>
import { getSession } from '@/utils/auth'
import { newAdd, newUpdate, newDetail } from '@/api/configPage/news'
import moment from 'moment'
export default {
  name: 'AddNews',
  data() {
    return {
      ruleForm: {
        target_type: []
      },
      rules: {
        title: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        des: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        publish_at: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ]
      },
      userIsIndeterminate: false,
      checkAllUser: false,
      levelTags: [],
      appointUser: false, // 是否勾选指定用户
      routerId: '', // 路由ID
      updateRuleForm: {}
    }
  },
  created() {
    this.initSession() // 初始化等级
    this.initRouterData()
  },
  methods: {
    initRouterData() { // 获取路由数据
      let id = this.$route.query.id
      if (id) {
        this.initDetail(id)
      } else {
        this.ruleForm = {
          target_type: []
        }
      }
      this.routerId = id
    },
    initDetail(id) { // 获取详情
      newDetail(id).then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
        this.updateRuleForm = JSON.parse(JSON.stringify(res.data))
        this.handleUserChange(this.ruleForm.target_type)
      })
    },
    initSession() {
      let sessionData = JSON.parse(getSession('userInfo'))
      let sessionLevel = sessionData.constant.level // 等级
      for (let item in sessionLevel) {
        this.levelTags.push({
          label: sessionLevel[item],
          value: item
        })
      }
    },
    handleAllUser(val) { // 等级全选
      this.ruleForm.target_type = (val ? JSON.parse(JSON.stringify(this.getIdFun(this.levelTags))) : JSON.parse(JSON.stringify([])))
      this.userIsIndeterminate = false
      this.appointUser = false
      this.ruleForm.appoint_phones = ''
    },
    handleUserChange(value) { // 选择单个
      let checkLen = value.length
      this.checkAllUser = checkLen === this.levelTags.length
      this.userIsIndeterminate = checkLen > 0 && checkLen < this.levelTags.length
      this.ruleForm.target_type = JSON.parse(JSON.stringify(value))
      // console.log(value, 'value')
      this.appointUser = false
      this.ruleForm.appoint_phones = ''
    },
    getIdFun(data) {
      let idData = data.map(item => {
        return item.value
      })
      return idData
    },
    addNewsApi() { //  新增消息API
      newAdd(this.ruleForm).then(res => {
        this.$message.success('新增成功')
        this.$router.push({
          path: '/config/news'
        })
      })
    },
    updateNewsApi() { // 修改消息API
      newUpdate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.$router.push({
          path: '/config/news'
        })
      })
    },
    saveForm(formName) { // 保存还是修改
      let time = this.handleTime(this.ruleForm.publish_at)
      this.ruleForm.publish_at = time
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.routerId ? this.updateNewsApi() : this.addNewsApi()
        }
      })
    },
    handleTime(value) { // 时间格式处理
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    returnPage() { //  返回上一页
      this.$router.go(-1)
    },
    resetAll(formName) {
      this.$refs[formName].resetFields()
      this.handleUserChange([])
      this.ruleForm.appoint_phones = ''
      if (this.routerId) {
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
        this.handleUserChange(this.ruleForm.target_type)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .ruleForm{
    .el-checkbox{
      margin-right: 20px;
    }
  }
</style>
