<template>
  <div>
    <span class="bottom-style">素材编辑</span>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row>
        <el-card style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="素材类型:" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择素材类型" @change="uploadBtn">
                <el-option
                  v-for="item in typeTags"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分享标题:">
              <el-input v-model="ruleForm.share_title" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="素材文案:">
              <textarea id="" v-model="ruleForm.share_des" name="" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="素材内容:" required>
              <!--这里是上传按钮-->
              <!--<el-button v-db-click v-if="ruleForm.type === 1" type="primary" @click="uploadBtn(1)">-->
              <!--视频-->
              <!--</el-button>-->
              <my-upload v-if="ruleForm.type" ref="uploadBtn" :upload-data="uploadData" style="float: left" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
              <my-upload v-if="ruleForm.type === 1" ref="previewUpload" :upload-data="previewUploadData" style="float:left;margin-left: 20px" @uploadSuccessUrl="getPreviewSuccessUrl" @delImg="getPreviewDel"/>
              <!--<el-button v-db-click v-if="ruleForm.type === 2" type="primary" @click="uploadBtn(2)">-->
              <!--图片-->
              <!--</el-button>-->
              <!--<el-button v-db-click v-if="ruleForm.type === 3" type="primary" @click="uploadBtn(3)">-->
              <!--招贴-->
              <!--</el-button>-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-show="typeImgShow" label="图片类型:">
              <el-radio-group v-model="ruleForm.type_img">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">横图</el-radio>
                <el-radio :label="2">竖图</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-card>
      </el-row>
      <el-row>
        <el-card style="margin-top: 20px">
          <h4>素材属性</h4>
          <el-col :span="24">
            <el-form-item label="素材归类:" prop="category">
              <el-select
                v-model="ruleForm.category"
                placeholder="请选择素材归类">
                <el-option
                  v-for="item in categoryTags"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联商品:" required>
              <el-input v-model="ruleForm.goods_title" style="width: 174px" disabled placeholder="请选择关联商品"/>
              <!--goodsData-->
              <el-select
                v-loadmore="goodsLoadmore"
                v-model="changeGoods"
                placeholder="请选择关联商品"
                @change="userChangeGoodsTitle"
              >
                <el-option
                  v-for="item in goodsData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="场景标签:">
              <el-checkbox-group v-model="ruleForm.tag_id" >
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in sceneTags" :key="item.id" :label="item.id" style="margin-right: 10px">{{ item.title }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开放权限:">
              <el-checkbox-group v-model="ruleForm.level" >
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in levelTags" :key="item.value" :label="item.value" style="margin-right: 10px">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别匹配:">
              <el-checkbox-group v-model="ruleForm.sexy" >
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in sexTags" :key="item.value" :label="item.value" style="margin-right: 10px">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="年龄匹配:">
              <el-checkbox-group v-model="ruleForm.age" >
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in ageTags" :key="item.value" :label="item.value" style="margin-right: 10px">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地区匹配:">
              <el-checkbox-group v-model="ruleForm.location" >
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in areaTags" :key="item.value" :label="item.value" style="margin-right: 10px">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <!--<el-col :span="24">-->
          <!--<el-form-item label="消息提醒:">-->
          <!--<el-switch-->
          <!--v-model="ruleForm"/></el-form-item>-->
          <!--</el-col>-->
        </el-card>
        <el-col :span="24" style="margin-top: 20px">
          <el-button v-db-click type="primary" @click="returnPage">返 回</el-button>
          <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
          <el-button v-db-click type="primary" @click="saveForm('ruleForm')">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--<self-dialog-->
    <!--:title="selfDialogTitle + userChangeDialogTitle"-->
    <!--:visible.sync="selfVisible"-->
    <!--width="30%"-->
    <!--&gt;-->
    <!--<el-row>-->
    <!--<el-form ref="uploadForm" :model="uploadForm" label-width="100px">-->
    <!--<el-col v-if="userChangeType === 1" :span="24">-->
    <!--&lt;!&ndash;<el-form-item label="视频预览图:">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
    <!--</el-col>-->
    <!--<el-col :span="24">-->
    <!--<el-form-item label="视频文件:">-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-form>-->
    <!--</el-row>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="selfVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="getUrl">确 定</el-button>-->
    <!--</span>-->
    <!--</self-dialog>-->
  </div>
