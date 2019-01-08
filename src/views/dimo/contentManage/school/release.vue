<template>
  <!--<span>发布</span>-->
  <el-card>
    <el-row :gutter="16">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-col :span="24">
          <el-form-item label="课件类型:" prop="type">
            <el-select v-model="ruleForm.type" clearable placeholder="请选择" @change="changeFormType">
              <el-option
                v-for="item in coursewareData"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标题名称:" prop="title">
            <el-input v-model="ruleForm.title"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容简介:">
            <textarea v-model="ruleForm.des" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.type ===1" :span="24">
          <el-form-item label="添加课件:" required>
            <my-upload ref="uploadBtn" :upload-data="uploadData" style="float: left" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
            <my-upload ref="previewUploadBtn" :upload-data="previewUploadData" style="float: left;margin-left: 10px" @uploadSuccessUrl="getPreviewUploadSuccessUrl" @delImg="getPreviewUploadDel"/>
            <!--<el-button v-db-click type="primary" @click="uploadBtn(1)">-->
            <!--视频-->
            <!--</el-button>-->
            <!--<el-button v-db-click type="primary" @click="uploadBtn(2)">-->
            <!--预览图-->
            <!--</el-button>-->
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.type === 2" :span="24">
          <el-form-item label="添加课件:" required>
            <!--<el-button v-db-click type="primary" @click="uploadBtn(3)">-->
            <!--音频-->
            <!--</el-button>-->
            <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.type === 3" :span="24">
          <el-form-item label="问:" required>
            <textarea v-model="ruleForm.ask" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.type === 3" :span="24">
          <el-form-item label="答:" required>
            <textarea v-model="ruleForm.answer" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开放权限:">
            <el-checkbox-group v-model="ruleForm.rights" >
              <!--@change="userChangeGoodsLabel"-->
              <el-checkbox-button v-for="item in levelTags" :key="item.value" :label="item.value" style="margin-right: 10px">{{ item.label }}</el-checkbox-button>
            </el-checkbox-group>
            <!--<span v-model="ruleForm.rights">这里是标签</span>-->
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.type ===1" :span="24">
          <el-form-item label="是否推荐">
            <el-checkbox v-model="ruleForm.is_recommend"/>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-button v-db-click type="primary" @click="returnPage">返 回</el-button>
    <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
    <el-button v-db-click type="primary" @click="saveForm('ruleForm')">
      保 存
    </el-button>
  </el-card>
</template>

