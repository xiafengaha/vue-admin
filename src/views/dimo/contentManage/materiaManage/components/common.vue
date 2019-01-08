<template>
  <!--<span>图片库</span>-->
  <div>
    <el-row :gutter="16" type="flex">
      <el-col :span="24">
        <el-button v-db-click v-has="'material.add'" type="primary" @click="uploadImg">
          {{ parentData.type === 1 ? '视频上传' : '图片上传' }}
        </el-button>
        <div style="text-align: right;float: right">
          <el-select
            v-loadmore="loadMore"
            v-has="'goodsTag.index'"
            v-model="ruleForm.tag"
            style="margin-left: 20px;"
            clearable
            placeholder="请选择场景标签"
            @focus="initCatTags(false)">
            <el-option
              v-for="item in sceneTags"
              :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select>
          <el-select
            v-model="ruleForm.sexy"
            style="margin-left: 20px;"
            clearable
            placeholder="请选择性别属性">
            <el-option
              v-for="item in sexTags"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select
            v-model="ruleForm.location"
            style="margin-left: 20px;"
            clearable
            placeholder="请选择地区属性">
            <el-option
              v-for="item in areaTags"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select
            v-model="ruleForm.age"
            style="margin-left: 20px;"
            clearable
            placeholder="请选择年龄属性">
            <el-option
              v-for="item in ageTags"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-button type="primary" style="margin-left: 20px" @click="clearAll">重置</el-button>
          <el-button type="primary" style="margin-left: 20px;" @click="searchList(ruleForm)">搜索</el-button>
        </div>
      </el-col>
      <!--<el-col :span="4">-->
      <!--</el-col>-->
    </el-row>
    <el-row :gutter="16" style="margin-top: 10px">
      <!--<el-col :span="24">-->
      <el-col :span="4">
        <el-card>
          <el-tabs v-model="tabsActive" tab-position="left" style="max-height: calc(100vh - 300px);overflow: auto" @tab-click="changeTabs">
            <el-tab-pane v-for="item in groupingList" :label="item.title" :name="item.title + item.id" :key="item.id" :value="item.id" />
          </el-tabs>
          <el-button v-db-click v-has="'materialGroup.index'" type="primary" @click="addGrouping">
            分组管理
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="20">
        <!--<span>1111</span>-->
        <el-row :gutter="16">
          <el-col v-for="(item, index) in listData.data" :span="4" :key="item.id" style="position: relative;" class="list-img" >
            <div v-if="parentData.type === 2" @mouseenter="imgEnter(index)" @mouseleave="imgLeave(index)">
              <section v-for="(items, indexs) in item.url" :key="indexs + item.id" class="img-flex">
                <img
                  v-preview="items"
                  v-show="indexs === 0"
                  :src="imgPrefix + items + '?x-oss-process=image/resize,l_100'"
                  alt="测试"
                  style="height: 100px"
                  class="img-small"
                  preview-title-enable="true"
                  preview-nav-enable="true"
                >
              </section>
              <div class="icon-position">
                <el-row :gutter="16">
                  <el-col :span="8" style="text-align: center">
                    <div @click="editImg(item)">
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <svg-icon style="color: #fff;cursor: pointer" icon-class="edit" />
                      </el-tooltip>
                    </div>
                  </el-col>
                  <el-col :span="8" style="text-align: center">
                    <div @click="delImg(item)">
                      <el-tooltip class="item" effect="dark" content="删除" placement="top" >
                        <svg-icon style="color: #fff;cursor: pointer" icon-class="trash"/>
                      </el-tooltip>
                    </div>

                  </el-col>

                </el-row>
              </div>
            </div>
            <div v-else-if="parentData.type === 1" @mouseenter="imgEnter(index)" @mouseleave="imgLeave(index)">
              <div >
                <video :src="item.url ? imgPrefix + item.url[0]: ''" :poster="imgPrefix +item.video_img + '?x-oss-process=image/resize,h_115'" controls style="width: 100%;height: 115px" />
              </div>
              <div class="icon-position">
                <el-row :gutter="16">
                  <el-col :span="8" style="text-align: center">
                    <div v-has="'material.edit'" @click="editImg(item)">
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <svg-icon style="color: #fff;cursor: pointer" icon-class="edit" />
                      </el-tooltip>
                    </div>
                  </el-col>
                  <el-col :span="8" style="text-align: center">
                    <div @click="delImg(item)">
                      <el-tooltip class="item" effect="dark" content="删除" placement="top" >
                        <svg-icon style="color: #fff;cursor: pointer" icon-class="trash"/>
                      </el-tooltip>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="img-title">
              <el-tooltip :content="item.title" class="item" effect="dark" placement="bottom">
                <span>{{ item.title }}</span>
              </el-tooltip>
            </div>

          </el-col>
        </el-row>
        <!--</el-col>-->
        <pagination v-show="listData._count > 0" :total="listData._count" :page.sync="listData.offset" :limit.sync="listData.limit" style="text-align: right;" @pagination="searchPaginationList" />
      </el-col>
    </el-row>
    <!--分组管理弹窗-->
    <self-dialog
      :visible.sync="dialogGrouping"
      title="分组管理"
      width="30%"

    >
      <el-table
        :data="groupingList"
        border
      >
        <el-table-column prop="title" label="分组名称" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-db-click :disabled="scope.row.id ? false : true" type="text" @click="delGrouping(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-db-click type="text" @click="dialogAddGrouping('addGroupingForm')">增加分组</el-button>
      <self-dialog
        :visible.sync="addGialogGrouping"
        width="30%"
        title="新建分组"
        append-to-body>
        <el-form ref="addGroupingForm" :model="addGroupingForm" :rules="addGroupingRules" label-width="100px">
          <el-form-item label="分组名称" prop="title">
            <el-input v-model="addGroupingForm.title" placeholder="请填写分组名称"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('addGroupingForm')">取 消</el-button>
          <el-button type="primary" @click="ensureAddGroup('addGroupingForm')">确 定</el-button>
        </span>
      </self-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGrouping = false">取 消</el-button>
        <el-button type="primary" @click="dialogGrouping = false">确 定</el-button>
      </span>
    </self-dialog>
    <!--图片上传-->
    <self-dialog
      :visible.sync="dialogImg"
      :title="imgTitle + parentData.title"
      :before-close="handleClose"
      width="30%"
    >
      <!--<span>这是一段信息</span>-->
      <el-row :gutter="16">
        <el-form ref="imgForm" :model="imgForm" :rules="imgRules" label-width="100px">
          <el-col :span="24">
            <el-form-item label="素材名称:" prop="title">
              <!--<el-col :span="12">-->
              <el-input v-model="imgForm.title" style="width: 174px;" placeholder="请输入素材名称" />
              <!--</el-col>-->
            </el-form-item>
          </el-col>
          <el-col v-if="parentData.type === 1" :span="24">
            <el-form-item label="视频预览图" required>
              <!--<el-col v-if="parentData.type === 1" :span="12">-->
              <my-upload ref="previewUpload" :upload-data="previewUploadData" @uploadSuccessUrl="getPreviewSuccessUrl" @delImg="getPreviewDel"/>
              <!--</el-col>-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'上传' + parentData.title" required>
              <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片类型:">
              <el-radio-group v-model="imgForm.type_img">
                <el-radio :label="1">横图</el-radio>
                <el-radio :label="2">竖图</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择分组:" prop="cate">
              <el-select v-model="imgForm.cate" placeholder="请选择" clearable>
                <el-option
                  v-for="item in groupingList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="场景标签:">
              <el-checkbox-group v-model="imgForm.tag_id" @change="getSceneTag">
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in sceneTags" :key="item.id" :label="item.id" style="margin-right: 10px;margin-top: 5px">{{ item.title }}</el-checkbox-button>
              </el-checkbox-group>
              <el-button v-db-click v-show="loadMoreBtnShow" type="text" @click="loadMore">
                加载更多
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开放权限:">
              <el-checkbox :indeterminate="levelIsIndeterminate" v-model="checkAllLevel" @change="handleAllLevel">全部</el-checkbox>
              <div style="margin: 15px 0;"/>
              <el-checkbox-group v-model="imgForm.level" @change="handleLevelChange">
                <el-checkbox v-for="item in levelTags" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别匹配:">
              <el-checkbox :indeterminate="sexIsIndeterminate" v-model="checkAllSex" @change="handleAllSex">全部</el-checkbox>
              <div style="margin: 15px 0;"/>
              <el-checkbox-group v-model="imgForm.sexy" @change="handleSexChange">
                <el-checkbox v-for="item in addSexTags" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="年龄匹配:">
              <el-checkbox :indeterminate="ageIsIndeterminate" v-model="checkAllAge" @change="handleAllAge">全部</el-checkbox>
              <div style="margin: 15px 0;"/>
              <el-checkbox-group v-model="imgForm.age" @change="handleAgeChange">
                <el-checkbox v-for="item in ageTags" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地区匹配:">
              <el-checkbox :indeterminate="locationIsIndeterminate" v-model="checkAllLocation" @change="handleAllLocation">全部</el-checkbox>
              <div style="margin: 15px 0;"/>
              <el-checkbox-group v-model="imgForm.location" @change="handleLocationChange">
                <el-checkbox v-for="item in areaTags" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="resetCancel('ruleForm')">取 消</el-button>
        <el-button v-db-click @click="resetAll">重 置</el-button>
        <el-button v-db-click type="primary" @click="ensureAddImg('imgForm')">确 定</el-button>
      </span>
    </self-dialog>
  </div>

