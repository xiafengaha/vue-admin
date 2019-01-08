<template>
  <el-card class="add-member">
    <el-row :gutter="16">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px">
        <el-col :span="24">
          <el-form-item label="账号:" prop="username">
            <el-input :disabled="routeId ? true : false" placeholder="请输入账号" v-model="ruleForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经销商类型:" prop="type">
            <el-select
              v-model="ruleForm.type"
              clearable
              :disabled="routeId ? true : false"
              placeholder="请选择经销商类型">
              <el-option
                v-for="item in typeTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="推荐人:" prop="recommend">
            <el-input :disabled="routeId ? true : false" placeholder="请填写推荐人" v-model="ruleForm.recommend"></el-input>
            <!--<span>{{ ruleForm.recommend }}</span>-->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属经销商:" prop="parent">
            <el-input :disabled="routeId ? true : false" v-model="ruleForm.parent" placeholder="请填写经销商账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经销商等级:" prop="member_level">
            <el-select
              v-model="ruleForm.member_level"
              clearable
              :disabled="routeId ? true : false"
              placeholder="请选择经销商">
              <el-option
                v-for="item in levelTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经销商姓名:" prop="realname">
            <el-input :disabled="routeId ? true : false" v-model="ruleForm.realname" placeholder="请填写经销商姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button v-db-click @click="returnPage">返 回</el-button>
          <el-button v-db-click :disabled="routeId ? true : false" @click="resetForm('ruleForm')">重 置</el-button>
          <el-button v-db-click :disabled="routeId ? true : false" type="primary" @click="saveForm('ruleForm')">保 存</el-button>
        </el-col>
      </el-form>
    </el-row>
  </el-card>
</template>

<script>
import './style/addMember.less'
import { memberDetail, memberAdd } from '@/api/memberManage/list'
import { getSession } from '@/utils/auth'
export default {
  name: 'AddMember',
  data() {
    var validateRecommend = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        let regIphone = /^1[34578]\d{9}$/
        if (regIphone.test(value)) {
          callback();
        } else {
          callback(new Error('请填写正确的手机号'))
        }
      }
    }
    return {
      ruleForm: {},
      rules: {
        username: [
          { required: true, message: '请填写账号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请填写正确的手机号' }
        ],
        recommend: [
          { validator: validateRecommend, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        parent: [
          { required: true, message: '请填写所属经销商', trigger: 'blur' }
        ],
        member_level: [
          { required: true, message: '请选择经销商级别', trigger: 'change' }
        ],
        realname: [
          { required: true, message: '请选择经销商姓名', trigger: 'blur' }
        ]
      },
      levelTags: [], // 等级数据
      imgPrefix: '', // 图片前缀
      typeTags: [], // 经销商类型数据
      routeId: null
    }
  },
  created() {
    this.initRouterData() // 获取路由参数
    this.initSession() // 获取session
    this.initStore() // 获取store数据
  },
  methods: {
    initStore() { //  初始化store数据
      let memberType = this.$store.state.fixed.MEMBER_TYPE
      this.typeTags = JSON.parse(JSON.stringify(memberType))
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
      this.imgPrefix = sessionData.OSS_CDN_DOMAIN
    },
    initRouterData() {
      let routeData = this.$route.query // 路由数据
      let routeId = routeData.id // 路由ID
      if (routeId) { // 有ID就请求详情
        this.memberDetailApi(routeId)
      } else {
        this.ruleForm = {}
      }
      this.routeId = routeId
    },
    memberDetailApi(id) {
      memberDetail(id).then(res => {
        if (!this.isUrl(res.data.card_img)) { // true就是正确的url
          // 错误的url 就自己加前缀
          res.data.card_img = this.imgPrefix + res.data.card_img
        }
        res.data.member_level = String(res.data.member_level)
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
      })
    },
    isUrl(val) {
      var name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
      if (!(name.test(val))) {
        return false
      } else {
        return true
      }
    },
    returnPage() {
      this.$router.go(-1)
    },
    saveForm(formName) { // 保存表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addMemberApi(this.ruleForm)
        }
      })
    },
    addMemberApi(params) {
      memberAdd(params).then(res => {
        this.$message.success('新增成功')
        this.returnPage()
      })
    },
    resetForm(formName) { //重置表单
      this.$refs[formName].resetFields()
      this.ruleForm = {}
    }
  }
}
</script>

<style scoped>

</style>
