<template>
  <el-card>
    <el-row :gutter="16" class="company">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <h4>【公司简介】</h4>
        <el-col :span="24">
          <el-form-item label="公司名称:">
            <el-input v-model="ruleForm.company" placeholder="请输入公司名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司简称:">
            <el-input v-model="ruleForm.short_name" placeholder="请输入公司简称"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="公司联系方式">
            <el-input v-model="ruleForm.mobile" placeholder="请输入公司联系方式"/>
          </el-form-item>
        </el-col>
        <h4>【收款账号】</h4>
        <el-col :span="24">
          <el-form-item label="开户行:">
            <el-input v-model="ruleForm.bank_name" placeholder="请输入开户行"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开户行地址:">
            <el-input v-model="ruleForm.bank_address" placeholder="请输入开户行地址"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="收款方:">
            <el-input v-model="ruleForm.realname" placeholder="请输入收款方"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="卡号:">
            <el-input v-model="ruleForm.card" placeholder="请输入卡号"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="收款二维码:">
            <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
          </el-form-item>
        </el-col>
        <el-button v-db-click type="primary" @click="submitSave('ruleForm')">
          保存
        </el-button>
      </el-form>
    </el-row>
  </el-card>
</template>

<script>
import myUpload from '@/components/Upload/uploadBtn'
import { companyDetail, companyUpdate } from '@/api/configPage/company'
export default {
  name: 'Index',
  components: {
    myUpload
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
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
    }
  },
  created() {
    this.initDetail()
  },
  methods: {
    initDetail() { // 详情API
      companyDetail().then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
        if (res.data.qrcode) {
          this.$refs.uploadBtn.uploadSuccessFilesList = [res.data.qrcode]
        }
      })
    },
    submitSave(formName) {
      this.updateApi()
    },
    updateApi() { // 修改API
      companyUpdate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.initDetail()
      })
    },
    getUploadSuccessUrl(data, list) { // 文件上传回调函数
      this.ruleForm.qrcode = JSON.parse(JSON.stringify(list[0]))
    },
    getUploadDel(data) { //  文件删除
      this.ruleForm.qrcode = ''
    }
  }
}
</script>

<style scoped lang="scss">
  .company{
    .el-input{
      width: 174px;
    }
  }
</style>
