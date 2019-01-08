<template>
  <div>
    <el-button v-db-click v-has="'shipment.add'" type="primary" @click="addTemplate">新增运费模版</el-button>
    <el-row :gutter="16">
      <el-col v-for="item in templateListData.data" :key="item.id" :span="24" class="col-style">
        <el-row>
          <el-col :span="18">
            <!--<el-checkbox v-model="checked">{{ item.name }}</el-checkbox>-->
            <span>{{ item.name }}</span>
            <el-button type="text">包含制定包邮信息</el-button>
          </el-col>
          <el-col :span="6">
            <el-button v-db-click v-has="'shipment.edit'" type="primary" @click="uplateList(item)">修改</el-button>
            <el-button v-db-click v-has="'shipment.del'" type="danger" @click="delList(item)">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span>运送方式</span>
          </el-col>
          <el-col :span="9">
            <span>可运送至</span>
          </el-col>
          <el-col :span="3">
            <span>首(件)</span>
          </el-col>
          <el-col :span="3">
            <span>运费(元)</span>
          </el-col>
          <el-col :span="3">
            <span>每增加(件)</span>
          </el-col>
          <el-col :span="3">
            <span>增加运费(元)</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span>{{ item.valuation_name | dataFilter }}</span>
          </el-col>
          <el-col :span="9">
            <span>{{ item.region_name | dataFilter }}</span>
          </el-col>
          <el-col :span="3">
            <span>{{ item.start_standard }}</span>
          </el-col>
          <el-col :span="3">
            <span>{{ item.start_fee }}</span>
          </el-col>
          <el-col :span="3">
            <span>{{ item.add_standard }}</span>
          </el-col>
          <el-col :span="3">
            <span>{{ item.add_fee }}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24">
        <pagination v-show="templateListData._count > 0" :total="templateListData._count" :page.sync="templateListData.offset" :limit.sync="templateListData.limit" style="text-align: right;" @pagination="searchList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import './style/index.scss'
import { templateList, templateDel } from '@/api/configPage/freight'
import pagination from '@/components/Pagination/index'
export default {
  name: 'Index',
  components: {
    pagination
  },
  filters: {
    dataFilter(val) {
      if (val) {
        return val
      } else {
        return '暂无数据'
      }
    }
  },
  data() {
    return {
      checked: false,
      templateListData: {
        _count: 0,
        data: [],
        limit: 10,
        offset: 0
      } // 模版列表
    }
  },
  created() {
    this.initList()
  },
  methods: {
    addTemplate() { // 点击切换到新增模版路由
      this.$router.push({ path: '/config/template' })
    },
    initList() { // 初始化模版列表
      let params = {
        offset: this.templateListData.offset,
        limit: this.templateListData.limit
      }
      templateList(params).then(res => {
        this.templateListData.data = JSON.parse(JSON.stringify(res.data.data))
        this.templateListData._count = res.data._count
      })
    },
    delList(data) {
      this.$confirm('此操作将永久删除该模版(' + data.name + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delApi(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delApi(data) {
      templateDel(data.id).then(res => {
        this.$message.success('删除成功')
        this.initList()
      })
    },
    searchList(data) { //  分页功能
      this.templateListData.offset = (data.page - 1) * 10
      this.templateListData.limit = data.limit
      this.initList()
    },
    uplateList(data) { // 修改列表
      this.$router.push(
        {
          path: '/config/template',
          query: {
            id: data.id
          }
        })
    }
  }
}
</script>
