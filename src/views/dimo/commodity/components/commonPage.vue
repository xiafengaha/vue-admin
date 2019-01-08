<template>
  <div >
    <el-button v-db-click v-has="buttonName.value" type="primary" style="margin-bottom: 10px" @click="addData">{{ buttonName.name }}</el-button>
    <el-table
      :data="tableData.data"
      border
      style="margin: 0 auto"
    >
      <el-table-column
        :label="buttonName.type === 'label' ? '标签名': '品牌名'">
        <template slot-scope="scope">
          <img :src="imgPrefix + scope.row.icon" width="40px" alt="icon" @click="clickImg(imgPrefix + scope.row.icon)">
          <span>{{ scope.row.name || scope.row.title }}</span>
          <!--<img src="http://pic.58pic.com/58pic/13/81/71/08K58PICzNa_1024.png" width="40px" alt="icon" @click="clickImg('http://pic.58pic.com/58pic/13/81/71/08K58PICzNa_1024.png')">-->
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"/>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-db-click v-has="buttonName.edit" type="text" @click="editRow(scope.row)">编辑</el-button>
          <el-button v-db-click v-has="buttonName.del" type="text" @click="delRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._count > 0" :total="tableData._count" :page="pageData.offset" :limit="pageData.limit" style="text-align: right;" @pagination="searchList" />
    <!--@pagination="searchList"-->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="30%"
    >
      <el-row :gutter="16">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-col :span="24">
            <el-form-item :label="buttonName.type === 'label' ? '标签名' : '品牌名'">
              <el-input v-model="ruleForm.name"/>
            </el-form-item>
            <el-form-item label="icon:">
              <my-upload ref="goodsPreviewUpload" :upload-data="goodsPreviewUploadData" @uploadSuccessUrl="getGoodsPreviewSuccessUrl" @delImg="getGoodsPreviewDel"/>
            </el-form-item>
            <!--<el-upload-->
            <!--ref="upload"-->
            <!--:on-change="handleChange"-->
            <!--:on-remove="handleRemove"-->
            <!--:file-list="fileList"-->
            <!--:action="uploadUrl"-->
            <!--:auto-upload="false"-->
            <!--:on-exceed="changeExceed"-->
            <!--:limit="1"-->
            <!--accept="image/jpeg,image/gif,image/png"-->
            <!--multiple-->
            <!--list-type="picture"-->
            <!--class="upload-demo">-->
            <!--<el-button slot="trigger" size="small" type="primary">上传icon</el-button>-->
            <!--&lt;!&ndash;<el-button style="margin-left: 10px;" size="small" type="success" @click="newSubmitForm">上传到服务器</el-button>&ndash;&gt;-->
            <!--</el-upload>-->
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="resetForm('ruleForm')">取 消</el-button>
        <!--<el-button v-db-click type="primary" @click="resetAll" >重置</el-button>-->
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
    <big-img v-if="showImg" :img-src="imgSrc" @clickit="viewImg"/>
  </div>

</template>

