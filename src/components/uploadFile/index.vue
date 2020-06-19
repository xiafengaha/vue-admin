<template>
  <div class="dib upload-con">
    <div v-if="uploadType == 'photo'">
      <ul
        class="img-wraaper clearFl"
        :style="{minWidth: width+ 16 + 'px', minHeight: height+16+'px'}"
      >
        <!--已传图片区-->
        <li
          class="img-list img-arr"
          :style="{width: width+'px', height: height+'px'}"
          v-for="(item,index) in files"
          :key="'b'+index"
        >
          <!--X 删除图标处-->
          <div class="delete" v-if="isCanEdit && isShowDelete" @click="deleteFile(index)">
            <i class="el-icon-circle-close-outline"></i>
          </div>

          <!--展示图片处-->
          <div class="img-item item-item-bg" @click="showPreviewer(index)">
            <img
              :src="item.targetUrl+'?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width"
              :alt="item.id"
              class="previewer-img"
            />
          </div>
        </li>

        <!--正在上传的动画区-->
        <li
          class="img-list bgImg uploading-img"
          :style="{width: width+'px', height: height+'px'}"
          v-show="uploadingFilesArr"
          v-for="(itm,val) in uploadingFilesArr"
          :key="'c'+val"
        >
          <el-progress type="circle" :stroke-width="5" :width="height" :percentage="itm.percent"></el-progress>
        </li>

        <!--上传按钮区-->
        <li
          class="img-list pointer"
          :class="{ disabledUpload: isDisabledUpload}"
          @click="disableUpload"
          :style="{width: width + 'px', height: height + 'px'}"
          v-show="showUploadBtn"
          ref="selectFile"
        >
          <slot name="selectFile"></slot>
        </li>
      </ul>
      <!--图片展示区-->
      <div>
        <!-- <v-vueGallery :images="filesList" :index="showImgIndex" @close="showImgIndex = null"></!-->
        -->
      </div>
    </div>
    <div v-else>
      <div ref="selectFile" class="pointer" @click="disableUpload">
        <slot name="selectFile"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import plupload from "plupload";
