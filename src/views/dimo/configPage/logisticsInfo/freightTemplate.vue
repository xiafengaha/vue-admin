<!--suppress ALL -->
<template>
  <div class="template-box">
    <p class="template-title">{{ templateTitle }}</p>
    <el-row :gutter="16">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-col :span="24">
          <el-form-item label="模版名称:" prop="name">
            <el-input style="width: 198px" v-model="ruleForm.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="计价方式:" prop="valuation_type">
            <el-radio-group v-model="ruleForm.valuation_type">
              <el-radio label="items">按件数</el-radio>
              <el-radio label="weight">按重量</el-radio>
              <el-radio label="volume">按体积</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="运送方式:" class="freight-type" required>
            <div>除指定地区外，其余地区的运费采用"默认运费"</div>
            <el-row :gutter="16" style="margin-left: 0px">
              <el-col :span="24">
                <span>默认运费:</span>
                <el-input v-model="ruleForm.start_standard"/>
                <span>件内,</span>
                <el-input v-model="ruleForm.start_fee"/>
                <span>元;</span>
                <span>每增加</span>
                <el-input v-model="ruleForm.add_standard"/>
                <span>件 &nbsp;增加运费</span>
                <el-input v-model="ruleForm.add_fee"/>
                <span>元</span>
              </el-col>
              <el-col :span="24" style="margin-top: 10px">
                <el-table
                  v-if="tableTemplate"
                  :data="ruleForm.self_method"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="date"
                    label="运送到"
                    min-width="200"
                  >
                    <template slot-scope="scope">
                      <!--<span v-show="scope.row.changeName">{{ scope.row.changeName }}</span>-->
                      <!--<span v-show="!scope.row.changeName">未添加地区</span>-->
                      <span>{{ scope.row.region_name }}</span>
                      <el-button type="text" @click="editorArea(scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="首件(件)"
                    width="180">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.start_standard"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="首费(元)"
                    width="180">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.start_fee"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="续件(件)"
                    width="180">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.add_standard"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="续费(元)"
                    width="180">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.add_fee"/>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="操作"
                    width="180"
                    fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" @click="delRow(scope.row)" v-show="ruleForm.self_method.length > 1">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button type="text" v-db-click @click="addRow">
                  添加
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button v-db-click type="primary" @click="returnPage">返回</el-button>
          <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
          <el-button v-db-click type="primary" @click="saveFun('ruleForm')">保存</el-button>
        </el-col>
      </el-form>
    </el-row>
    <self-dialog
      :visible.sync="dialogVisible"
      title="选择区域"
      width="60%">
      <!--<span>这是一段信息</span>-->
      <el-checkbox-group v-if="areaDiabled" v-model="areaIdList" @change="userChangeArea">
        <el-row :gutter="16">
          <el-col v-for="item in areaData" :span="4" :key="item.id" style="margin-top: 10px">
            <el-checkbox :label="item.id" style="float: left" >
              &nbsp;
            </el-checkbox>
            <el-cascader
              :options="item._child"
              :props="areaProps"
              :placeholder="item.name"
              :disabled="item.disabled ? item.disabled : false"
              v-model="item.changeId"
              style="float: left;width: 140px"
              change-on-select
              clearable
              @change="getAreaData"
            />
          </el-col>
        </el-row>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getUserChangeArea">确 定</el-button>
      </span>
    </self-dialog>
  </div>
</template>