<script>
import myUpload from '@/components/Upload/uploadBtn'
// import { submitUpload } from '@/api/common'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import bigImg from '@/components/bigImg/index'
export default {
  name: 'CommonPage',
  components: {
    Pagination,
    bigImg,
    myUpload
  },
  props: {
    buttonName: {
      type: Object,
      required: true
    },
    tableData: {
      type: Object,
      required: true
    },
    pageData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showImg: false,
      imgSrc: '', // 图片路径
      dialogVisible: false,
      dialogTitle: '新增标签',
      ruleForm: {}, // form数据
      rules: {}, // 验证
      uploadUrl: '',
      fileList: [], // 文件列表
      addOrUplate: 1, // 1是新增2是修改3是删除
      imgPrefix: '', // 图片前缀
      goodsPreviewUploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1, // 上传限制的数量
        listShow: true, // 自定义图片列表是否显示
        accept: 'image/jpeg,image/gif,image/png', // 文件上传格式
        multiple: false, // 是否多选
        listType: 'text', // 列表展示格式
        type: 2 // 2是图片，1是视频，3是音频
      }
    }
  },
  created() {
    this.initImg() // 初始化图片路径
  },
  methods: {
    initImg() {
      // this.imgPrefix = this.$store.state.user.imgUrl
      this.imgPrefix = JSON.parse(sessionStorage.getItem('userInfo')).OSS_CDN_DOMAIN
      // console.log(this.$store)
    },
    delRow(row) { // 删除
      this.addOrUplate = 3
      this.ruleForm.id = row.id
      this.$confirm('此操作将永久删除该数据(' + (row.name || row.title) + ') , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleSure()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editRow(row) { // 编辑
      this.dialogVisible = true
      this.ruleForm.name = row.name || row.title
      this.ruleForm.icon = row.icon
      this.ruleForm.id = row.id
      this.addOrUplate = 2 // 2为编辑1是新增
      // console.log(row, 'row')
      this.$nextTick(() => {
        if (row.icon) {
          this.$refs.goodsPreviewUpload.uploadSuccessFilesList = [row.icon]
        } else {
          this.$refs.goodsPreviewUpload.uploadSuccessFilesList = []
        }
      })
      this.buttonName.type === 'label' ? this.dialogTitle = '修改(' + (row.name || row.title) + ')标签' : this.dialogTitle = '修改(' + (row.name || row.title) + ')品牌'
      this.fileList = [ // 为了现实当前的icon
        {
          name: (row.name || row.title) + '的icon',
          url: row.url
        }
      ]
    },
    addData() { // 新增
      this.buttonName.type === 'label' ? this.dialogTitle = '新增标签' : this.dialogTitle = '新增品牌'
      this.dialogVisible = true
      this.addOrUplate = 1
      this.$nextTick(() => {
        this.ruleForm.title = ''
        this.ruleForm.name = ''
        this.$refs.goodsPreviewUpload.uploadSuccessFilesList = []
      })
    },
    // handleRemove(file, fileList) {
    //   this.ruleForm.icon = ''
    //   // this.submitUploadData.files = JSON.parse(JSON.stringify(fileList))
    // },
    // handleChange(file, fileList) {
    //   this.submitUploadFiles(file)
    //   // fileList.forEach()
    // },
    // submitUploadFiles(f) { // 文件上传
    //   const formData = new FormData()
    //   formData.append('files[]', f.raw)
    //   formData.append('type', 2)
    //   submitUpload(formData).then(res => {
    //     this.$message.success('上传成功')
    //     this.ruleForm.icon = res.data[0].url
    //   })
    // },
    changeExceed(files, fileList) {
      // console.log(files, fileList, 'excee')
      // var warningText
      // this.uploadGrouping.type === 1 ? warningText = '视频文件只能上传一个' : warningText = '图片文件只能上传9张'
      // this.$message.warning(warningText)
      // if (this.uploadGrouping.type === 1) {
      //   this.fileList = files.slice(0, 1) // 只取第一个
      // } else {
      //   this.fileList = files.slice(0, 2)
      // }
      this.$message.warning('只能上传单张icon')
    },
    handleSure() { // 确定按钮
      if (this.buttonName.type === 'label') { // 标签的
        // 标签里面还要区分是修改还是新增，品牌同样
        switch (this.addOrUplate) {
          case 1:
            this.$emit('labelAdd', this.ruleForm)
            break
          case 2:
            this.$emit('labelUplate', this.ruleForm)
            break
          default:
            this.$emit('labelDel', this.ruleForm)
        }
      } else { // 品牌的
        switch (this.addOrUplate) {
          case 1:
            this.$emit('brandAdd', this.ruleForm)
            break
          case 2:
            this.$emit('brandUplate', this.ruleForm)
            break
          default:
            this.$emit('brandDel', this.ruleForm)
        }
      }
    },
    resetForm(formName) { // 重置
      this.$refs[formName].resetFields()
      for (const item in this.ruleForm) {
        this.ruleForm[item] = ''
      }
      this.fileList = []
      this.dialogVisible = false
    },
    searchList(data) { // 分页
      // console.log(this.pageData,'pageData')
      const newData = Object.assign({}, data)
      newData.offset = (data.page - 1) * 10
      delete newData.page
      // this.pageData.offset =
      this.$emit('tablePage', newData)
    },
    viewImg() {
      this.showImg = false
    },
    clickImg(src) {
      // console.log(e,'e')
      const that = this
      this.showImg = true
      that.imgSrc = src
    },
    getGoodsPreviewSuccessUrl(data, list) {
      this.ruleForm.icon = data[0].url
      // this.ruleForm.pre_img = data[0].url
    },
    getGoodsPreviewDel(data) {
      // this.ruleForm.pre_img = ''
      this.ruleForm.icon = ''
    }
  }
}
</script>

<style scoped>

</style>