</template>

<script>
import myUpload from '@/components/Upload/uploadBtn'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { uploadGrouping } from '@/api/common'
import { getSession } from '@/utils/auth'
import { materialList, materialAdd, materialDetail, materialUplate, materialDel } from '@/api/contentManage/material'
import { materialGroupList, materialGroupAdd, materialGroupDel } from '@/api/contentManage/materialGrouping'
import '../style/pictures.scss'
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  name: 'Common',
  components: {
    myUpload,
    Pagination,
    selfDialog
  },
  props: {
    parentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      uploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: this.parentData.type === 1 ? 1 : 99, // 上传限制的数量
        listShow: true, // 自定义图片列表是否显示
        accept: this.parentData.accept, // 文件上传格式
        multiple: this.parentData.type !== 1, // 是否多选
        listType: 'text', // 列表展示格式
        type: this.parentData.type // 2是图片，1是视频，3是音频
      },
      previewUploadData: { // 预览图片的文件上传配置
        showList: false,
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 1,
        listShow: true,
        accept: 'image/jpeg,image/gif,image/png',
        multiple: false,
        listType: 'text', // 列表展示格式
        tip: '',
        type: 2
      },
      ruleForm: {
        offset: 0,
        limit: 10,
        type: this.parentData.type
      }, // 搜索数据
      sceneTags: [], // 场景标签
      sexTags: [], // 性别标签
      levelTags: [], // 开放权限标签
      catList: { // 场景标签的请求数据
        offset: 0,
        limit: 10
      },
      areaTags: [], // 地区标签
      ageTags: [], // 年龄标签
      listData: {
        data: [], // 列表数据
        offset: 0,
        limit: 10,
        _count: 0
      },
      groupingList: [], // 分组列表
      dialogGrouping: false, // 分组管理弹窗
      addGialogGrouping: false, // 增加分组弹窗
      // groupingTableData: [], // 分组管理table数据
      addGroupingForm: {}, // 新增分组的form
      addGroupingRules: {
        title: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      },
      dialogImg: false,
      imgForm: {
        sexy: [],
        age: [],
        location: [],
        tag_id: [],
        type: this.parentData.type,
        type_img: 1
      },
      imgRules: {
        title: [
          { required: true, message: '请输入素材名称', trigger: 'blur' }
        ],
        cate: [
          { required: true, message: '请选择分组', trigger: 'change' }
        ]
      },
      sexIsIndeterminate: false, // 性别选中状态
      addSexTags: [], // 新增图片时的性别
      checkAllSex: false, // 是否全选性别
      ageIsIndeterminate: false, // 年龄选中状态
      checkAllLevel: false, // 是否全选权限
      levelIsIndeterminate: false, // 权限选中状态
      checkAllAge: false, // 是否全选性别
      locationIsIndeterminate: false, // 区域选中状态
      checkAllLocation: false, // 是否全选区域
      imgTitle: '添加',
      tabsActive: '默认分组0',
      imgPrefix: '', // 文件前缀
      loadMoreBtnShow: true,
      updateImgForm: {},
      cancelLoadMore: true //  是否需要加载更多
    }
  },
  created() {
    this.initSex() // 初始化性别
    // this.initCatTags(false) // 初始化素材分组 false是不需要累加
    this.initSession() // 获取session数据
    this.initImgPrefix() // 获取图片前缀
    this.getGrouping() // 得到分组
  },
  methods: {
    initImgPrefix() {
      this.imgPrefix = JSON.parse(sessionStorage.getItem('userInfo')).OSS_CDN_DOMAIN
    },
    getUploadSuccessUrl(data, imgList) { // 上传图片成功提示
      // console.log(data, imgList)
      this.imgForm.url = JSON.parse(JSON.stringify(imgList))
    },
    initSex() { // 初始化性别
      let storeSex = this.$store.state.user.sex
      this.sexTags = JSON.parse(JSON.stringify(storeSex))
      this.addSexTags = storeSex.filter(item => {
        return item.value !== 0
      })
      // console.log(this.addSexTags)
    },
    initCatTags(type) { // 初始化素材分组
      let oldData = JSON.parse(JSON.stringify(this.sceneTags)) // 旧数据
      uploadGrouping(this.catList).then(res => {
        // console.log(res, 'res')
        type // 需要累加
          ? this.sceneTags = oldData.concat(res.data.data)
          : this.sceneTags = JSON.parse(JSON.stringify(res.data.data))
        this.sceneTags.length === res.data._count // 相同就不让它继续点击加载更多了
          ? this.loadMoreBtnShow = false : this.loadMoreBtnShow = true
        if (res.data._count === this.sceneTags.length) { // 相同就没必要在加载更多了
          this.cancelLoadMore = false
        } else {
          this.cancelLoadMore = true
        }
      })
    },
    loadMore() { // 下拉加载更多
      // console.log('123')
      this.catList.offset += 10
      if (this.cancelLoadMore) {
        this.initCatTags(true)
      }
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
      this.handleAllLevel(true)
      this.handleAllAge(true)
      this.handleAllSex(true)
      this.handleAllLocation(true)
      this.checkAllLevel = true
      this.checkAllAge = true
      this.checkAllLocation = true
      this.checkAllSex = true
      this.levelIsIndeterminate = false
      this.sexIsIndeterminate = false
      this.ageIsIndeterminate = false
      this.locationIsIndeterminate = false
    },
    searchList(data) { // 搜索列表
      // this.ruleForm.
      materialList(data).then(res => {
        // console.log(res, 'reslist')
        this.listData.data = JSON.parse(JSON.stringify(res.data.data))
        this.listData._count = res.data._count
        // let imgUrl = ['http://img.zcool.cn/community/017c5d554909920000019ae9d202fe.jpg@1280w_1l_2o_100sh.jpg', 'http://pic21.nipic.com/20120606/9894079_125631317106_2.jpg']
        // this.listData.url = imgUrl
        // this.listData.data.forEach(item => {
        //   item.url = imgUrl
        // })
        // console.log(this.listData)
      })
    },
    imgEnter(index) { // 鼠标移入
      let getDom = document.getElementsByClassName('list-img')[index]
      // console.log(getDom, 'getDome')
      let childLen = getDom.children[0].children.length // 子节点长度
      let childDom = getDom.children[0].children[childLen - 1]
      childDom.style.display = 'block'
    },
    imgLeave(index) { // 鼠标移出
      let getDom = document.getElementsByClassName('list-img')[index]
      let childLen = getDom.children[0].children.length // 子节点长度
      let childDom = getDom.children[0].children[childLen - 1]
      childDom.style.display = 'none'
    },
    replaceImg(index) { // 更换图片

    },
    editImg(row) { // 编辑图片
      this.dialogImg = true
      this.$nextTick(() => {
        this.resetForm('imgForm')
      })
      this.imgTitle = '修改'
      this.materialDetailApi(row.id)
      // this.imgForm = JSON.parse(JSON.stringify(row))
      // this.imgForm.sexy = row.sexy.split(',')
      // console.log(this.imgForm, 'row')
    },
    materialDetailApi(id) {
      materialDetail(id).then(res => {
        // console.log(res, 'res')
        this.imgForm = JSON.parse(JSON.stringify(res.data))
        this.updateImgForm = JSON.parse(JSON.stringify(res.data))
        this.resetDataHandle(res.data)
      })
    },
    resetDataHandle(data) {
      // console.log(data, 'data')
      this.$refs.uploadBtn.uploadSuccessFilesList = JSON.parse(JSON.stringify(data.url))
      if (this.parentData.type === 1) {
        this.$refs.previewUpload.uploadSuccessFilesList = [JSON.parse(JSON.stringify(data.video_img))]
      }
      // console.log(res.data, 'data')
      if (data.sexy === 0) { // 0就是全部 性别处理
        this.imgForm.sexy = [1, 2]
        this.sexIsIndeterminate = false
        this.checkAllSex = true
      } else {
        this.imgForm.sexy = [data.sexy]
        this.sexIsIndeterminate = true
        this.checkAllSex = false
      }
      let newAge = this.imgForm.age.map((item, index) => {
        // this.imgForm.age[index] = String(item)
        return String(item)
      })
      let newLocation = this.imgForm.location.map((item, index) => {
        // this.imgForm.age[index] = String(item)
        return String(item)
      })
      let newLevel = this.imgForm.level.map((item, index) => {
        // this.imgForm.age[index] = String(item)
        return String(item)
      })
      this.imgForm.age = JSON.parse(JSON.stringify(newAge))
      this.imgForm.location = JSON.parse(JSON.stringify(newLocation))
      this.imgForm.level = JSON.parse(JSON.stringify(newLevel))
      let locationLen = this.imgForm.location.length // 地区长度
      let ageLen = this.imgForm.age.length // 年龄长度
      let levelLen = this.imgForm.level.length // 权限长度
      if (locationLen === 0) { // 等于0时
        this.locationIsIndeterminate = false
        this.checkAllLocation = false
      } else if (locationLen > 0 && locationLen < this.areaTags.length) {
        this.locationIsIndeterminate = true
        this.checkAllLocation = false
      } else {
        this.locationIsIndeterminate = false
        this.checkAllLocation = true
      }
      if (ageLen === 0) { // 等于0时
        this.ageIsIndeterminate = false
        this.checkAllAge = false
      } else if (ageLen > 0 && ageLen < this.ageTags.length) {
        this.ageIsIndeterminate = true
        this.checkAllAge = false
      } else {
        this.ageIsIndeterminate = false
        this.checkAllAge = true
      }
      if (levelLen === 0) { // 等于0时
        this.levelIsIndeterminate = false
        this.checkAllLevel = false
      } else if (levelLen > 0 && ageLen < this.levelTags.length) {
        this.levelIsIndeterminate = true
        this.checkAllLevel = false
      } else {
        this.levelIsIndeterminate = false
        this.checkAllLevel = true
      }
    },
    delImg(row) { // 删除图片
      this.$confirm('此操作将永久删除(' + row.title + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delImgApi(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delImgApi(id) {
      materialDel(id).then(res => {
        this.$message.success('删除成功')
        this.searchList(this.ruleForm)
      })
    },
    searchPaginationList(data) { // 分页
      this.ruleForm.offset = (data.page - 1) * 10
      this.ruleForm.limit = data.limit
      this.searchList(this.ruleForm)
    },
    getGrouping() {
      // this.groupingTableData = [
      //   {
      //     title: '测试测试0',
      //     index: 0
      //   },
      //   {
      //     title: '测试测试1',
      //     index: 1
      //   }
      // ]
      let params = Object.assign({}, this.catList)
      params.type = this.parentData.type
      materialGroupList(params).then(res => {
        // console.log(res, ' res123')
        this.groupingList = JSON.parse(JSON.stringify(res.data.data))
        this.groupingList.splice(0, 0, { title: '默认分组', id: 0 })
        this.ruleForm.cate = 0
        this.searchList(this.ruleForm)
      })
    },
    addGrouping() { // 分组管理
      this.dialogGrouping = true
    },
    delGrouping(row) { // 删除分组
      this.$confirm('此操作将永久删除(' + row.title + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delApi(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delApi(id) {
      materialGroupDel(id).then(res => {
        this.$message.success('删除成功')
        this.getGrouping()
      })
    },
    dialogAddGrouping(formName) { // 新增分组
      this.addGialogGrouping = true
      // this.resetForm('addGroupingForm')
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      // if (this.$refs[formName] !== undefined) {
      //   this.$refs[formName].resetFields()
      // }
      // this.addGroupingForm.title = ''
    },
    resetForm(formName) {
      // this.$nextTick(() => {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      // })
      // console.log(formName, 'formName')
      if (formName !== 'addGroupingForm') {
        for (let item in this.imgForm) {
          this.imgForm[item] = ''
        }
        this.imgForm.sexy = []
        this.imgForm.age = []
        this.imgForm.location = []
        this.imgForm.tag_id = []
        this.imgForm.type = this.parentData.type
        this.imgForm.type_img = 1
        this.sexIsIndeterminate = false
        this.ageIsIndeterminate = false
        this.locationIsIndeterminate = false
        this.levelIsIndeterminate = false
        this.checkAllAge = false
        this.checkAllLocation = false
        this.checkAllSex = false
        this.checkAllLevel = false
        // checkAllLevel
        // this.$nextTick(() => {
        this.$refs.uploadBtn.uploadSuccessFilesList = []
        if (this.parentData.type === 1) {
          this.$refs.previewUpload.uploadSuccessFilesList = []
        }
        // })
      }
    },
    cancel(formName) {
      this.resetForm(formName)
      this.addGialogGrouping = false
    },
    uploadImg() { // 图片上传功能
      this.dialogImg = true
      // imgTitle + parentData.title
      this.imgTitle = '新增'
      this.parentData.title = this.parentData.type === 1 ? '视频' : '图片'
      this.$nextTick(() => {
        this.$refs['imgForm'].clearValidate()
      })
      // this.resetForm('imgForm')
    },
    ensureAddGroup(formName) { // 新增分组
      this.addGroupingForm.type = this.parentData.type
      this.$refs[formName].validate((valid) => {
        if (valid) {
          materialGroupAdd(this.addGroupingForm).then(res => {
            // console.log(res, 'xinzeng')
            this.$message.success('新增分组成功')
            this.getGrouping()
            this.resetForm(formName)
            // this.dialogGrouping = false
            this.addGialogGrouping = false
          })
        } else {
          return false
        }
      })
    },
    changeTabs(tab, e) { // 切换分组
      let valueId = tab.$attrs.value // 得到tab页的id
      // this.tabsActive = tab.name + valueId
      this.ruleForm.cate = valueId
      this.searchList(this.ruleForm)
    },
    handleAllSex(val) { // 性别全选
      this.imgForm.sexy = (val ? JSON.parse(JSON.stringify(this.getIdFun(this.addSexTags))) : JSON.parse(JSON.stringify([])))
      this.sexIsIndeterminate = false
    },
    handleSexChange(value) { // 选择单个
      let checkLen = value.length
      this.checkAllSex = checkLen === this.addSexTags.length
      this.sexIsIndeterminate = checkLen > 0 && checkLen < this.addSexTags.length
      this.imgForm.sexy = JSON.parse(JSON.stringify(value))
    },
    handleLevelChange(value) { // 选择单个
      let checkLen = value.length
      this.checkAllLevel = checkLen === this.levelTags.length
      this.levelIsIndeterminate = checkLen > 0 && checkLen < this.levelTags.length
      console.log(this.levelIsIndeterminate)
      this.imgForm.level = JSON.parse(JSON.stringify(value))
    },
    handleAllLevel(val) { // 权限全选
      this.imgForm.level = (val ? JSON.parse(JSON.stringify(this.getIdFun(this.levelTags))) : JSON.parse(JSON.stringify([])))
      this.levelIsIndeterminate = false
    },
    handleAllAge(val) { // 年龄全选
      this.imgForm.age = (val ? JSON.parse(JSON.stringify(this.getIdFun(this.ageTags))) : JSON.parse(JSON.stringify([])))
      this.ageIsIndeterminate = false
    },
    handleAgeChange(value) { // 年龄选择单个
      let checkLen = value.length
      // console.log(value, 'value')
      this.checkAllAge = checkLen === this.ageTags.length
      this.ageIsIndeterminate = checkLen > 0 && checkLen < this.ageTags.length
      this.imgForm.age = JSON.parse(JSON.stringify(value))
    },
    handleAllLocation(val) { // 区域全选
      this.imgForm.location = (val ? JSON.parse(JSON.stringify(this.getIdFun(this.areaTags))) : JSON.parse(JSON.stringify([])))
      this.locationIsIndeterminate = false
    },
    handleLocationChange(value) { // 区域选择单个
      let checkLen = value.length
      // console.log(value, 'value')
      this.checkAllLocation = checkLen === this.areaTags.length
      this.locationIsIndeterminate = checkLen > 0 && checkLen < this.areaTags.length
      this.imgForm.location = JSON.parse(JSON.stringify(value))
      // console.log(this.imgForm)
    },
    getIdFun(data) {
      let idData = data.map(item => {
        return item.value
      })
      return idData
    },
    getUploadDel(data) { // 获取用户删除后的数据
      // console.log(data, '删除')
      this.imgForm.url = JSON.parse(JSON.stringify(data))
    },
    ensureAddImg(formName) { // 确定新增图片
      // console.log(this.imgForm, 'imgForm')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.imgForm.sexy.length > 1) {
            this.imgForm.sexy = 0
          } else {
            if (Array.isArray(this.imgForm.sexy)) {
              this.imgForm.sexy = this.imgForm.sexy.join(',')
            } else {
              this.imgForm.sexy = 0
            }
          }
          this.imgTitle === '新增' ? this.materialAddApi(formName) : this.materialUplateApi(formName)
        }
      })
    },
    materialUplateApi(formName) {
      // console.log(this.imgForm)
      materialUplate(this.imgForm).then(res => {
        this.$message.success('修改成功')
        this.resetForm(formName)
        this.dialogImg = false
        this.searchList(this.ruleForm)
        // console.log()
      })
    },
    materialAddApi(formName) {
      // this.imgForm.url = ['11']
      materialAdd(this.imgForm).then(res => {
        this.$message.success('添加成功')
        this.resetForm(formName)
        this.dialogImg = false
        this.searchList(this.ruleForm)
      })
    },
    getSceneTag(val) { // 获取场景标签
      // console.log(val, 'val')

    },
    getPreviewSuccessUrl(data) { // 获取预览图
      // console.log(data, 'data')
      this.imgForm.video_img = data[0].url
    },
    getPreviewDel(data) { // 预览图删除之后
      console.log(data, 'del')
    },
    clearAll() {
      this.ruleForm = {
        offset: 0,
        limit: 10,
        type: this.parentData.type
      }
      this.tabsActive = '默认分组0'
    },
    resetAll() {
      this.resetForm('imgForm')
      if (this.imgTitle === '修改') {
        this.imgForm = JSON.parse(JSON.stringify(this.updateImgForm))
        this.resetDataHandle(this.imgForm)
        // this.$refs.uploadBtn.uploadSuccessFilesList = JSON.parse(JSON.stringify(this.imgForm.url))
        // console.log(this.imgForm, )
      }
    },
    handleClose() {
      this.resetForm('ruleForm')
      this.dialogImg = false
    },
    resetCancel(formName) {
      this.resetForm(formName)
      this.dialogImg = false
    }
  }
}
</script>

<style scoped lang="scss">
  .img-title{
    text-align: center;
    width:calc(100%);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