</template>

<script>
import myUpload from '@/components/Upload/uploadBtn'
import selfDialog from '@/components/selfDialog/selfDialog'
import { listApi } from '@/api/commodity/list'
import { uploadGrouping } from '@/api/common'
import { getSession } from '@/utils/auth'
import { friendsAdd, friendsUplate, friendsDetail } from '@/api/contentManage/friends'
// import imgPrefix from '@/utils/imgPrefix'
import './style/release.scss'
export default {
  name: 'Release',
  components: {
    myUpload,
    selfDialog
  },
  filters: {
    getSelfTitle(value) {
      if (value === 1) {
        return '视频'
      } else if (value === 2) {
        return '图片'
      } else if (value === 3) {
        return '招贴'
      }
    }
  },
  data() {
    return {
      ruleForm: {
        tag_id: [], // 场景标签
        age: [], // 年龄标签
        sexy: [], // 性别标签
        level: [], // 等级标签
        location: [], // 区域标签
        img: [], // 图片
        type_img: 0
      },
      rules: {
        type: [
          { required: true, message: '请选择素材类型', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择素材归类', trigger: 'change' }
        ]
      },
      typeTags: [], // 获取类型下拉框数据
      sceneTags: [], // 场景标签
      sexTags: [], // 性别标签
      areaTags: [], // 地区标签
      ageTags: [], // 年龄标签
      categoryTags: [], // 素材类型标签
      levelTags: [], // 开放权限标签
      goodsList: {
        offset: 0,
        limit: 10,
        onsale: 1 // 需要上架的
      },
      catList: {
        offset: 0,
        limit: 10
      },
      goodsData: [], // 商品下拉框数据
      whetherLoadmore: false, // 是否还能加载更多
      userChangeDialogTitle: '视频',
      selfDialogTitle: '添加',
      selfVisible: false,
      uploadForm: {}, // 上传的form 表单数据
      uploadRules: {}, // 上传验证
      previewUploadData: { // 预览图片的文件上传配置
        showList: false,
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1,
        listShow: true,
        accept: 'image/jpeg,image/gif,image/png',
        multiple: false,
        name: '视频预览图',
        listType: 'text', // 列表展示格式
        tip: '',
        type: 2
      },
      uploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1, // 上传限制的数量
        listShow: true, // 自定义图片列表是否显示
        accept: '.mp4,.mov,.f4v,.mpg,.mkv', // 文件上传格式
        multiple: false, // 是否多选
        name: '选取文件',
        listType: 'text', // 列表展示格式
        type: 1 // 2是图片，1是视频，3是音频
      },
      urlPlaceholder: '多个图片请使用","分隔',
      userChangeType: '', // 用户选择的类型
      routeId: '', // 路由ID
      changeGoods: '',
      userUrl: 'videoUrl',
      updateRuleForm: {},
      typeImgShow: false
    }
  },
  created() {
    this.initType() // 初始化类型
    this.initCategory() // 获取素材类型
    this.initCatTags()
    this.initGoods(false) //  获取商品列表传false，true为了区分是否需要累加
  },
  mounted() {
    this.initRouterData()
  },
  methods: {
    initRouterData() { // 获取路由ID
      let id = this.$route.query.id
      if (id) {
        this.initDetail(id)
      } else {
        this.ruleForm = {
          tag_id: [], // 场景标签
          age: [], // 年龄标签
          sexy: [], // 性别标签
          level: [], // 等级标签
          location: [], // 区域标签
          img: [], // 图片
          type_img: 0
        }
      }
      this.initSession() // 获取年龄区域等级数据
      this.initSex() // 获取性别
      this.routeId = id
    },
    initDetail(id) {
      friendsDetail(id).then(res => {
        res.data.level = JSON.parse(JSON.stringify(this.stringData(res.data.level)))
        // res.data.tag_id = JSON.parse(JSON.stringify(this.stringData(res.data.tag_id)))
        res.data.location = JSON.parse(JSON.stringify(this.stringData(res.data.location)))
        res.data.age = JSON.parse(JSON.stringify(this.stringData(res.data.age)))
        if (res.data.sexy === 1) {
          res.data.sexy = [1]
        } else if (res.data.sexy === 2) {
          res.data.sexy = [2]
        } else {
          res.data.sexy = [1, 2]
        }
        this.uploadData.type = res.data.type
        this.uploadBtn(res.data.type)
        if (res.data.type === 1) {
          this.typeImgShow = true
          // this.uploadData.accept = '.mp4,.mov,.f4v,.mpg,.mkv'
          this.$nextTick(() => {
            this.$refs.uploadBtn.uploadSuccessFilesList = [res.data.video]
            this.$refs.previewUpload.uploadSuccessFilesList = [res.data.video_img]
          })
        } else {
          if (res.data.type === 2 && res.data.img.length === 1) {
            this.typeImgShow = true
          } else {
            this.typeImgShow = false
            this.ruleForm.type_img = 0
          }
          setTimeout(() => {
          //   if (this.$refs.uploadBtn) {
            this.$refs.uploadBtn.uploadSuccessFilesList = JSON.parse(JSON.stringify(res.data.img))
            // }
          // }
          })
        }
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
        this.updateRuleForm = JSON.parse(JSON.stringify(res.data)) // 留存一份原始数据
      })
    },
    stringData(data) {
      if (Array.isArray(data)) {
        for (let item in data) {
          data[item] = String(data[item])
        }
        return data
      } else {
        return []
      }
    },
    initType() {
      let storeType = this.$store.state.user.friendsType
      this.typeTags = JSON.parse(JSON.stringify(storeType))
    },
    initCategory() { //  获取素材类型
      let storeType = this.$store.state.user.type
      this.categoryTags = JSON.parse(JSON.stringify(storeType))
    },
    initGoods(type) {
      let originalData = JSON.parse(JSON.stringify(this.goodsData))
      listApi(this.goodsList).then(res => {
        let re = res.data
        type
          ? this.goodsData = originalData.concat(re.data)
          : this.goodsData = JSON.parse(JSON.stringify(re.data))
        if (re._count > this.goodsData.length) {
          this.whetherLoadmore = true
        } else {
          this.whetherLoadmore = false
          // this.$message.warning('没有更多数据了')
        }
      })
    },
    goodsLoadmore() {
      if (this.whetherLoadmore) {
        this.goodsList.offset = this.goodsList.offset += 10
        this.initGoods(true)
      }
    },
    userChangeGoodsTitle(val) {
      let filterData = this.goodsData.filter(item => {
        return item.id === val
      })
      this.ruleForm.goods_title = filterData[0].title
      this.ruleForm.goods_id = this.changeGoods
    },
    initCatTags() { // 初始化素材分组
      uploadGrouping(this.catList).then(res => {
        this.sceneTags = JSON.parse(JSON.stringify(res.data.data))
        this.ruleForm.tag_id = JSON.parse(JSON.stringify(this.defaultData(res.data.data)))
      })
    },
    defaultData(data) { // 默认获取ID
      let newData = JSON.parse(JSON.stringify(data))
      let idArr = newData.map(item => {
        return item.id || item.value
      })
      return idArr
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
      this.ruleForm.level = JSON.parse(JSON.stringify(this.defaultData(this.levelTags)))
      this.ruleForm.age = JSON.parse(JSON.stringify(this.defaultData(this.ageTags)))
      this.ruleForm.location = JSON.parse(JSON.stringify(this.defaultData(this.areaTags)))
    },
    initSex() { // 初始化性别
      let storeSex = this.$store.state.user.sex
      this.sexTags = storeSex.filter(item => {
        return item.value !== 0
      })
      this.ruleForm.sexy = JSON.parse(JSON.stringify([1, 2]))
    },
    getSceneTag(val) { // 获取用户选择的场景标签
    },
    uploadBtn(type) {
      // 上传的按钮
      // type代表点了什么按钮1视频2图片3招贴
      this.selfVisible = true
      // this.uploadForm.video_title = this.ruleForm.video_title
      switch (type) {
        case 1:
          this.userChangeDialogTitle = '视频'
          this.urlPlaceholder = '视频只能上传一个'
          this.uploadData.limit = 1
          this.uploadData.accept = '.mp4,.mov,.f4v,.mpg,.mkv'
          this.uploadData.multiple = false
          this.uploadData.name = '视频'
          this.uploadData.type = 1
          this.typeImgShow = true // 图片类型显示
          setTimeout(() => {
            // this.uploadForm.url =
            this.userUrl = 'videoUrl'
            this.$refs.previewUpload.uploadSuccessFilesList = [this.ruleForm.video_img]
            this.$refs.uploadBtn.uploadSuccessFilesList = [this.ruleForm.video]
          })
          break
        case 2:
          this.userChangeDialogTitle = '图片'
          this.urlPlaceholder = '多个图片请使用","分隔'
          this.uploadData.limit = 9
          this.uploadData.accept = 'image/jpeg,image/gif,image/png'
          this.uploadData.multiple = true
          this.uploadData.type = 2
          this.uploadData.name = '图片'
          this.typeImgShow = true // 图片类型显示
          setTimeout(() => {
            this.userUrl = 'imgUrl'
            this.$refs.uploadBtn.uploadSuccessFilesList = JSON.parse(JSON.stringify(this.ruleForm.img))
          })
          break
        case 3:
          this.userChangeDialogTitle = '招贴'
          this.urlPlaceholder = '招贴只能上传一个'
          this.uploadData.limit = 1
          this.uploadData.accept = 'image/jpeg,image/gif,image/png'
          this.uploadData.multiple = false
          this.uploadData.type = 2
          this.typeImgShow = false // 招贴图片类型不显示
          this.ruleForm.type_img = 0
          this.uploadData.name = '招贴'
          // console.log(, 'uploadBtn')
          // this.$nextTick(() => {
          setTimeout(() => {
            this.userUrl = 'posterUrl'
            this.$refs.uploadBtn.uploadSuccessFilesList = [JSON.parse(JSON.stringify(this.ruleForm.img[0]))]
          })

          break
      }
      this.userChangeType = type
      // this.userChangeDialogTitle = this.getSelfTitle(type)
    },
    getPreviewSuccessUrl(data) { // 获取预览图
      this.ruleForm.video_img = data[0].url
    },
    getPreviewDel(data) { // 预览图删除之后
      this.ruleForm.video_img = ''
    },
    getUploadSuccessUrl(data, imgList) { // 上传图片成功提示
      if (this.userChangeType === 1) {
        this.ruleForm.video = imgList[0]
      } else {
        this.ruleForm.img = JSON.parse(JSON.stringify(imgList))
        if (imgList.length > 1) { // 图片类型就隐藏
          this.typeImgShow = false
          this.ruleForm.type_img = 0
        }
      }
      // this.imgForm.url = JSON.parse(JSON.stringify(imgList))
    },
    getUploadDel(data) { // 获取用户删除后的数据
      this.ruleForm.img = JSON.parse(JSON.stringify(data))
    },
    saveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.sexy.length === 1) {
            this.ruleForm.sexy = this.ruleForm.sexy[0]
          } else { // 不传就是全部
            this.ruleForm.sexy = [0]
          }
          if (this.routeId) {
            this.uploadApi()
          } else {
            this.addApi()
          }
        } else {
          return false
        }
      })
    },
    addApi() { // 新建保存
      friendsAdd(this.ruleForm).then(res => {
        this.$message.success('新增成功')
        this.$router.push({
          path: '/content/material/friends'
        })
      })
    },
    uploadApi() { // 修改
      friendsUplate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.$router.push({
          path: '/content/material/friends'
        })
      })
    },
    getUrl() { // 获取地址
      if (this.uploadForm[this.userUrl]) { // 有
        let newUrl = this.uploadForm[this.userUrl].split(',')
        if (this.userChangeType === 1) { // 视频
          this.ruleForm.video = newUrl[0]
        } else if (this.userChangeType === 2) { // 图片
          this.ruleForm.img = JSON.parse(JSON.stringify(newUrl))
        } else if (this.userChangeType === 3) { // 招贴
          this.ruleForm.img = [JSON.parse(JSON.stringify(newUrl[0]))]
        }
      }
      this.selfVisible = false
    },
    returnPage() {
      this.$router.go(-1)
    },
    resetAll(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = {
        tag_id: [], // 场景标签
        age: [], // 年龄标签
        sexy: [], // 性别标签
        level: [], // 等级标签
        location: [], // 区域标签
        img: [] // 图片
      }
      if (this.routeId) {
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