<script>
import './style/release.scss'
import myUpload from '@/components/Upload/uploadBtn'
import selfDialog from '@/components/selfDialog/selfDialog'
import { getSession } from '@/utils/auth'
import { hotAdd, hotUpdate, hotDetail } from '@/api/contentManage/school/hot'
export default {
  name: 'Release',
  components: {
    selfDialog,
    myUpload
  },
  data() {
    return {
      ruleForm: {
        rights: []
      },
      rules: {
        type: [
          { required: true, message: '请选择课件类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请填写标题名称', trigger: 'blur' }
        ]
      },
      coursewareData: [], // 课件类型数据
      selfVisible: false,
      selfDialogTitle: '添加',
      userChangeDialogTitle: '视频',
      uploadData: { // 视频文件上传配置
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1, // 上传限制的数量
        listShow: true, // 自定义图片列表是否显示
        accept: '.mp4,.mov,.f4v,.mpg,.mkv', // 文件上传格式
        multiple: false, // 是否多选
        listType: 'text', // 列表展示格式
        type: 1 // 2是图片，1是视频，3是音频
      },
      previewUploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1, // 上传限制的数量
        listShow: true, // 自定义图片列表是否显示
        accept: 'image/jpeg,image/gif,image/png', // 文件上传格式
        multiple: false, // 是否多选
        name: '视频预览图',
        listType: 'text', // 列表展示格式
        type: 2 // 2是图片，1是视频，3是音频
      },
      userChangeType: 1, //  用户选择上传图片还是视频 1 视频，2图片
      uploadForm: {}, // 上传功能form表单
      levelTags: [], // 开放权限标签
      routeId: '', // 路由ID
      formType: '', // 课件类型
      userUrl: 'videoUrl',
      updateRuleForm: {}
    }
  },
  created() {
    this.initCourseware() // 获取课件类型
    this.initSession() // 获取session
    this.initRouterData() // 获取路由数据
  },
  methods: {
    initRouterData() { // 获取路由ID
      // this.routeId = ''
      let id = this.$route.query.id, collegeId = this.$route.query.college_id
      id ? this.initDetail(id) : this.ruleForm = { rights: [] }
      this.routeId = id
      this.ruleForm.college_id = collegeId
      // console.log()
    },
    initDetail(id) {
      hotDetail(id).then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
        if (this.ruleForm.type === 1) {
          this.ruleForm.video_url = this.ruleForm.url
        } else if (this.ruleForm.type === 2) {
          this.ruleForm.audio_url = this.ruleForm.url
        }
        this.ruleForm.is_recommend = Number(this.ruleForm.is_recommend) ? true : false
        this.updateRuleForm = JSON.parse(JSON.stringify(this.ruleForm))
        this.$nextTick(() => {
          this.$refs.uploadBtn.uploadSuccessFilesList = [this.ruleForm.url]
          if (this.ruleForm.type === 1) {
            this.$refs.previewUploadBtn.uploadSuccessFilesList = [this.ruleForm.img]
          }
        })
        // this.ruleForm.rights = '1,100'
        // this.ruleForm.rights = this.ruleForm.rights.split(',')
        // console.log(this.ruleForm, 'ruleForm')
      })
    },
    initCourseware() {
      let storeCourseware = this.$store.state.user.coursewareType
      // console.log(storeCourseware)
      this.coursewareData = JSON.parse(JSON.stringify(storeCourseware))
    },
    uploadBtn(type) {
      this.selfVisible = true
      // console.log(this.ruleForm, 'ruleForm')
      switch (type) {
        case 1:
          this.userChangeDialogTitle = '视频'
          this.userChangeType = 1
          this.uploadData.limit = 1
          this.uploadData.accept = '.mp4,.mov,.f4v,.mpg,.mkv'
          this.uploadData.multiple = false
          this.uploadData.type = 1
          this.uploadData.name = '视频'
          this.$nextTick(() => {
            this.userUrl = 'videoUrl'
            // this.$refs.previewUpload.uploadSuccessFilesList = [this.ruleForm.img]
            this.ruleForm.video_url
              ? this.$refs.uploadBtn.uploadSuccessFilesList = [this.ruleForm.video_url]
              : this.$refs.uploadBtn.uploadSuccessFilesList = []
          })
          break
        // case 2:
          // this.userChangeDialogTitle = '预览图'
          // this.uploadData.limit = 1
          // this.uploadData.accept = 'image/jpeg,image/gif,image/png'
          // this.uploadData.multiple = false
          // this.uploadData.type = 2
          // this.$nextTick(() => {
          //   this.userUrl = 'imgUrl'
          //   this.ruleForm.img
          //     ? this.$refs.uploadBtn.uploadSuccessFilesList = [JSON.parse(JSON.stringify(this.ruleForm.img))]
          //     : this.$refs.uploadBtn.uploadSuccessFilesList = []
          // })
          // this.userChangeType = 2
          // break
        case 2:
          this.userChangeDialogTitle = '音频'
          this.userChangeType = 3
          this.uploadData.limit = 1
          this.uploadData.accept = '.ogg, .mp3, .wav'
          this.uploadData.multiple = false
          this.uploadData.type = 3
          this.uploadData.name = '音频'
          this.$nextTick(() => {
            this.userUrl = 'audioUrl'
            this.ruleForm.audio_url
              ? this.$refs.uploadBtn.uploadSuccessFilesList = [JSON.parse(JSON.stringify(this.ruleForm.audio_url))]
              : this.$refs.uploadBtn.uploadSuccessFilesList = []
          })
          break
      }
    },
    getUrl() { // 获取地址
      if (this.uploadForm[this.userUrl]) { // 有
        let newUrl = this.uploadForm[this.userUrl].split(',')
        if (this.userChangeType === 1) { // 视频
          this.ruleForm.video_url = JSON.parse(JSON.stringify(newUrl[0]))
        } else if (this.userChangeType === 2) { // 图片
          this.ruleForm.img = JSON.parse(JSON.stringify(newUrl[0]))
        } else if (this.userChangeType === 3) { // 音频
          this.ruleForm.audio_url = JSON.parse(JSON.stringify(newUrl[0]))
        }
      }
      this.selfVisible = false
    },
    getUploadSuccessUrl(data, imgList) { // 上传图片成功提示
      // console.log(imgList,this.userChangeType)
      switch (this.userChangeType) {
        case 1:
          this.ruleForm.video_url = JSON.parse(JSON.stringify(imgList[0]))
          break
        // case 2:
        //   this.ruleForm.img = JSON.parse(JSON.stringify(imgList[0]))
        //   break
        case 3:
          this.ruleForm.audio_url = JSON.parse(JSON.stringify(imgList[0]))
          break
      }
    },
    getPreviewUploadSuccessUrl(data, imgList) {
      this.ruleForm.img = JSON.parse(JSON.stringify(imgList[0]))
    },
    getPreviewUploadDel() {
      this.ruleForm.img = ''
    },
    getUploadDel(data) { // 获取用户删除后的数据
      this.ruleForm.url = ''
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
    },
    saveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.type === 1) { // 视频
            this.ruleForm.url = this.ruleForm.video_url
          } else if (this.ruleForm.type === 2) { // 音频
            this.ruleForm.url = this.ruleForm.audio_url
          } else {
            this.ruleForm.url = ''
          }
          // console.log(this.ruleForm)
          if (this.ruleForm.is_recommend) {
            this.ruleForm.is_recommend = '1'
          } else {
            this.ruleForm.is_recommend = '0'
          }
          if (this.routeId) { // 有ID就是修改，没有是新增
            this.updateForm()
          } else {
            this.addForm()
          }
        }
      })
    },
    addForm() {
      hotAdd(this.ruleForm).then(res => {
        // console.log(res, '新增')
        this.$message.success('新增成功')
        this.$router.go(-1)
      })
    },
    updateForm() {
      hotUpdate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.$router.go(-1)
      })
    },
    changeFormType(val) { // 获取课件类型
      this.formType = val
      this.uploadBtn(val)
    },
    returnPage() { // 返回上一页
      this.$router.go(-1)
    },
    resetAll(formName) { // 重置
      this.$refs[formName].resetFields()
      this.ruleForm = {
        rights: []
      }
      if (this.routeId) {
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
      }
    }
  }
}
</script>

<style scoped>

</style>
