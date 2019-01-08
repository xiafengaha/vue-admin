<!--suppress ALL -->
<template>
  <div>
    <span class="bottom-style">编辑商品信息</span>

    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" :inline="true">
      <el-row>
        <el-card style="margin-top: 20px">
          <h4>基本信息</h4>
          <el-col :span="24">
            <el-form-item label="商品类目:" required>
              <el-select v-model="goodsFirstSelect" clearable placeholder="请选择" @change="changeFirstGoodsCate">
                <el-option
                  v-for="item in goodsSelectData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <el-select v-model="goodsSecondSelect" clearable placeholder="请选择" @change="changeSecondGoodsCate">
                <el-option
                  v-for="item in goodsSecondSelectData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <el-select v-model="goodsThirdSelect" clearable placeholder="请选择" @change="changeThirdGoodsCate">
                <el-option
                  v-for="item in goodsThirdSelectData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品名称:" prop="title">
              <el-input v-model="ruleForm.title" style="width: 351px" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="品牌名称:" prop="brand_id">
              <el-select v-model="ruleForm.brand_id" clearable placeholder="请选择">
                <el-option
                  v-for="item in goodsBrandData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品标签:">
              <el-checkbox-group v-model="goodsLabelId" @change="userChangeGoodsLabel">
                <!--@change="userChangeGoodsLabel"-->
                <el-checkbox-button v-for="item in goodsLabelData" :key="item.id" :label="item.id" style="margin-right: 10px">{{ item.name }}</el-checkbox-button>
              </el-checkbox-group>
              <el-button v-show="goodsLabel.offset < goodsLabelTotal" type="text" @click="labelLoadMore">加载更多</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品预览图:" required>
              <my-upload ref="goodsPreviewUpload" :upload-data="goodsPreviewUploadData" @uploadSuccessUrl="getGoodsPreviewSuccessUrl" @delImg="getGoodsPreviewDel"/>
            </el-form-item>
          </el-col>
        </el-card>
        <el-card style="margin-top: 20px">
          <h4>商品属性</h4>
          <el-col :span="24">
            <el-form-item label="编辑属性:">
              <el-form ref="goodsAttribute" :model="attributeForm" label-width="100px">
                <el-row :gutter="16">
                  <el-card v-show="addAttributeData" style="background-color: #fff" class="attribute-card">
                    <el-col v-for="(item, index) in addAttributeData" :key="index" :span="6" style="margin: 20px 0">
                      <el-form-item :label="item">
                        <el-input
                        />
                      </el-form-item>
                    </el-col>
                  </el-card>
                  <span v-show="!addAttributeData">暂无属性</span>
                </el-row>
              </el-form>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="总库存:" prop="stock" required>
              <el-input v-model="ruleForm.stock" style="width: 195px"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品货号:" prop="goods_sn">
              <el-input v-model="ruleForm.goods_sn" style="width: 195px"/>
            </el-form-item>
            <!--<el-form-item label="商品标签:"/>-->
          </el-col>
        </el-card>
        <el-card style="margin-top: 20px">
          <h4>商品信息</h4>
          <el-col :span="24">
            <el-form-item label="零售价:" prop="price" required>
              <el-input v-model="ruleForm.price" placeholder="请输入内容" style="width: 195px">
                <template slot="prepend">¥</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="original_price">
              <el-input v-model="ruleForm.original_price" placeholder="原价: ¥0.00" style="width: 195px"/>
              <el-button type="text" @click="configPrice">设置代理价</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品主图:" required>
              <div class="upload-box overflow-hidden">
                <div class="upload-video float-left" @click="uploadClick(1)">
                  <svg-icon icon-class="video" style="font-size: 20px"/>
                </div>
                <video v-show="saveVideoFiles" :src="imgPrefix + saveVideoFiles" controls style="width: 300px;float: left;margin-right: 20px"></video>
                <!--<upload-video></upload-video>-->
                <div class="upload-img float-left" @click="uploadClick(2)">
                  <i class="el-icon-plus" style="font-size: 20px"/>
                </div>
                <draggable v-model="saveUserChangeFiles" class="el-upload-list el-upload-list--picture-card" element="ul">
                  <li v-for="(item, index) in saveUserChangeFiles" :key="index" tabindex="0" class="el-upload-list__item" style="width: 50px;height: 50px">
                    <img :src="imgPrefix + item + '?x-oss-process=image/resize,m_fixed,h_50,w_50' " alt="" class="el-upload-list__item-thumbnail">
                    <i class="el-icon-close"/>
                    <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-delete" @click="clickMainImgDelete(index)"/>
                  </span>
                </span>
                  </li>
                </draggable>
              </div>
              <p>首张图支持视频文件或图片,建议尺寸: 640 x 640 像素; 视频文件最大支持20M</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="视频预览图:">
              <my-upload ref="previewUpload" :upload-data="previewUploadData" @uploadSuccessUrl="getPreviewSuccessUrl" @delImg="getPreviewDel"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品简介:">
              <textarea v-model="ruleForm.intro" style="width:600px;height: 100px"/>
            </el-form-item>
          </el-col>
        </el-card>
        <el-card style="margin-top: 20px">
          <h4>物流及其它</h4>
          <el-col :span="24">
              <el-radio-group v-model="ruleForm.shipment_id">
                <el-form-item label="运费设置:" prop="postage">
                  <el-radio :label="0">
                    固定邮费
                    <el-input placeholder="请输入内容" v-model="ruleForm.postage" style="width: 195px">
                      <template slot="prepend" style="width: 50px">¥</template>
                    </el-input>
                  </el-radio>
                </el-form-item>
                <el-radio :label="ruleForm.shipment_id === 0 ? 1 : ruleForm.shipment_id" >
                  运费模版
                  <el-select clearable placeholder="请选择" v-model="templateId">
                    <el-option
                      v-for="item in templateListData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-radio>
                <el-button style="margin-left: 10px" type="text" @click="addTemplate">新建</el-button>
              </el-radio-group>
              <!--<el-button type="text">同步</el-button>-->
              <el-form :model="volumes" :rules="volumesRules" label-width="88px" style="margin-top: 10px;margin-left: 100px;width: 100%" :inline="true">
                <el-row>
                    <el-form-item label="体积:" prop="long" required>
                      <el-col :span="8">
                        <el-input v-model="volumes.long" style="width: 195px;" placeholder="长">
                          <template slot="prepend">
                            m
                          </template>
                        </el-input>
                      </el-col>
                    </el-form-item>
                  <el-form-item prop="wide">
                      <el-col :span="8">
                        <el-input v-model="volumes.wide" style="width: 195px;" placeholder="宽">
                          <template slot="prepend">
                            m
                          </template>
                        </el-input>
                      </el-col>
                  </el-form-item>
                  <el-form-item prop="height">
                      <el-col :span="8">
                        <el-input v-model="volumes.height" style="width: 195px;" placeholder="高">
                          <template slot="prepend">
                            m
                          </template>
                        </el-input>
                      </el-col>
                    </el-form-item>
                  <!--</el-col>-->
                </el-row>
                <!--<span>物流体积:</span>-->
                <el-row style="margin-top: 10px">
                  <el-col :span="24">
                    <el-form-item label="重量:" required prop="weight">
                      <el-input v-model="volumes.weight" style="width: 195px;" placeholder="重量">
                        <template slot="prepend">
                          kg
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否上架:">
              <el-radio-group v-model="ruleForm.onsale">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--<el-form-item label="每人限购:">-->
            <!--<el-input style="width: 195px">-->
            <!--0-->
            <!--</el-input>-->
            <!--</el-form-item>-->
          </el-col>
        </el-card>
        <el-card style="margin-top: 20px">
          <h4>商品详情</h4>
          <el-col :span="24">
            <my-upload ref="uploadBtn" :upload-data="uploadData" @uploadSuccessUrl="getUploadSuccessUrl" @delImg="getUploadDel"/>
          </el-col>
        </el-card>
        <el-button v-db-click type="primary" @click="returnPage" style="margin-top: 20px">返 回</el-button>
        <el-button v-db-click @click="resetAll('ruleForm')" style="margin-top: 20px">重 置</el-button>
        <el-button style="margin-top: 20px" v-db-click type="primary" @click="addFrom('ruleForm')">保 存</el-button>

      </el-row>
    </el-form>
    <self-dialog
      :visible.sync="dialogVisible"
      :title="uploadGrouping.type === 1 ? '选择视频': '选择图片'"
      width="1000px"
    >
      <!--<span>这是一段信息</span>-->
      <div>
        <!--<self-dialog-->
          <!--:visible.sync="innerVisible"-->
          <!--width="30%"-->
          <!--title="文件上传"-->
          <!--append-to-body>-->
          <!--<el-row v-if="uploadGrouping.type === 1" :gutter="16">-->
            <!--&lt;!&ndash;// 视频&ndash;&gt;-->
            <!--<el-col v-for="(item, index) in uploadSuccessFilesList" :span="12" :key="index">-->
              <!--<video :src="imgPrefix + item " style="width: 100%" controls/>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row v-else :gutter="16" class="img-box">-->
            <!--&lt;!&ndash;// 图片&ndash;&gt;-->
            <!--<draggable v-model="uploadSuccessFilesList" class="el-upload-list el-upload-list&#45;&#45;picture-card" element="ul">-->
              <!--<li v-for="(item, index) in uploadSuccessFilesList" :key="index" tabindex="0" class="el-upload-list__item" style="width: 50px;height: 50px">-->
                <!--<img :src="imgPrefix + item + '?x-oss-process=image/resize,m_fixed,h_50,w_50' " style="width: 100%" alt="" class="el-upload-list__item-thumbnail">-->
                <!--<i class="el-icon-close"/>-->
                <!--<span class="el-upload-list__item-actions">-->
                  <!--<span class="el-upload-list__item-delete">-->
                    <!--<i class="el-icon-delete" @click="clickImgDelete(index)"/>-->
                  <!--</span>-->
                <!--</span>-->
              <!--</li>-->
            <!--</draggable>-->

          <!--</el-row>-->
          <!--<el-form-->
            <!--ref="uploadForm"-->
            <!--:model="uploadForm"-->
            <!--style="margin-top: 10px"-->
            <!--label-width="100px"-->
            <!--enctype="multipart/form-data"-->
          <!--&gt;-->
            <!--<el-form-item :label="uploadGrouping.type === 1 ? '视频链接:' : '图片链接:'">-->
              <!--&lt;!&ndash;<el-input v-model="uploadForm.img" :disabled="uploadSuccessFilesList.length === 0 ? false : true"/>&ndash;&gt;-->
              <!--<el-upload-->
                <!--ref="upload"-->
                <!--style="margin-top: 10px"-->
                <!--:on-change="handleChange"-->
                <!--:on-remove="handleRemove"-->
                <!--:file-list="fileList"-->
                <!--:show-file-list="false"-->
                <!--:action="uploadUrl"-->
                <!--:auto-upload="false"-->
                <!--:on-exceed="changeExceed"-->
                <!--:limit="uploadGrouping.type === 1 ? 1 : 9"-->
                <!--:accept="uploadGrouping.type === 1 ? '.mp4, .ogg, .webm':'image/jpeg,image/gif,image/png'"-->
                <!--multiple-->
                <!--class="upload-demo">-->
                <!--<el-button slot="trigger" :disabled="uploadForm.url ? true : false" size="small" type="primary">选取文件</el-button>-->
                <!--&lt;!&ndash;<el-button style="margin-left: 10px;" size="small" type="success" @click="newSubmitForm">上传到服务器</el-button>&ndash;&gt;-->
              <!--</el-upload>-->
              <!--&lt;!&ndash;<file-upload&ndash;&gt;-->
              <!--&lt;!&ndash;ref="upload"&ndash;&gt;-->
              <!--&lt;!&ndash;v-model="files"&ndash;&gt;-->
              <!--&lt;!&ndash;@input-file="inputFile"&ndash;&gt;-->
              <!--&lt;!&ndash;@input-filter="inputFilter"&ndash;&gt;-->
              <!--&lt;!&ndash;&gt;&ndash;&gt;-->
              <!--&lt;!&ndash;Upload file&ndash;&gt;-->
              <!--&lt;!&ndash;</file-upload>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-button>上传服务器</el-button>&ndash;&gt;-->
              <!--&lt;!&ndash;<input id="fileUpload" name="fileUpload" type="file" @change="getUploadFile">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-button type="text">本地上传</el-button>&ndash;&gt;-->
            <!--</el-form-item>-->
          <!--</el-form>-->
          <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click="innerVisible = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="uploadFilesOk">确 定</el-button>-->
          <!--</span>-->
        <!--</self-dialog>-->
        <my-upload ref="uploadMasterBtn" :upload-data="uploadMasterData" @uploadSuccessUrl="getMasterSuccessUrl" @delImg="getMasterDel"/>
        <!--<el-button type="primary" @click="uploadFiles">{{ uploadGrouping.type === 1 ? '上传视频': '上传图片' }}</el-button>-->
        <el-row v-if="domShow" v-show="uploadGrouping.type === 1" :gutter="16" style="margin-top: 16px;min-height: 500px;overflow: auto">
          <el-col v-for="(item, index) in filesListData.data" :span="8" :key="index">
            <el-radio style="float: left;line-height: 100px;margin-right: 10px" v-model="videoRadio" @change="changeCheckbox(1, index)" :label="index">&nbsp;</el-radio>
            <video :src="imgPrefix + item.url" controls style="width: 80%; height: 100px;float: left" @click="clickFiles(item, index)"/>
          </el-col>
          <!--filesListData-->
        </el-row>
        <el-row v-if="domShow" v-show="uploadGrouping.type !== 1" :gutter="16" style="margin-top: 16px;min-height: 500px;overflow: auto">
          <el-col v-for="(item, index) in filesListData.data" :span="4" :key="index">
            <el-checkbox style="float: left;line-height: 100px;margin-right: 10px" v-model="item.checkbox" @change="changeCheckbox(2, index)"></el-checkbox>
            <img :src="imgPrefix + item.url + '?x-oss-process=image/resize,h_100'" style="width: 80%;height: 100px;float: left;cursor: pointer" alt="" @click="clickFiles(item, index)">
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="24">
            <pagination v-show="filesListData._count > 0" :total="filesListData._count" :page="(filesListData.offset) / 10 + 1 " :limit="filesListData.limit" style="text-align: right;" @pagination="searchList" />
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userChangeUrl">确 定</el-button>
      </span>
    </self-dialog>
    <el-dialog
      :visible.sync="dialogConfigPrice"
      title="设置代理价"
      width="30%">
      <!--<span>这是一段信息</span>-->
      <el-row>
        <el-col :span="8" class="config-price">
          <ul style="text-align: center">
            <li style="color: #c1c1c1">经销等级</li>
            <li>城市合伙人</li>
            <li>区域</li>
            <li>官方</li>
            <li>梦想</li>
            <li style="border-bottom: 0px">天使</li>
          </ul>
        </el-col>
        <el-col :span="8" class="config-price">
          <ul style="text-align: center;border-left: 0px;border-right: 0px">
            <li style="color: #c1c1c1">
              <el-radio v-model="ruleForm.type" label="1" >固定价</el-radio>
              <!--@change="changePriceType"-->
            </li>
            <li>
              <el-input style="width: 80%" v-number="fixedPrice.vip101" :disabled="ruleForm.type === '2'" v-model="fixedPrice.vip101"/>
            </li>
            <li>
              <el-input style="width: 80%" v-number="fixedPrice.vip102" :disabled="ruleForm.type === '2'"  v-model="fixedPrice.vip102"/>
            </li>
            <li>
              <el-input style="width: 80%" v-number="fixedPrice.vip103" :disabled="ruleForm.type === '2'" v-model="fixedPrice.vip103"/>
            </li>
            <li>
              <el-input style="width: 80%" v-number="fixedPrice.vip104" :disabled="ruleForm.type === '2'" v-model="fixedPrice.vip104"/>
            </li>
            <li style="border-bottom: 0px">
              <el-input style="width: 80%" v-number="fixedPrice.vip105" :disabled="ruleForm.type === '2'" v-model="fixedPrice.vip105"/>
            </li>
          </ul>
        </el-col>
        <el-col :span="8" class="config-price">
          <ul style="text-align: center">
            <li style="color: #c1c1c1;">
              <el-radio v-model="ruleForm.type" label="2" >折扣价</el-radio>
              <!--@change="changePriceType"-->
            </li>
            <li style="line-height: 30px">
              <el-input :disabled="ruleForm.type === '1'" v-number="percentagePrice.vip101" v-model="percentagePrice.vip101" maxlength="2">
                <template slot="append">
                  %
                </template>
              </el-input>
            </li>
            <li style="line-height: 30px">
              <el-input :disabled="ruleForm.type === '1'" v-number="percentagePrice.vip102" v-model="percentagePrice.vip102" maxlength="2">
                <template slot="append">
                  %
                </template>
              </el-input>
            </li>
            <li style="line-height: 30px">
              <el-input :disabled="ruleForm.type === '1'" v-number="percentagePrice.vip103" v-model="percentagePrice.vip103" maxlength="2">
                <template slot="append">
                  %
                </template>
              </el-input>
            </li>
            <li style="line-height: 30px">
              <el-input :disabled="ruleForm.type === '1'" v-number="percentagePrice.vip104" v-model="percentagePrice.vip104" maxlength="2">
                <template slot="append">
                  %
                </template>
              </el-input>
            </li>
            <li style="border-bottom: 0px;line-height: 30px">
              <el-input :disabled="ruleForm.type === '1'" v-number="percentagePrice.vip105" v-model="percentagePrice.vip105" maxlength="2">
                <template slot="append">
                  %
                </template>
              </el-input>
            </li>
          </ul>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfigPrice = false">取 消</el-button>
        <el-button type="primary" @click="configPriceOk">确 定</el-button>
      </span>
    </el-dialog>
    <big-img v-if="showImg" :img-src="imgSrc" @clickit="viewImg"/>
  </div>
