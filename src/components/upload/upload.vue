<template>
  <el-row class="upload-box">
    <!-- <video
      v-if="uploadData.type === 1 && uploadSuccessFilesList[0]"
      v-show="uploadData.listShow ? uploadData.listShow : false"
      id="videoPlayer"
      :src="imgPrefix + uploadSuccessFilesList[0]"
      style="height: 150px"
      controls="controls"
    />
    <audio
      v-else-if="uploadData.type === 3 && uploadSuccessFilesList[0]"
      v-show="uploadData.listShow ? uploadData.listShow : false"
      id="audioPlayer"
      :src="imgPrefix + uploadSuccessFilesList[0]"
      style="height: 150px"
      controls="controls"
    />-->
    <el-upload
      ref="upload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :drag="uploadData.drag"
      :file-list="fileList"
      :show-file-list="uploadData.showList"
      :action="host"
      :auto-upload="uploadData.autoUpload"
      :data="formData"
      :on-exceed="changeExceed"
      :limit="uploadData.limit"
      :accept="uploadData.accept"
      :multiple="uploadData.multiple"
      :list-type="uploadData.listType"
      class="upload-demo"
      v-if="uploadSuccessFilesList.length < uploadData.limit && routerData.type !== 'check'"
    >
      <div class="upload-content-box" v-if="uploadData.diy">
        <i class="el-icon-circle-plus-outline"></i>
        <div class="el-upload__text">添加上传图片</div>
      </div>
      <el-button
        v-else
        :icon="uploadData.btnIcon ? uploadData.btnIcon : ''"
        v-db-click
        type="text"
      >{{uploadData.title ? uploadData.title : '上传图片'}}</el-button>
      <!-- <el-button
        v-db-click
        slot="trigger"
        type="primary"
      >{{ uploadData.name ? uploadData.name: '选取文件' }}</el-button>-->
      <!-- <div slot="tip" class="el-upload__tip">{{ uploadData.tip }}</div> -->
      <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="newSubmitForm">上传到服务器</el-button>-->
    </el-upload>
    <draggable
      v-show="uploadData.listShow ? uploadData.listShow : false"
      v-model="uploadSuccessFilesList"
      class="el-upload-list el-upload-list--picture-card"
      element="ul"
      @update="draggableUpdate"
      @start="draggableStart"
    >
      <li
        v-for="(item, index) in uploadSuccessFilesList"
        :key="index"
        tabindex="0"
        :class="'el-upload-list__item' + (uploadData.diy? '' :  ' diy-list__item')"
        @click="changeImg(index)"
      >
        <el-image
          style="width: 100%; height: 100%"
          class="preview-img"
          :src="item"
          :preview-src-list="uploadSuccessFilesList"
        ></el-image>
        <!-- <img :src="item" style="width: 100%" alt preview="0" class="el-upload-list__item-thumbnail" /> -->
        <!-- <i class="el-icon-close" /> -->
        <!-- <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete">
            <i style="font-size: 12px" class="el-icon-search" @click="clickImg(item, index)" />
            <i style="font-size: 12px" class="el-icon-delete" @click="clickImgDelete(index)" />
          </span>
        </span>-->
        <!-- <span></span> -->
        <div class="handle-icon" v-if="routerData.type !== 'check'">
          <i
            style="font-size: 12px; color: #fff;"
            class="el-icon-delete"
            @click="clickImgDelete(index)"
          />
        </div>
        <span v-if="uploadData.title && index === 0" class="pic-title">{{uploadData.title}}</span>
      </li>
    </draggable>
    <!-- <el-image v-if="showImg" :src="imgSrc" :preview-src-list="uploadSuccessFilesList"></el-image> -->
    <!-- <big-img v-if="showImg" :img-src="imgSrc" @clickit="viewImg" /> -->
  </el-row>
  <!--'.mp4, .ogg, .webm':'image/jpeg,image/gif,image/png'-->