<script>
import './style/freight.scss'
import selfDialog from '@/components/selfDialog/selfDialog'
import { areaList } from '@/api/common'
import { addTemplate, templateDetail, templateUplate } from '@/api/configPage/freight'
export default {
  name: 'FreightTemplate',
  components: {
    selfDialog
  },
  data() {
    return {
      ruleForm: {
        self_method: [
          {
            'region_id': '',
            'start_standard': '',
            'start_fee': '',
            'add_standard': '',
            'add_fee': '',
            'region_name': '未添加地区',
            'index': 0
          },
          {
            'region_id': '',
            'start_standard': '',
            'start_fee': '',
            'add_standard': '',
            'add_fee': '',
            'region_name': '未添加地区',
            'index': 1
          }
        ],
        valuation_type: 'items'
      }, // 表单
      rules: {
        name: [
          { required: true, message: '请输入模版名称', trigger: 'blur' }
        ],
        valuation_type: [
          { required: true, message: '请选择计价方式', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      areaData: [], // 区域数据
      areaProps: {
        label: 'name',
        value: 'id',
        children: '_child'
      },
      areaIdList: [],
      areaDiabled: true,
      editorIndex: 0, // 用户点哪个编辑的下标
      tableTemplate: true,
      userChangeCheckbox: [], // 用户选择了checkbox的数据
      templateTitle: '新建运费模版',
      updateRuleForm: {},
      routerId: ''
    }
  },
  created() {
    this.initArea() // 初始化地区
    this.initDetail()
  },
  methods: {
    initDetail() {
      let routerId = this.$route.query.id
      // 如果有路由传参就是修改模版
      routerId ? this.getTemplateDetail(routerId): this.templateTitle = '新建运费模版'
      this.routerId = routerId
    },
    getTemplateDetail(id) {
      templateDetail(id).then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res.data))
        this.updateRuleForm = JSON.parse(JSON.stringify(res.data))
        // this.ruleForm.self_method = [
        //   {
        //     add_fee: "5",
        //     add_standard: "1",
        //     index: 0,
        //     region_id: "310000,320000,330000",
        //     region_name: "上海,江苏省,浙江省",
        //     start_fee: "10",
        //     start_standard: "1"
        //   }
        // ]
        this.ruleForm.self_method.forEach((item, index) => {
          item.index = index
        })
        this.templateTitle = '修改' + res.data.name +'运费模版'
      })
    },
    saveFun(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.templateTitle === '新建运费模版' ? this.saveApi() : this.uplateApi()
        } else {
          return false
        }
      })
    },
    uplateApi() {
      templateUplate(this.ruleForm).then(res => {
        this.$message.success('修改成功')
        // this.$router.push({ path: '/config/logisticsInfo'})
        this.$router.back(-1)
      })
    },
    saveApi() {
      // this.ruleForm.self_method = JSON.stringify(this.ruleForm.self_method)
      addTemplate(this.ruleForm).then(res => {
        this.$message.success('新增成功')
        // this.$router.push({ path: '/config/logisticsInfo'})
        this.$router.back(-1)
      })
    },
    addRow() { // 回车新增一列
      let newAddRow = {
        'region_id': '',
        'start_standard': '',
        'start_fee': '',
        'add_standard': '',
        'add_fee': '',
        'region_name': '未添加地区',
        'index': this.ruleForm.self_method.length
      }
      this.ruleForm.self_method.push(newAddRow)
      // this.ruleForm.self_method.splice(row.index + 1, 0, newAddRow)
      // this.ruleForm.self_method.forEach((item, index) => {
      //   item.index = index
      // })
    },
    delRow(row) { // 删除行
      this.ruleForm.self_method.splice(row.index, 1)
      this.ruleForm.self_method.forEach((item, index) => {
        item.index = index
      })
    },
    editorArea(row) { // 编辑地区
      this.editorIndex = row.index
      this.dialogVisible = true
      this.areaIdList = []
      this.areaData.forEach(item => {
        item.changeId = []
      })
      if (!row.region_id) {
        this.areaData.forEach(item => {
          item.changeId = []
          item.disabled = false
        })
      } else {
        let newArr = row.region_id.split(',')
        let newValData = []
        newArr.forEach((item, index) => {
          let areaIndex = this.areaData.findIndex(items => {
            return String(item) === String(items.id)
          })
          if (areaIndex > -1) { // 有值
            this.areaData[areaIndex].changeId.push(item)
            this.areaData[areaIndex].disabled = true
            this.areaIdList.push(Number(item))
          }
          else { // 没有值就是在子节点中
            let newStr = String(item).substring(0, 2)
            let parentIndex = this.areaData.findIndex(items => {
              return newStr === String(items.id).substring(0, 2)
            })
            if (parentIndex > -1) { // 有
              this.areaData[parentIndex].changeId.push(this.areaData[parentIndex].id)
              let childIndex = this.areaData[parentIndex]._child.findIndex(items => {
                return String(item).substring(0, 4) === String(items.id).substring(0, 4)
              })
              if (childIndex > -1) {
                this.areaData[parentIndex].changeId .push(this.areaData[parentIndex]._child[childIndex].id)
              }
            }
          }
        })
      }
    },
    initArea() {
      areaList().then(res => {
        this.areaData = JSON.parse(JSON.stringify(res.data[0]._child))
      })
    },
    userChangeArea(val) {
      let newValData = []
      val.forEach((item, index) => {
        let areaIndex = this.areaData.findIndex(items => {
          return item === items.id
        })
        newValData.splice(index, 0, areaIndex)
      })
      newValData.forEach(item => {
        this.areaData[item].disabled = true
      })
      this.userChangeCheckbox = JSON.parse(JSON.stringify(newValData))
      this.filterData(this.areaData, val).forEach(item => {
        this.areaData[item].disabled = false
        this.areaData[item].changeId = []
      })
      this.areaDiabled = false
      this.$nextTick(() => { // 为了让组件重新加载
        this.areaDiabled = true
      })
    },
    filterData(a, b) {
       //循环判断数组a里的元素在b里面有没有，有的话就放入新建立的数组中
      var result = new Array();
      var c=b.toString();
      for(var i=0;i<a.length;i++)
      {
        if(c.indexOf(a[i].id.toString()) === -1)
        {
          result.push(i);
        }
      }
      return result;
    },
    getAreaData(val) {
      let codeStr = String(val[0]).substring(0, 2)
      this.areaData.forEach(item => {
        if (String(item.id).substring(0, 2) === codeStr) {
          item.changeId = JSON.parse(JSON.stringify(val))
        }
      })
    },
    getUserChangeArea() {
      let newArr = [], newArrName = []
      this.areaData.forEach((item, index) => {
        if (item.disabled) { // 如果有disabled说明用户选择了整个省
          newArr.push(item.id)
          newArrName.push(item.name)
        } else {
          if (item.changeId) {
            if (item.changeId.length === 2) { // 用户选了区
              newArr.push(item.changeId[1])
              let newIndex = item._child.findIndex((items,indexs) => {
                return String(items.id) === String(item.changeId[0])
              })
              let areaName = item.name + '/' + this.filterCityName(item, item.changeId[0]) + '/' + this.filterCityName(item._child[newIndex], item.changeId[1])
              newArrName.push(areaName)
            } else if (item.changeId.length === 1) { // 用户选了市
              newArr.push(item.changeId[0])
              let cityName = item.name + '/' + this.filterCityName(item, item.changeId[0])
              newArrName.push(cityName)
            }
          }
        }
      })
      this.ruleForm.self_method[this.editorIndex].region_name = newArrName.join(',')
      this.ruleForm.self_method[this.editorIndex].region_id = newArr.join(',')
      this.dialogVisible = false
      this.tableTemplate = false
      this.$nextTick(() => {
        this.tableTemplate = true
      })
    },
    filterCityName(data, id) {
      let newName = data._child.find(items => {
        return items.id === id
      })
      return newName.name
    },
    returnPage() {
      this.$router.go(-1)
    },
    resetAll(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.start_standard = ''
      this.ruleForm.start_fee = ''
      this.ruleForm.add_standard = ''
      this.ruleForm.add_fee = ''
      this.ruleForm.self_method = [
        {
          'region_id': '',
          'start_standard': '',
          'start_fee': '',
          'add_standard': '',
          'add_fee': '',
          'region_name': '未添加地区',
          'index': 0
        },
        {
          'region_id': '',
          'start_standard': '',
          'start_fee': '',
          'add_standard': '',
          'add_fee': '',
          'region_name': '未添加地区',
          'index': 1
        }
      ]
      if (this.routerId) {
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
      }
    }
  }
}
</script>

<style scoped>

</style>