</template>

<script>
import './style/release.scss'
import { goodsCateApi } from '@/api/commodity/classify'
import { goodsBrandApi } from '@/api/commodity/brand'
import { goodsLabelApi } from '@/api/commodity/label'
import { addShop, detailShop, uplateShop } from '@/api/commodity/list'
// import uploadVideo from '@/components/upload/uploadVideo'
import { submitUpload, filesList } from '@/api/common'
// import Tinymce from '@/components/Tinymce'
import draggable from 'vuedraggable'
import bigImg from '@/components/bigImg/index'
import { templateList } from '@/api/configPage/freight'
import myUpload from '@/components/Upload/uploadBtn'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import selfDialog from '@/components/selfDialog/selfDialog'
// import { getSession } from '@/utils/auth'
// import FileUpload from 'vue-upload-component/dist/vue-upload-component.part.js'
export default {
  name: 'ReleaseGoods',
  components: {
    // uploadVideo,
    draggable,
    bigImg,
    myUpload,
    Pagination,
    selfDialog
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        var reg=/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ // 是否为正数
        var regDecimal = /^(-?\d+)(\.\d{1,2})?$/ // 保留两位小数
        if (reg.test(value)) {

          // callback()
          if (regDecimal.test(value)) {
            callback()
          } else {
            callback(new Error('只能输入两位小数'))
          }
        } else {
          console.log(regDecimal.test(value))
          if (regDecimal.test(value)) {
            callback(new Error('只能输入数字且不能为负数'))
          } else {
            callback(new Error('只能输入两位小数'))
          }
        }
      }
    }
    var validateStock = (rule, value, callback) => {
      if (!value) {
        callback(new Error('总库存不能为空'))
      } else {
        var reg = /^[0-9]+$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('总库存只能是正整数'))
        }
      }
    }
    var validateVolume = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        var reg=/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ // 是否为正数
        var regDecimal = /^(-?\d+)(\.\d{1,3})?$/ // 保留三位小数
        if (reg.test(value)) {

          // callback()
          if (regDecimal.test(value)) {
            callback()
          } else {
            callback(new Error('只能输入三位小数'))
          }
        } else {
          console.log(regDecimal.test(value))
          if (regDecimal.test(value)) {
            callback(new Error('只能输入数字且不能为负数'))
          } else {
            callback(new Error('只能输入三位小数'))
          }
        }
      }
    }
    return {
      radio: 0,
      drageConfig: {
        dropzoneSelector: 'div',
        draggableSelector: 'img',
        excludeOlderBrowsers: true,
        multipleDropzonesItemsDraggingEnabled: true,
        showDropzoneAreas: true
      },
      imgPrefix: '',
      ruleForm: { // 编辑页面的form数据
        onsale: 1, // 是否上架
        type: '1',
        shipment_id: 0
      },
      templateId: '', // 模版ID
      rules: {
        title: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        brand_id: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        stock: [
          { validator: validateStock, trigger: 'blur' }
          // /^[0-9]+$/
        ],
        goods_sn: [
          { required: true, message: '商品货号不能为空', trigger: 'blur' }
        ],
        price: [
          // { required: true, message: '零售价不能为空', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }
        ],
        original_price: [
          { validator: validatePrice, trigger: 'blur' }
        ],
        postage: [
          { validator: validatePrice, trigger: 'blur' }
        ]
      },
      goodsSelectData: [], // 商品分类三级联动
      goodsSecondSelectData: [], // 商品分类二级数据
      goodsThirdSelectData: [], // 商品分类三级数据
      goodsThirdSelect: '', // 三级选中的值
      goodsSecondSelect: '', // 二级选中的值
      goodsFirstSelect: '', // 一级选中的值
      goodsBrand: {
        limit: 10,
        offset: 0
      },
      goodsBrandData: [], // 品牌下拉框数据
      goodsLabelId: [], // 商品标签
      goodsLabel: {
        limit: 10,
        offset: 0
      },
      goodsLabelTotal: 0, // 标签总数
      goodsLabelData: [], // 标签数据
      attributeForm: {}, // 商品属性form
      addAttributeData: null, // 商品属性数据
      dialogVisible: false, // 选择视频弹出框
      uploadGrouping: { // 素材分组
        limit: 10,
        offest: 0,
        type: 1 // 1是视频
      },
      downData: [], // 下拉框数据
      innerVisible: false,
      uploadForm: {}, // 上传文件弹出框
      fileList: [], // 文件列表
      fileListDetail: [], // 商品详情文件列表
      uploadUrl: '/admin/uploadFile.json', // 提交地址
      submitUploadData: {
        files: []
      }, // 上传的数据
      filesListApi: {
        limit: 10,
        offest: 0,
        type: 1 // 1是视频
      },
      files: [],
      volumesRules: {
        long: [
          { validator: validateVolume, trigger: 'blur' }
        ],
        wide: [
          { validator: validateVolume, trigger: 'blur' }
        ],
        height: [
          { validator: validateVolume, trigger: 'blur' }
        ],
        weight: [
          { validator: validateVolume, trigger: 'blur' }
        ]
      },
      volumes: {
        long: null,
        wide: null,
        height: null,
        weight: null
      }, // 体积
      dialogConfigPrice: false,
      fixedPrice: {}, // 固定价格
      percentagePrice: {}, // 百分比价格
      filesListData: {
        _count: 0,
        limit: 10,
        offset: 0
      }, // 文件列表
      uploadSuccessFilesList: [], // 上传成功的列表
      uploadSuccessFilesDetailList: [], // 上传成功详情的列表
      showImg: false, // 大图显示隐藏
      imgSrc: '', // 需要放大的图片路径
      templateListData: [], // 运费模版列表
      templateListPagination: {
        offset: 0,
        limit: 99
      },
      goodsId: '', // 商品ID
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
      uploadData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 9, // 上传限制的数量
        listShow: true, // 自定义图片列表是否显示
        accept: 'image/jpeg,image/gif,image/png', // 文件上传格式
        multiple: true, // 是否多选
        listType: 'text', // 列表展示格式
        type: 2 // 2是图片，1是视频，3是音频
      },
      uploadMasterData: {
        showList: false, // 文件列表是否显示
        uploadUrl: '', // active
        autoUpload: false, // 是否自动上传
        limit: 9, // 上传限制的数量
        listShow: false, // 自定义图片列表是否显示
        accept: '.mp4, .ogg, .webm', // 文件上传格式
        multiple: false, // 是否多选
        listType: 'text', // 列表展示格式
        type: 1 // 2是图片，1是视频，3是音频
      },
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
      },
      domShow: true,
      saveUserChangeFiles: [], //  存放用户选择的文件
      videoRadio:null,
      saveVideoFiles: ''
    }
  },
  watch: {
    volumes: {
      handler(val) {
        if (!isNaN(Number(val.long)) && !isNaN(Number(val.wide)) && !isNaN(Number(val.height))) {
          const volumeData = (Number(val.long) * Number(val.wide) * Number(val.height)).toFixed(2)
          this.ruleForm.volume = volumeData
        }
      },
      deep: true
    },
    type(data) {
      this.changePriceType(data)
    }
  },
  computed: {
    type() {
      return this.ruleForm.type
    }
  },
  created() {
    this.initGoodsCate() // 获取商品分类
    this.initGoodsBrand() // 获取商品品牌
    this.initGoodsLabel(false) // 获取商品标签 false是初始化的时候不需要加载更多
    this.initImgPrefix() // 获取图片前缀
    this.initTemplateList() // 获取运费模版
    this.initGoodsDetail() // 获取商品详情

  },
  methods: {
    initGoodsDetail() { // 获取商品详情
      let goodsId = this.$route.query.id
      if (goodsId) { // 有就请求详情API
        detailShop(goodsId).then(res => {
          this.ruleForm = JSON.parse(JSON.stringify(res.data))
          this.templateId = res.data.shipment_id
          this.volumes.height = res.data.height
          this.volumes.wide = res.data.width
          this.volumes.long = res.data.length
          this.volumes.weight = res.data.weight
          this.ruleForm.type = String(res.data.type)
          this.ruleForm.old_stock = res.data.stock
          this.goodsLabelId = res.data.tag_id
          this.uploadSuccessFilesList = JSON.parse(JSON.stringify(res.data.img))
          this.saveUserChangeFiles = JSON.parse(JSON.stringify(res.data.img))
          this.saveVideoFiles = res.data.video
          this.$nextTick(() => {
            this.$refs.previewUpload.uploadSuccessFilesList = [res.data.video_img]
            this.$refs.uploadBtn.uploadSuccessFilesList = res.data.des
            this.$refs.goodsPreviewUpload.uploadSuccessFilesList = [res.data.pre_img]
          })
          if (this.ruleForm.type == '1') { // 1是固定 2是百分比
            for(let i = 1; i< 6; i++) {
              let key = 'vip10' + i
              this.fixedPrice[key] = res.data[key]
            }
            // this.percentagePrice.vip101 = res.data.vip101
          } else {
            for(let i = 1; i< 6; i++) {
              let key = 'vip10' + i
              this.percentagePrice[key] = res.data[key]
            }
          }
          this.getGoodsCatId(this.goodsSelectData, res.data.goods_cat_id)
        })
      }
      this.goodsId = goodsId // 存起来判断是新增还是修改
    },
    initTemplateList() { // 获取运费模版
      templateList(this.templateListPagination).then(res => {
        this.templateListData = res.data.data
        // console.log(res, 'res')
      })
    },
    initImgPrefix() { // 获取图片前缀
      this.imgPrefix = JSON.parse(sessionStorage.getItem('userInfo')).OSS_CDN_DOMAIN
    },
    initGoodsCate() {
      goodsCateApi().then(res => {
        // console.error(res.data, 'data')
        this.goodsSelectData = JSON.parse(JSON.stringify(res.data.data))
      })
    },
    changeFirstGoodsCate(val) { // 用户选了一级之后的操作
      this.ruleForm.goods_cat_id = val // 用户选了哪一级的这个key就是哪一级的ID
      this.goodsSecondSelect = ''
      this.goodsThirdSelect = ''
      this.goodsSelectData.forEach(item => {
        if (item.id === val) {
            this.addAttributeData = JSON.parse(JSON.stringify(item.pro)) // 商品属性
            if (item._child) {
              this.goodsSecondSelectData = JSON.parse(JSON.stringify(item._child))
            } else {
              this.goodsSecondSelectData = []
            }
        }
      })
    },
    changeSecondGoodsCate(val) { // 用户选了二级之后的操作
      this.ruleForm.goods_cat_id = val // 用户选了哪一级的这个key就是哪一级的ID
      this.goodsThirdSelect = ''
      this.goodsSecondSelectData.forEach(item => {
        if (item.id === val) {
          this.addAttributeData = JSON.parse(JSON.stringify(item.pro)) // 商品属性
          this.goodsThirdSelectData = JSON.parse(JSON.stringify(item._child))
        }
      })
    },
    changeThirdGoodsCate(val) { // 用户选了三级之后的操作
      this.ruleForm.goods_cat_id = val // 用户选了哪一级的这个key就是哪一级的ID
      this.goodsThirdSelectData.forEach(item => {
        if (item.id === val) {
          this.addAttributeData = JSON.parse(JSON.stringify(item.pro)) // 商品属性
        }
      })
    },
    initGoodsBrand() { // 获取商品品牌
      goodsBrandApi(this.goodsBrand).then(res => {
        this.goodsBrandData = JSON.parse(JSON.stringify(res.data.data))
      })
    },
    initGoodsLabel(type) { // 获取商品标签
      const oldLabelData = JSON.parse(JSON.stringify(this.goodsLabelData)) // 存放之前的label标签数据
      goodsLabelApi(this.goodsLabel).then(res => {
        if (type) { // 需要加载更多
          this.goodsLabelData = oldLabelData.concat(res.data.data)
        } else {
          this.goodsLabelData = JSON.parse(JSON.stringify(res.data.data))
          this.goodsLabelTotal = res.data._count // 标签总数
        }
      })
    },
    userChangeGoodsLabel(val) { // 选择标签
      this.tag_id = JSON.parse(JSON.stringify(val))
      this.ruleForm.tag_id = JSON.parse(JSON.stringify(val))
    },
    labelLoadMore() { // 加载更多标签
      this.goodsLabel.offset = this.goodsLabel.offset + 10
      this.initGoodsLabel(true)
    },
    uploadClick(val) {
      this.dialogVisible = true
      this.uploadGrouping.type = Number(val)
      this.filesListData.limit = 10
      this.filesListData.offset = 0
      // this.uploadMasterData.listShow = false
      if (this.uploadGrouping.type === 1) {
        this.videoRadio = null
        this.uploadMasterData.type = 1
        this.uploadMasterData.limit = 1
        this.uploadMasterData.multiple = false

        this.uploadMasterData.accept = '.mp4, .ogg, .webm' // 文件上传格式
      } else {
        this.uploadMasterData.type = 2
        this.uploadMasterData.limit = 9
        this.uploadMasterData.multiple = true
        this.uploadMasterData.accept = 'image/jpeg,image/gif,image/png' // 文件上传格式
      }
      this.searchVideoList(val)
    },
    commandDown(val) { // 点击 分组加载
    },
    searchVideoList(type) { // 搜索所有的视频
      // this.filesListApi.type = this.uploadGrouping.type
      let params = {
        limit: this.filesListData.limit,
        offset: this.filesListData.offset,
        type: type
      }
      filesList(params).then(res => {
        // this.$nextTick(() => {
          this.filesListData.data = JSON.parse(JSON.stringify(res.data.data))
          this.filesListData.data.forEach(item => {
            item.checkbox = false
          })
          // console.log(this.filesListData, 'fiw')
          this.filesListData._count = res.data._count
        this.domShow = false
        this.$nextTick(() => {
          this.domShow = true
        })
      })
    },
    uploadFiles() { // 上传文件
      this.innerVisible = true
      if (this.uploadGrouping.type === 1) {
        this.videoRadio = null
      }
    },
    handleRemove(file, fileList) {
      this.submitUploadData.files = JSON.parse(JSON.stringify(fileList))
    },
    handleChange(file, fileList) {
      this.submitUploadFiles(file)
      // fileList.forEach()
    },
    submitUploadFiles(f) { // 文件上传
      const formData = new FormData()
      formData.append('files[]', f.raw)
      formData.append('type', this.uploadGrouping.type)
      submitUpload(formData).then(res => {
        // this.$message.success('上传成功')
        this.$refs.upload.clearFiles()
        if (this.uploadGrouping.type === 2) {
          if (this.uploadSuccessFilesList.length > 9) {
            this.$message.warning('最多只能上传9张图片')
          } else {
            this.uploadSuccessFilesList.push(res.data[0].url)
          }
        } else {
          const newArr = []
          newArr.push(res.data[0].url)
          this.uploadSuccessFilesList = JSON.parse(JSON.stringify(newArr))
        }
      })
    },
    changeExceed(files, fileList) {
      // var warningText
      // if (this.uploadGrouping.type === 1) {
      //   this.$refs.upload.clearFiles()
      //   this.submitUploadFiles(files)
      // } else {
      //
      // }
       // ? warningText = '视频文件只能上传一个' : warningText = '图片文件只能上传9张'
      // this.$message.warning(warningText)
      // if (this.uploadGrouping.type === 1) {
      //   this.fileList = files.slice(0, 1) // 只取第一个
      // } else {
      //   this.fileList = files.slice(0, 2)
      // }
    },
    configPrice() { // 设置代理价
      this.dialogConfigPrice = true
    },
    changePriceType(val) { // 切换价格
      this.ruleForm.type = val
      if (Number(val) === 1) {
        this.ruleForm = Object.assign({}, this.ruleForm,this.fixedPrice)
        for (const item in this.percentagePrice) {
          this.percentagePrice[item] = ''
        }
      } else {
        this.ruleForm = Object.assign({}, this.ruleForm,this.percentagePrice)
        for (const item in this.fixedPrice) {
          this.fixedPrice[item] = ''
        }
      }
    },
    addFrom(formName) { // 新增
      // this.ruleForm.templateId
      if (this.ruleForm.shipment_id !== 0) {
        this.ruleForm.shipment_id = this.templateId
      }
      this.ruleForm.length = this.volumes.long
      this.ruleForm.width = this.volumes.wide
      this.ruleForm.height = this.volumes.height
      this.ruleForm.weight = this.volumes.weight
      // this.ruleForm.des = JSON.parse(JSON.stringify(this.uploadSuccessFilesDetailList))
      // goodsID有就是修改
      this.ruleForm.img = JSON.parse(JSON.stringify(this.saveUserChangeFiles))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.goodsId ? this.uplateShopApi(this.ruleForm) : this.addGoodsApi(this.ruleForm)
        } else {
          return false
        }
      })
    },
    addGoodsApi(data) {
      addShop(data).then(res => {
        this.$message.success('发布成功')
        this.$router.push({ path: '/commodity/list' })
      })
    },
    uplateShopApi(data) {
      uplateShop(data).then(res => {
        this.$message.success('修改成功')
        this.$router.push({ path: '/commodity/list' })
      })
    },
    clickImgDelete(index) { // 删除图片
      this.uploadSuccessFilesList.splice(index, 1)
    },
    clickMainImgDelete(index) { //  删除主图
      this.saveUserChangeFiles.splice(index, 1)
    },
    uploadFilesOk() {
      // 文件上传OK
      // console.log(this.uploadGrouping,this.uploadSuccessFilesList)
      if (this.uploadGrouping.type === 2) { // tupian
        this.ruleForm.img = JSON.parse(JSON.stringify(this.uploadSuccessFilesList))
        this.searchVideoList(2)
      } else { // 视频
        this.ruleForm.video = JSON.parse(JSON.stringify(this.uploadSuccessFilesList[0]))
        this.searchVideoList(1)
      }
      this.innerVisible = false
    },
    handleChangeDetail(file) {
      this.submitUploadDetail(file)
    },
    submitUploadDetail(f) {
      const formData = new FormData()
      formData.append('files[]', f.raw)
      formData.append('type', 2)
      submitUpload(formData).then(res => {
        this.uploadSuccessFilesDetailList.push(res.data[0].url)
        // this.uploadSuccessFilesDetailList.push('http://tp.yiaedu.com/showimg.php?url=http://uploads.xuexila.com/allimg/1703/867-1F330164643.jpg')
      })
    },
    handleRemoveDetail() {

    },
    viewImg() {
      this.showImg = false
    },
    clickImg(src) {
      const that = this
      this.showImg = true
      that.imgSrc = src
    },
    clickDetailImgDelete(index) {
      this.uploadSuccessFilesDetailList.splice(index, 1)
    },
    changeRadio(val) { // 运费切换
      this.ruleForm.shipment_id = val
    },
    configPriceOk() { // 设置代理价
      console.log(this.fixedPrice, this.percentagePrice)
      if (this.ruleForm.type === '1') { // 固定价
        this.ruleForm = Object.assign({}, this.ruleForm, this.fixedPrice)
      } else {
        this.ruleForm = Object.assign({}, this.ruleForm, this.percentagePrice)
      }
      this.dialogConfigPrice = false
    },
    getGoodsCatId(data, id) {
      this.findChildId(data, id, 0, '', '')
    },
    findChildId(data, id, i, secondParentData, firstParentData) {
      data.forEach(item => {
        if (i === 0) { // 最外层
          if (item.id === id) { // 如果最外层相同就显示
            this.goodsFirstSelect = id
            return false
          } else {
            if (item.cchild !== 0) { // 说明至少有二级 没有就不管
              this.findChildId(item._child, id, 1, secondParentData, item)
            }
          }
        } else { // parent id不为0 这里面的item就是上面的items
          if (i === 1) { // 说明是第二级
            if (item.id === id) {
              this.goodsFirstSelect = item.parent_id
              this.goodsSecondSelect = id
              this.changeFirstGoodsCate(item.parent_id)
              this.changeSecondGoodsCate(id)
              return false
            } else { // 如果不相同继续找下级
              if (item.cchild !== 0) {
                this.findChildId(item._child, id, 2, item, firstParentData)
              }
            }
          } else if (i === 2) { // 是第三级
            if (item.id === id) {
              this.goodsSecondSelect = item.parent_id
              this.goodsThirdSelect = id
              this.goodsFirstSelect = firstParentData.id
              this.changeFirstGoodsCate(firstParentData.id)
              this.changeSecondGoodsCate(item.parent_id)
              return false
            }
          }
        }
      })
    },
    addTemplate() {
      this.$router.push({ path: '/config/template'})
    },
    getPreviewSuccessUrl(data) { // 获取预览图
      this.ruleForm.video_img = data[0].url
    },
    getPreviewDel(data) { // 预览图删除之后
      this.ruleForm.video_img = ''
    },
    getUploadSuccessUrl(data, list) {
      this.ruleForm.des = JSON.parse(JSON.stringify(list))
    },
    getUploadDel(data) {
      this.ruleForm.des = JSON.parse(JSON.stringify(data))
    },
    getGoodsPreviewSuccessUrl(data, list) {
      this.ruleForm.pre_img = data[0].url
    },
    getGoodsPreviewDel(data) {
      this.ruleForm.pre_img = ''
    },
    searchList(data) {
      console.log(data)
      this.filesListData.offset = (data.page - 1) * 10
      this.filesListData.limit = data.limit
      this.searchVideoList(this.uploadGrouping.type)
    },
    clickFiles(item, index) {
      // console.log(url, index)
      this.filesListData.data[index].checkbox = !this.filesListData.data[index].checkbox
      this.domShow = false
      this.$nextTick(() => {
        this.domShow = true
      })
    },
    changeCheckbox(val, index) {
      // console.log(val, 'val')
      if (val === 1) {
        this.videoRadio = index
      }
      this.domShow = false
      this.$nextTick(() => {
        this.domShow = true
      })
    },
    userChangeUrl() {
      if (this.uploadGrouping.type === 1) { //视频
        // this.videoFilesListData
        // this.saveVideoFiles.splice(0,1,this.filesListData.data[this.videoRadio].url)

        // if (this.uploadSuccessFilesList[0] && this.saveVideoFiles) {
          // this.$message.warning('')
      //   this.ruleForm.img = JSON.parse(JSON.stringify(this.uploadSuccessFilesList))
      //   this.searchVideoList(2)
      // } else { // 视频
      //   this.ruleForm.video = JSON.parse(JSON.stringify(this.uploadSuccessFilesList[0]))
        // }
        if (this.videoRadio || this.videoRadio === 0) { //有就取用户选择的
          this.saveVideoFiles = this.filesListData.data[this.videoRadio].url
          // console.log(this.filesListData.data[this.videoRadio], 'this.filesListData.data[this.videoRadio]')
          this.ruleForm.video = this.saveVideoFiles
        }
        // else {
        //   this.saveVideoFiles = JSON.parse(JSON.stringify(this.uploadSuccessFilesList[0]))
        // }

        this.dialogVisible = false
      } else {
        let newArr = this.filesListData.data.filter(item => {
          return item.checkbox === true
        })

        newArr.forEach(item => {
          this.saveUserChangeFiles.splice(0,0,item.url)
        })
        console.log(newArr, 'newArr',this.saveUserChangeFiles)
        // = JSON.parse(JSON.stringify(newArr))
        // let imgArr = this.uploadSuccessFilesList.map(item => {
        //   // return item.url
        //   if (item.url) {
        //     return item.url
        //   } else {
        //     return item
        //   }
        // })
        // newArr = newArr.map(item => {
        //   return item.url
        // })
        // console.log(this.uploadSuccessFilesList, newArr, imgArr)
        // let allData = this.saveUserChangeFiles.concat(newArr)
        let allData = JSON.parse(JSON.stringify(this.saveUserChangeFiles))
        console.log(newArr, allData, '123')
        if (allData.length > 9) {
          // this.$message.warning('最多只能显示9张图片')
          allData.splice(9, allData.length - 9)
        }
        this.ruleForm.img = JSON.parse(JSON.stringify(allData))
        this.saveUserChangeFiles = JSON.parse(JSON.stringify(allData))
        this.dialogVisible = false
      }

    },
    returnPage() {
      this.$router.go(-1)
    },
    resetAll(formName) { // 重置
      this.$refs[formName].resetFields()
      this.ruleForm = {
        onsale: 1, // 是否上架
        type: '1',
        shipment_id: 0
      }
      if (this.goodsId) {
        this.initGoodsDetail()
      }
    },
    inputEntry() {

    },
    // inputEntry(item) {
    //   // console.log(val, 'val')
    //   // var reg=/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ // 是否为正数
    //   // var regDecimal = /^(-?\d+)(\.\d{1,2})?$/ // 保留两位小数
    //   // var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
    //   // if (reg.test(this.fixedPrice[item])) {
    //   // }
    //
    //   // this.fixedPrice[item] = this.fixedPrice[item].replace(/[^\d.]/g,""); //先把非数字的都替换掉，除了数字和.
    //   // var regPoint = /^\./g // 小数点判断
    //   // this.fixedPrice[item] = this.fixedPrice[item].replace(/^\./g,""); //必须保证第一个为数字而不是.
    //   // this.fixedPrice[item] = this.fixedPrice[item].replace(/\.{2,}/g,"."); //保证只有出现一个.而没有多个.
    //   // this.fixedPrice[item] = this.fixedPrice[item].replace(".","$#$").replace(/\./g,"").replace("$#$","."); //保证.只出现一次，而不能出现两次以上
    //   console.log(this.fixedPrice[item])
    //   let newStr = this.fixedPrice[item].split('.')
    //   console.log(newStr, 'newStr')
    // },
    // inputEntry1() {
    //
    // },
    handNumber(data) {
      console.log(data, 'data')
    },
    getMasterSuccessUrl(data, list) {
      if (this.uploadGrouping.type === 1) {
        this.ruleForm.video = data[0].url
        this.saveVideoFiles = data[0].url
      } else {
        this.ruleForm.img = JSON.parse(JSON.stringify(list))
        if (this.saveUserChangeFiles.length >= 9) {
          this.saveUserChangeFiles.splice(8, 1)
        }
        this.saveUserChangeFiles.splice(0, 0, data[0].url)

        // this.saveUserChangeFiles = this.saveUserChangeFiles.concat(list)
        console.log(this.saveUserChangeFiles, list, 'list')
      }

    },
    getMasterDel(data, list) {
      // getUploadSuccessUrl(data, list) {
      //   this.ruleForm.des = JSON.parse(JSON.stringify(list))
      // },
      // getUploadDel(data) {
      //   this.ruleForm.des = JSON.parse(JSON.stringify(data))
      // },
    }
  }
}
</script>