</template>
<script>
import { getOssToken, uploadAli } from "@/api/common-api.js";
import draggable from "vuedraggable";
// import PhotoSwipe from "photoswipe/dist/photoswipe";
// import { photoPreview } from "vue-photo-preview/dist/vue-photo-preview.js";
import "./index.scss";
// import bigImg from '@/components/bigImg/index'
export default {
  name: "UploadBtn",
  components: {
    draggable
    // bigImg
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
      imgSrc: "", // 需要放大的图片路径
      imgPrefix: "", // 文件前缀
      videoDuration: null,
      audioDuration: null,
      formData: {},
      host: "",
      routerData: {}
    };
  },
  created() {
    // console.log(this.uploadSuccessFilesList)
    this.initData(); // 初始化数据
    // this.getTime()
  },
  methods: {
    initData() {
      let routerData = this.$route.query;
      console.log(routerData, "router");
      this.routerData = { ...routerData };
    },
    viewImg() {
      this.showImg = false;
    },
    clickImg(src, index) {
      // console.log(this.$preview, "this.$preview", this, window);
      // var pswpElement = document.querySelectorAll(
      //   ".el-upload-list__item-thumbnail"
      // );
      // // console.log(pswpElement, "pswpElement");
      // // this.openPhotoSwipe(this.uploadSuccessFilesList);
      // // this.initPreview("img[preview]");
      // // console.log(this.initPreview("img[preview]"), "12312321", this.$preview);
      // // this.$preview.on("init", (e, item) => {
      // //   // this.$preview.self.initTap()
      // //   console.log(this.$preview.self, e, item); //此时this.$preview.self拥有原插件photoswipe文档中的所有方法和属性
      // // });
      // // console.log(pswpElement, "pswpElement", photoPreview);
      // var gallery = new PhotoSwipe(pswpElement);
      // console.log(gallery, "gallery");
      // gallery.init();
      // // this.previewImg();
      // const that = this;
      // // console.log(that, "that", gallery);
      // this.showImg = true;
      // that.imgSrc = src;
    },
    previewImg() {},
    handleChange(file, fileList) {
      const isLt200M = file.size / 1024 / 1024 < 200;
      const isLt5M = file.size / 1024 / 1024 < 3;
      if (this.uploadData === 2) {
        // 2是图片 1是视频，3是音频
        let accept = this.uploadData.accept.split(",").filter(item => {
          return item === file.raw.type;
        });
        if (accept?.length === 0) {
          this.$message.warning("上传图片格式错误，请重新选择");
          return false;
        } else {
          if (!isLt5M) {
            this.$message.warning("上传图片大小不能超过 3M");
          } else {
            this.submitUploadFiles(file);
          }
        }
      } else {
        if (!isLt200M) {
          this.$message.warning("上传音视频大小不能超过 200M");
        } else {
          this.submitUploadFiles(file);
        }
      }
      // fileList.forEach()
    },
    submitUploadFiles(f) {
      // 文件上传
      const formData = new FormData();
      getOssToken({ imgType: this.uploadData.imgType }).then(res => {
        formData.append("key", res.data.dir + f.name);
        formData.append("policy", res.data.policy);
        formData.append("OSSAccessKeyId", res.data.accessid);
        formData.append("signature", res.data.signature);
        formData.append("success_action_status", 200);
        formData.append("name", f.name);
        formData.append("file", f.raw);
        uploadAli(res.data.host, formData)
          .then(re => {
            // console.log(this.$previewRefresh(), "this.$previewRefresh()", this);

            if (this.uploadData.type === "file") {
              // 文件上传
              let url =
                "http://ban-img.qijian-tech.com/" + res.data.dir + f.name;
              this.$emit("getFileUrl", url);
              this.uploadSuccessFilesList = [];
              this.fileList = [];
              // this.uploadSuccessFilesList()
            } else {
              let url = res.data.host + "/" + res.data.dir + f.name;
              this.uploadSuccessFilesList.push(url);
              this.$message.success("上传成功");
            }
            // let len = this.uploadSuccessFilesList.length;
            // re.data.forEach((item, index) => {
            //   if (this.uploadData.limit > len) {
            //     this.uploadSuccessFilesList.splice(index, 0, item.url); // 上传成功的文件URL
            //   } else {
            //     this.uploadSuccessFilesList.splice(len - 1, 1, item.url);
            //   }
            // });
            // this.$refs.upload.clearFiles();
            // this.$emit(
            //   "uploadSuccessUrl",
            //   re.data,
            //   this.uploadSuccessFilesList
            // );
          })
          .catch(() => {
            // 清空选中的列表
            this.$refs.upload.clearFiles();
          });
        // this.$axios({
        //   url: res.data.host,
        //   method: "post",
        //   data: formData
        // })
        //   .then(re => {
        //     // console.log(re, "resssss上传之后的");
        //   })
      });
    },
    handleRemove(file, fileList) {
      // 文件移除
    },
    changeExceed(files, fileList) {
      // 文件多了的处理函数
      // console.log('123123')
    },
    clickImgDelete(index) {
      // 删除图片
      this.uploadSuccessFilesList.splice(index, 1, null);
      this.uploadSuccessFilesList = this.uploadSuccessFilesList.filter(item => {
        return item !== null;
      });
      this.$emit("delImg", this.uploadSuccessFilesList, index);
    },
    getTime(type) {
      // 获取时长
      let duration; // 时长
      if (type === 1) {
        // 视频
        duration = document.getElementById("videoPlayer").duration;
      } else if (type === 2) {
        // 音频
        duration = document.getElementById("audioPlayer").duration;
      }

      // let videoDuration = document.getElementById('videoPlayer').duration
      // let hour = parseInt(videoDuration / 3600) // 时
      let minute = parseInt(duration / 60); // 分
      let second = Math.ceil(duration % 60);
      if (second < 10) {
        second = "0" + second;
      } else if (second === 60) {
        second = "00";
        minute += 1;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      let str = minute + ":" + second;
      return str;
    },
    changeImg(index) {
      this.$emit("clickImg", index);
    },
    draggableUpdate(data, index) {
      // console.log(data, 'dragg', index)
      this.$emit("draggableUpdate", data);
    },
    draggableStart(data) {
      this.$emit("draggableStart", data);
    }
  }
};
</script>
<style scoped lang="scss">
</style>
