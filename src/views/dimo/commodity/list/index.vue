<template>
  <div class="release-list">
    <el-row :gutter="16">
      <el-col :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
        <!--// 发布的按钮-->
        <el-button v-db-click v-has="'goods.add'" type="primary">
          <router-link :to="{path: '/commodity/release'}">发布商品</router-link>
        </el-button>
      </el-col>
      <el-col :xs="24" :sm="21" :md="22" :lg="22" :xl="22">
        <div class="float-right">
          <el-select v-model="searchData.onsale" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in onsaleData"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="searchData.goods_cate_id" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in goodsCateData"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <!--<el-input-->
          <!--v-model="input6"-->
          <!--placeholder="请输入内容"-->
          <!--width="300px"-->
          <!--&gt;-->
          <!--<el-button v-db-click slot="append" icon="el-icon-search" @click="searchList"/>-->
          <!--</el-input>-->
          <search-input ref="searchInput" @searchList="inputSearchList"/>
          <!--<el-button type="text" style="margin: 0 20px">高级搜索</el-button>-->
          <el-button v-db-click type="primary" @click="clearAll">重置</el-button>
        </div>
      </el-col>
      <el-col :span="24" style="margin-top: 16px">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          stripe
          style="width: 100%"
          @row-click="rowClick"
          @selection-change="getUserChangeRow"
        >
          <el-table-column
            fixed
            type="selection"
            width="55"/>
          <el-table-column
            fixed
            prop="title"
            label="商品名称"
          >
            <template slot-scope="scope">
              <img :src="imgPrefix + scope.row.pre_img + '?x-oss-process=image/resize,l_50'" alt="">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            sortable
            width="100"
          />
          <el-table-column
            prop="stock"
            label="库存"
            width="100"
          />
          <el-table-column
            prop="sales"
            label="总销量"
            width="100"
          />
          <el-table-column
            prop="onsale"
            label="状态"
            width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.onsale ? '上架' : '下架' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建时间"
            width="150"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button v-db-click v-has="'goods.edit'" type="text" size="small" @click="editorGoods(scope.row)">编辑</el-button>
              <el-button v-db-click v-has="'goods.del'" type="text" size="small" @click="delList(scope.row)">删除</el-button>
              <!--@click="handleClick(scope.row)"-->
            </template>
          </el-table-column>
        </el-table>
        <el-row :gutter="16">
          <el-col :span="24" style="margin-top: 20px">
            <el-button type="primary" disabled>下架</el-button>
            <!--<el-button type="danger">删除</el-button>-->
            <el-button type="primary" disabled>运费模板</el-button>
            <el-button type="primary" disabled>复制商品</el-button>
          </el-col>
          <el-col :span="24">
            <pagination v-show="searchData.total>0" :total="searchData.total" :page="searchData.offset" :limit="searchData.limit" style="text-align: right;" @pagination="paginSearchList" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import './style/index.scss'
import { listApi, delShop } from '@/api/commodity/list'
import { goodsCateApi } from '@/api/commodity/classify'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import searchInput from '@/components/search/index'
export default {
  name: 'Index',
  components: {
    Pagination,
    searchInput
  },
  data() {
    return {
      input6: '',
      tableData: [], // 表格数据
      searchData: {
        onsale: null, // 状态
        goods_cate_id: '', // 分类ID
        title: '', // 商品搜索标题
        limit: 10, // 每次取多少条
        offset: 0, // 开始取的下标
        total: 0 // 总条数
      },
      goodsCateData: [], // 商品分类的数据
      onsaleData: [], // 状态的数据
      onsaleValue: null, // 状态选择
      userChangeRowData: [], // 用户选择的数据
      dialogVisible: false, // 删除提示框
      delRow: {}, // 用户选中删除的数据
      imgPrefix: '' // 图片前缀
    }
  },
  created() {
    this.searchList()
    this.initOnsale() // 初始化状态
    this.initClassify() // 商品分类
    this.initImgPrefix() //  获取图片前缀
  },
  methods: {
    initImgPrefix() { // 获取图片前缀
      this.imgPrefix = JSON.parse(sessionStorage.getItem('userInfo')).OSS_CDN_DOMAIN
    },
    searchList() { // 搜索事件
      listApi(this.searchData).then(res => {
        this.tableData = JSON.parse(JSON.stringify(res.data.data))
        this.searchData.total = res.data._count // 总数
      })
    },
    initOnsale() { // 初始化状态
      this.onsaleData = JSON.parse(JSON.stringify(this.$store.state.fixed.COMMODITY_lIST))
    },
    initClassify() { // 初始化商品分类
      goodsCateApi().then(res => {
        this.goodsCateData = JSON.parse(JSON.stringify(res.data.data))
        // console.log(res, 'res')
      })
    },
    rowClick(row) { // 行点击事件
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    getUserChangeRow(val) { // 获取用户点击的行
      this.userChangeRowData = JSON.parse(JSON.stringify(val))
    },
    delList(row) { // 删除商品
      // this.dialogVisible = true // 出现确认删除弹框
      // this.delRow = JSON.parse(JSON.stringify(row))
      this.$confirm('此操作将永久删除该数据(' + row.title + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDel(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmDel(id) { // 删除确认
      delShop(id).then(res => {
        if (res.code === 0) { // 删除成功
          this.$message.success('删除成功')
          // 删除成功后重置列表
          this.searchList()
        }
      })
    },
    editorGoods(row) {
      this.$router.push(
        {
          path: '/commodity/release',
          query: {
            id: row.id
          }
        })
    },
    paginSearchList(data) {
      // console.log(data)
      this.searchData.offset = (data.page - 1) * 10
      this.searchData.limit = data.limit
      this.searchList()
    },
    inputSearchList(data) {
      this.searchData.title = data
      this.searchList()
    },
    clearAll() {
      this.searchData = {
        onsale: null, // 状态
        goods_cate_id: '', // 分类ID
        title: '', // 商品搜索标题
        limit: 10, // 每次取多少条
        offset: 0, // 开始取的下标
        total: 0 // 总条数
      }
      this.$refs.searchInput.clearInput()
    }
  }
}
</script>
