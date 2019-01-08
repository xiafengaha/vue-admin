<template>
  <!--<span>页面编辑</span>-->
  <el-card>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px">
      <el-form-item label="自定义页面名称:" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入页面名称" maxlength="30" style="width: 352px"/>
      </el-form-item>
      <el-form-item label="协议类型:" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="页面内容编辑:" prop="content">
        <tinymce v-if="tinymceShow" ref="tinymce" :height="300" v-model="ruleForm.content"/>
        <!--<tinymce :editor-option="editorOption" :editor-content="ruleForm.content" @getContent="getContent"/>-->
        <!--<tinymce :editor-option="editorOption" :editor-content="ruleForm.content" @getContent="getContent"/>-->
      </el-form-item>
      <el-form-item label=" ">
        <el-button v-db-click @click="returnPage('ruleForm')">返回</el-button>
        <el-button v-db-click @click="resetAll('ruleForm')">重置</el-button>
        <el-button v-db-click type="primary" @click="saveForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import Tinymce from '@/components/Tinymce'
// import Tinymce from '@/components/editor/editor'
import { richAdd, richUpdate, richDetail } from '@/api/contentManage/rich'

export default {
  name: 'Rich',
  components: {
    Tinymce
  },
  data() {
    return {
      ruleForm: {
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入页面名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择协议类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入页面内容', trigger: 'blur' }
        ]
      },
      options: [],
      routerId: '',
      editorOption: {}, // 富文本配置
      tinymceShow: true
    }
  },
  created() {
    this.initStore()
    this.initRouteData()
  },
  methods: {
    initRouteData() { // 获取列表URL数据
      let routeId = this.$route.query.id
      // console.log(this.$route.query.id)
      if (routeId) {
        this.detailRich(routeId)
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      } else {
        this.ruleForm = {
          content: ''
        }
      }
      this.$nextTick(() => {
        // this.$refs.tinymce.value = ''
        this.$refs.tinymce.initTinymce()
      })
      // console.log(this.ruleForm)
      this.routerId = routeId
    },
    getContent(data) {
      // console.log(data, 'data')
      this.ruleForm.content = data
    },
    initStore() {
      this.options = JSON.parse(JSON.stringify(this.$store.state.user.agreementType))
    },
    saveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.routerId ? this.updateRich() : this.saveRich()
        }
      })
    },
    saveRich() { // 新增协议
      richAdd(this.ruleForm).then(res => {
        this.$message.success('新增成功')
        this.resetForm('ruleForm')
        this.$refs.tinymce.destroyTinymce()
        this.$router.push({ path: '/content/protocol' })
      })
    },
    updateRich() { // 修改协议
      richUpdate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.resetForm('ruleForm')
        this.$refs.tinymce.destroyTinymce()
        this.$router.push({ path: '/content/protocol' })
      })
    },
    detailRich(id) { // 协议详情
      richDetail(id).then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    resetAll(formName) { // 重置表单
      this.resetForm(formName)
      this.ruleForm.content = ''
    },
    returnPage(formName) { // 返回上一页
      this.resetForm(formName)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
