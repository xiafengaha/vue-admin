<template>
  <el-row>
    <video v-if="uploadData.type === 1 && uploadSuccessFilesList[0]" v-show="uploadData.listShow ? uploadData.listShow : false" id="videoPlayer" :src="imgPrefix + uploadSuccessFilesList[0]" style="height: 150px" controls="controls"/>
    <audio v-else-if="uploadData.type === 3 && uploadSuccessFilesList[0]" v-show="uploadData.listShow ? uploadData.listShow : false" :src="imgPrefix + uploadSuccessFilesList[0]" style="height: 150px" controls="controls"/>
    <draggable v-else v-show="uploadData.listShow ? uploadData.listShow : false" v-model="uploadSuccessFilesList" class="el-upload-list el-upload-list--picture-card" element="ul">
      <li v-for="(item, index) in uploadSuccessFilesList" v-if="item" :key="index" style="width: 50px;height: 50px" tabindex="0" class="el-upload-list__item">
        <img :src="imgPrefix + item + '?x-oss-process=image/resize,m_fill,h_50,w_50'" style="width: 100%" alt="" class="el-upload-list__item-thumbnail">
        <i class="el-icon-close"/>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete">
            <i style="font-size: 12px" class="el-icon-search" @click="clickImg(imgPrefix + item)"/>
            <i style="font-size: 12px" class="el-icon-delete" @click="clickImgDelete(index)"/>
          </span>
        </span>
      </li>
    </draggable>
    <el-upload
      ref="upload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :file-list="fileList"
      :show-file-list="uploadData.showList"
      :action="uploadData.uploadUrl"
      :auto-upload="uploadData.autoUpload"
      :on-exceed="changeExceed"
      :limit="uploadData.limit"
      :accept="uploadData.accept"
      :multiple="uploadData.multiple"
      :list-type="uploadData.listType"
      class="upload-demo">
      <div class="upload-box">
        <i class="el-icon-plus" style="font-size: 28px;color: #8c939d"></i>
      </div>
      <!--<el-button v-db-click slot="trigger" type="primary">{{ uploadData.name ? uploadData.name: '选取文件' }}</el-button>-->
      <div slot="tip" class="el-upload__tip">{{ uploadData.tip }}</div>
      <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="newSubmitForm">上传到服务器</el-button>-->
    </el-upload>
    <big-img v-if="showImg" :img-src="imgSrc" @clickit="viewImg"/>
  </el-row>
  <!--'.mp4, .ogg, .webm':'image/jpeg,image/gif,image/png'-->
</template>
<script>
import { submitUpload } from '@/api/common'
import draggable from 'vuedraggable'
import bigImg from '@/components/bigImg/index'
export default {
  name: 'UploadBtn',
  components: {
    draggable,
    bigImg
  },
  props: {
    uploadData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fileList: [],
      uploadSuccessFilesList: [], // 上传成功的文件列表
      showImg: false, // 大图显示隐藏
      imgSrc: '', // 需要放大的图片路径
      imgPrefix: '', // 文件前缀
      totalDuration: null
    }
  },
  created() {
    // console.log(this.uploadSuccessFilesList)
    this.initImgPrefix() // 获取图片前缀
  },
  methods: {
    initImgPrefix() { // 获取图片前缀
      // this.imgPrefix = this.$store.state.user.imgUrl
      // console.log(this.$store, this.imgPrefix)
      this.imgPrefix = JSON.parse(sessionStorage.getItem('userInfo')).OSS_CDN_DOMAIN
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
    handleChange(file, fileList) {
      const isLt20M = file.size / 1024 / 1024 < 20
      const isLt2M = file.size / 1024 / 1024 < 2
      if (this.uploadData === 2) { // 2是图片 1是视频，3是音频
        if (!isLt2M) {
          this.$message.warning('上传图片大小不能超过 2M')
        } else {
          this.submitUploadFiles(file)
        }
      } else {
        if (!isLt20M) {
          this.$message.warning('上传音视频大小不能超过 20M')
        } else {
          this.submitUploadFiles(file)
        }
      }
      // fileList.forEach()
    },
    submitUploadFiles(f) { // 文件上传
      const formData = new FormData()
      formData.append('files[]', f.raw)
      formData.append('type', this.uploadData.type)
      submitUpload(formData).then(res => {
        this.$message.success('上传成功')
        // this.uploadSuccessFilesList
        const len = this.uploadSuccessFilesList.length
        res.data.forEach((item, index) => {
          if (this.uploadData.limit > len) {
            this.uploadSuccessFilesList.splice(index, 0, item.url) // 上传成功的文件URL
          } else {
            this.uploadSuccessFilesList.splice(len - 1, 1, item.url)
          }
        })
        this.$refs.upload.clearFiles()
        if (this.uploadData.type === 1) {
          setTimeout(() => {
            this.totalDuration = document.getElementById('videoPlayer').duration
            // console.log(this.totalDuration)c
          }, 100)
        }
        this.$emit('uploadSuccessUrl', res.data, this.uploadSuccessFilesList)
        // if (this.uploadGrouping.type === 2) {
        //   if (this.uploadSuccessFilesList.length > 9) {
        //     this.$message.warning('最多只能上传9张图片')
        //   } else {
        //     this.uploadSuccessFilesList.push(res.data[0].url)
        //     // console.log(this.uploadSuccessFilesList, 'this.uploadSuccessFilesList')
        //     // this.uploadSuccessFilesList = ['http://pic.58pic.com/58pic/13/81/71/08K58PICzNa_1024.png','http://img.52z.com/upload/news/image/20180718/20180718120024_71109.jpg']
        //   }
        // } else {
        //   const newArr = []
        //   newArr.push(res.data[0].url)
        //   this.uploadSuccessFilesList = JSON.parse(JSON.stringify(newArr))
        //   // this.uploadSuccessFilesList = this.uploadSuccessFilesList.concat(res.data)
        // }
      })
    },
    handleRemove(file, fileList) {
      // 文件移除
    },
    changeExceed(files, fileList) {
      // 文件多了的处理函数
      // console.log('123123')
    },
    clickImgDelete(index) { // 删除图片
      this.uploadSuccessFilesList.splice(index, 1)
      this.$emit('delImg', this.uploadSuccessFilesList)
    }
  }
}
</script>
<style scoped lang="less">
  .upload-box{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
  }
</style>