// import VueGallery from "vue-gallery";
import { mapMutations } from "vuex";
import * as types from "store/mutations-types";
export default {
  data() {
    return {
      accessTokenObj: {},

      uploadingFilesArr: [],

      uploader: null,
      uploadData: null,

      showImgIndex: null,
      showBtn: true,

      buttonLoading: false
    };
  },

  props: {
    routerName: {
      type: String,
      default: ""
    },
    uploadType: {
      //上传类型  是照片还是文件
      type: String,
      default: function() {
        return "photo";
      }
    },
    apiServer: Object, //服务器的接口 getAccessToken
    minLength: {
      //最小能上传文件数
      type: Number,
      default: function() {
        return 1;
      }
    },
    maxLength: {
      // 最大能上传文件数
      type: Number,
      default: function() {
        return 1;
      }
    },

    maxFileSize: {
      // 最大上传文件大小
      type: String,
      default: function() {
        return "10mb";
      }
    },
    multiSelection: {
      //能否多选
      type: Boolean,
      default: function() {
        return false;
      }
    },
    mimeTypes: {
      //上传的文件类型
      default: function() {
        return "image/*";
      }
    },

    files: {
      //  已传文件
      type: Array,
      default: function() {
        return [];
      }
    },
    isCanEdit: {
      //是否能编辑
      type: Boolean,
      default: function() {
        return true;
      }
    },
    isShowDelete: {
      //是否显示删除按钮
      type: Boolean,
      default: function() {
        return true;
      }
    },
    width: {
      //图片上传时 样式宽
      type: Number,
      default: function() {
        return 102;
      }
    },
    height: {
      //图片上传时 样式高
      type: Number,
      default: function() {
        return 96;
      }
    },
    isDisabledUpload: {
      //是否禁止上传
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },

  computed: {
    filesList() {
      //图片数组集合
      let arr = [];
      if (this.files) {
        this.files.forEach((item, index) => {
          arr.push(item.targetUrl);
        });
      }
      return arr;
    },

    showUploadBtn() {
      //是否显示图片上传按钮
      return (
        this.showBtn && this.files.length < this.maxLength && this.isCanEdit
      );
    }
  },
  components: {
    // "v-vueGallery": VueGallery
  },

  mounted() {
    if (this.uploadType == "photo") {
      //如果是照片类型的上传
      this.createPhotoUploader();
    } else {
      //否则是文件类型的上传
      this.createFileUploader();
    }
  },
  methods: {
    ...mapMutations([
      types.CHANGE_PROCESS_DIALOG,
      types.CHANGE_PROCESS_PERCENT
    ]),

    hideProcessDialog() {
      //隐藏文件上传时的进度条模态 框
      this[types.CHANGE_PROCESS_DIALOG](false);
      this[types.CHANGE_PROCESS_PERCENT](0);
    },

    disableUpload() {
      // 点击上传按钮时  判断是否禁用上传
      if (this.isDisabledUpload) this.uploader.disableBrowse();
    },
    /*获取token*/
    getToken() {
      let url = this.apiServer.getAccessToken.url;
      let method = this.apiServer.getAccessToken.method;
      if (!url || !method) {
        this.$message({
          type: "success",
          message: "请先填写必要的信息，再上传文件"
        });
        return;
      }
      return this.$axios({
        url: url,
        method: method || "get"
      }).then(res => {
        this.accessTokenObj = res.data.data || {};
        this.accessTokenObj.host = this.accessTokenObj.host.replace(
          "http",
          "https"
        );
        // console.log("获取的accessToken11", this.accessTokenObj);
        return Promise.resolve();
      });
    },
    getAccessToken() {
      let _Now = new Date().getTime() / 1000;
      if (!!Object.keys(this.accessTokenObj).length) {
        if (_Now + 3 > this.accessTokenObj.expire) {
          //过期了
          console.log("过期了,再次获取token");
          return this.getToken();
        } else {
          console.log("没过期,不用再次获取token");
          return Promise.resolve();
        }
      } else {
        console.log("没有accessTokenObj 获取token...");
        return this.getToken();
      }
    },

    //获取文件格式名
    get_suffix(filename) {
      let pos = filename.lastIndexOf(".");
      let suffix = "";
      if (pos != -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    formatFileName(fileId, filename) {
      //格式化文件名
      return this.accessTokenObj.dir + fileId + this.get_suffix(filename);
    },
    //设置上传参数
    set_upload_param(up, fileId, filename) {
      this.uploadData = {
        key: this.formatFileName(fileId, filename),
        policy: this.accessTokenObj.policy,
        OSSAccessKeyId: this.accessTokenObj.accessid,
        success_action_status: "200",
        signature: this.accessTokenObj.signature
      };

      up.setOption({
        url: this.accessTokenObj.host,
        multipart_params: this.uploadData
      });
    },

    createFileUploader() {
      //创建文件上传实例 [{ title : "Xlsx files", extensions : "xlsx" }]
      let that = this;
      that.uploader = new plupload.Uploader({
        runtimes: "html5",
        browse_button: that.$refs.selectFile,
        multi_selection: that.multiSelection,
        filters: {
          mime_types: that.mimeTypes,
          max_file_size: that.maxFileSize
        },
        /*chunk_size: '400kb',*/
        max_retries: 1,
        url: that.accessTokenObj["host"]
      });
      that.uploader.init();
      that.uploader.bind("FilesAdded", (up, files) => {
        console.log("选择的文件数组集", files);
        let stillLength = that.maxLength - that.files.length;
        if (files.length > stillLength) {
          that.$message({
            message: `最多上传${that.maxLength}个文件,还能上传${stillLength}个`,
            type: "warning"
          });
          up.splice(0, up.files.length);
        } else {
          console.log("选择的图片数量符合。。");
          that.getAccessToken().then(() => {
            plupload.each(files, function(file) {
              that.uploadingFilesArr.push(file);
            });
            console.log("文件添加后的数组：", that.uploadingFilesArr);
            that.fileName = files[0].name;
            up.start();
          });
        }
      });
      that.uploader.bind("BeforeUpload", (up, file) => {
        console.log("开始上传");
        that.set_upload_param(up, file.id, file.name, true);
        that[types.CHANGE_PROCESS_DIALOG](true);
      });
      that.uploader.bind("UploadProgress", (up, file) => {
        console.log("正在上传");
        that[types.CHANGE_PROCESS_PERCENT](file.percent);
      });
      that.uploader.bind("FileUploaded", (up, file, res) => {
        console.log("走到上传后这一步", res);
        let obj = {
          res,
          fileName: that.formatFileName(file.id, file.name)
        };
        that.$emit("uploadedFile", obj);
        // that.hideProcessDialog()
      });

      that.uploader.bind("Error", (up, err) => {
        console.log("plupload错误代码", err);
        that.hideProcessDialog();
        switch (code) {
          case -600:
            that.$message({
              message: `请选择上传10MB以下的文件！`,
              type: "warning",
              duration: 3600
            });
            break;
          case -601:
            that.$message({
              message: `请选择上传.xlsx文件！`,
              type: "warning",
              duration: 3600
            });
            break;
          default:
            that.$message({
              message: `上传失败！`,
              type: "warning",
              duration: 3600
            });
        }
        up.splice(0, up.files.length);
        that.uploadingFilesArr = [];
      });
    },

    createPhotoUploader() {
      if (this.routerName === "waiting") {
        return;
      }
      let that = this;
      that.uploader = new plupload.Uploader({
        runtimes: "html5",
        browse_button: that.$refs.selectFile, //选择文件按钮'selectfile'+this.idx
        multi_selection: this.multiSelection,
        filters: {
          mime_types: this.mimeTypes,
          max_file_size: this.maxFileSize
        },
        /*chunk_size: '400kb',*/
        max_retries: 1,
        url: that.accessTokenObj["host"]
      });

      that.uploader.init();
      that.uploader.bind("FilesAdded", (up, files) => {
        /*that.ulWrapper = that.$refs.ulWrapper*/
        console.log("选择的uploader对象=》", up);
        let stillLength = that.maxLength - that.files.length;
        if (files.length > stillLength) {
          that.$message({
            message: `最多上传${that.maxLength}张图片,还能上传${stillLength}张`,
            type: "warning"
          });
          up.splice(0, up.files.length);
        } else {
          console.log("选择的图片数量符合。。");
          that.getAccessToken().then(() => {
            plupload.each(files, function(file) {
              that.uploadingFilesArr.push(file);
            });
            console.log("文件添加后的数组：", that.uploadingFilesArr);
            that.showBtn = false;
            up.start();
          });
        }
      });
      that.uploader.bind("BeforeUpload", (up, file) => {
        that.set_upload_param(up, file.id, file.name, true);
      });
      that.uploader.bind("UploadProgress", (up, file) => {
        that.uploadingFilesArr.forEach((item, index) => {
          if (item.id == file.id) {
            item.percent = file.percent;
          }
        });
        console.log("文件上传过程中的数组=》", that.uploadingFilesArr);
      });
      that.uploader.bind("FileUploaded", (up, file, res) => {
        console.log("走到上传最后这一步返回的res", res);
        console.log("走到上传最后这一步返回的uploader", up);
        let obj = {
          res,
          accessTokenObj: this.accessTokenObj,
          fileName: file.id + that.get_suffix(file.name),
          fileId: file.id
        };
        that.$emit("uploadedFile", obj);
      });

      that.uploader.bind("Error", (up, err) => {
        console.log("plupload错误代码", err);
        let code = err.code;
        if (code == -600) {
          that.$message({
            message: `上传图片过大`,
            type: "warning",
            duration: 3600
          });
        } else {
          that.$message({
            message: `上传失败！`,
            type: "warning",
            duration: 3600
          });
        }
        up.splice(0, up.files.length);
        that.uploadingFilesArr = [];
        that.showBtn = true;
      });
    },
    //  图片上传完成时 删除uploadingFilesArr正在上传中的数组
    deleteUploadingFile(fileId) {
      this.uploadingFilesArr.forEach((item, index) => {
        if (item.id == fileId) {
          this.uploadingFilesArr.splice(index, 1);
        }
      });
    },
    //删除图片
    deleteFile(index) {
      this.uploader.refresh();
      this.$emit("deleteFile", index);
    },

    _showUploadBtn() {
      //显示上传按钮
      this.showBtn = true;
    },

    //预览图片
    showPreviewer(index) {
      this.showImgIndex = index;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" >
@import "~styles/variable.scss";

$margin-left: 16px;
.upload-con {
  .disabledUpload {
    cursor: not-allowed;
  }
}
.img-wraaper {
  // 已传图片区
  .img-list {
    float: left;
    margin-bottom: $margin-left;
    margin-right: $margin-left;
    &.img-arr {
      position: relative;
      z-index: 100;
      // 删除按钮
      .delete {
        position: absolute;
        font-size: 22px;
        top: -9px;
        right: -9px;
        color: $labelColor;
        cursor: pointer;
      }
    }
    .img-item {
      height: 100%;
      cursor: -webkit-zoom-in;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &:nth-child(4n + 0) {
      margin-right: 0;
    }
    &.uploading-img {
      text-align: center;
    }
  }
}
</style>
