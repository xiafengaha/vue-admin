<template>
  <!--<span>发货地址</span>-->
  <div>
    <el-button v-db-click v-has="'warehouse.add'" type="primary" @click="addAddress">
      新增地址
    </el-button>
    <table-configure
      v-if="tableConfig"
      ref="tableConfig"
      :data-table="dataTable"
      style="margin-top: 10px"
      @tableDataHandle="tableDataHandle"
      @editorRow="editorRow"
      @delRow="delRow"
      @paginationData="paginationData"
    >
      <template slot-scope="props" slot="province_name">
        <span>
          {{ props.obj.row.province_name }}{{ props.obj.row.city_name }}{{ props.obj.row.district_name }}
        </span>
      </template>
      <template slot-scope="props" slot="is_default">
        <span v-if="props.obj.row.is_default">
          【默认】 发货地址
          <!--{{ props.obj.row.province_name }}{{ props.obj.row.city_name }}{{ props.obj.row.district_name }}-->
        </span>
        <span v-if="props.obj.row.is_refund">
          【默认】 退货地址
        </span>

      </template>
    </table-configure>
    <self-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="30%">
      <el-row>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-col :span="24">
            <el-form-item label="收/发货人" prop="realname">
              <el-input v-model="ruleForm.realname" max-length="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="ruleForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收/发地址" required>
              <!--<el-row :gutter="16">-->
              <el-col :span="8">
                <el-select v-model="ruleForm.province" clearable placeholder="请选择省" @change="changeProvince">
                  <el-option
                    v-for="item in areaListData._child"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="ruleForm.city" clearable placeholder="请选择市" @change="changeCity">
                  <el-option
                    v-for="item in cityListData._child"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="ruleForm.district" clearable placeholder="请选择区" @change="changeDistrict">
                  <el-option
                    v-for="item in districtListData._child"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-col>
              <!--</el-row>-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="ruleForm.address" max-length="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="默认地址">
              <el-checkbox v-model="ruleForm.is_default">
                发货
              </el-checkbox>
              <el-checkbox v-model="ruleForm.is_refund">
                收货
              </el-checkbox>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-db-click @click="dialogVisible = false">取 消</el-button>
        <el-button v-db-click @click="resetAll('ruleForm')">重 置</el-button>
        <el-button v-db-click type="primary" @click="saveFun('ruleForm')">确 定</el-button>
      </span>
    </self-dialog>
  </div>
</template>
<script>
import tableConfigure from '@/components/table/tableConfig'
import { wareHouseList, wareHouseAdd, wareHouseUplate, wareHouseDel } from '@/api/configPage/address'
import selfDialog from '@/components/selfDialog/selfDialog'
import { areaList } from '@/api/common'
export default {
  name: 'Index',
  components: {
    tableConfigure,
    selfDialog
  },
  data() {
    return {
      dataTable: { // 表格配置
        tr: [
          {
            fieldName: '收/发货人',
            fieldId: 0,
            propName: 'realname'
          },
          {
            fieldName: '联系电话',
            fieldId: 1,
            propName: 'phone'
          },
          {
            fieldName: '收/发地址',
            fieldId: 2,
            propName: 'province_name'
          },
          {
            fieldName: '详细地址',
            fieldId: 3,
            propName: 'address'
          },
          {
            fieldName: '地址类型',
            fieldId: 4,
            propName: 'is_default'
          }
        ], // 表头数据
        data: [], // 表格内容数据
        hasSelect: false, // 有无选中功能
        maxHeight: null, // 表格最大高度
        height: null, // 表格高度。
        border: true,
        offset: 0,
        limit: 10,
        _count: 0,
        paginationShow: true, // 是否需要分页
        paginationStyle: {
          textAlign: 'right', // 靠右还是左
          marginTop: '10px'
        },
        hasOperation: true, // 有无操作功能
        operation: { // 操作功能
          label: '操作',
          width: '200',
          data: [
            {
              label: '编辑',
              Fun: 'editorRow',
              type: 'text',
              size: 'mini',
              id: '0',
              name: 'warehouse.edit'
            },
            {
              label: '删除',
              Fun: 'delRow',
              type: 'text',
              size: 'mini',
              id: '1',
              name: 'warehouse.del'
            }
          ]
        }
      },
      tableConfig: true,
      dialogTitle: '新增地址',
      dialogVisible: false,
      ruleForm: {},
      rules: {
        realname: [
          { required: true, message: '收/发货人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        district: [
          { required: true, message: '请选择区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请添写详细地址', trigger: 'blur' }
        ]
      },
      areaListData: {}, // 省数据
      cityListData: {}, // 城市数据
      districtListData: {}, // 区数据
      initListPagination: {
        offset: 0,
        limit: 10
      },
      updateRuleForm: {}
    }
  },
  created() {
    this.initAddress(this.initListPagination) // 获取地址列表
    this.initArea() // 获取省市区
  },
  methods: {
    saveFun(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm, 'rule')
          this.ruleForm.is_default ? this.ruleForm.is_default = 1 : this.ruleForm.is_default = 0
          this.ruleForm.is_refund ? this.ruleForm.is_refund = 1 : this.ruleForm.is_refund = 0
          this.addOrUplate(this.ruleForm, formName)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      // this.$nextTick(() => {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }

      // })
      // for (let item in this.ruleForm) {
      //   this.ruleForm[item] = ''
      // }
    },
    addOrUplate(data, formName) {
      let axiosApi
      this.dialogTitle === '新增地址' ? axiosApi = wareHouseAdd(data) : axiosApi = wareHouseUplate(data)
      axiosApi.then(res => {
        let messageText
        this.dialogTitle === '新增地址' ? messageText = '新增成功' : messageText = '修改成功'
        this.$message.success(messageText)
        this.initAddress(this.initListPagination)
        this.resetForm(formName)
        this.dialogVisible = false
      })
    },
    initArea() {
      areaList().then(res => {
        // console.log(res, 'res')
        this.areaListData = JSON.parse(JSON.stringify(res.data[0]))
      })
    },
    initAddress(params) {
      wareHouseList(params).then(res => {
        // console.log(res, 'res')
        this.dataTable.data = JSON.parse(JSON.stringify(res.data.data))
        this.dataTable._count = res.data._count
      })
    },
    tableDataHandle() { // table数据处理函数
      const handleTableData = JSON.parse(JSON.stringify(this.dataTable.tr))
      handleTableData.forEach((item, index) => { // 写表格api的时候建议加个字段。字段内容是每个表头对应的key,这样prop就可以用这个字段
        item.label = item.fieldName // 表头名称
        item.id = item.fieldId // 表头ID
        item.sortable = false // 是否要排序
        item.prop = item.propName // 这个是相应的显示字段
        if (item.prop === 'province_name' || item.prop === 'is_default') {
          item.hasCenterCol = true
          item.show = 'template'
        }
        // item.fixed = (item.isFixed == '0' ? false : (item.isFixed == '1' ? 'left': 'right')); // 这里配置固定列的，false不固定，其他是左右固定
      })
      // this.tablelist();
      // 数据copy表头数据不用管
      this.dataTable.tr = JSON.parse(JSON.stringify(handleTableData))
      // this.dataTable.hasSelect = false; // 是否多选
      // this.dataTable.hasExpand = false; // 是否展开
      // ------------------表格内的数据。这个要自己配-----------------------------------------------------------------------------------------------------------------------
      // this.dataTable.data = JSON.parse(JSON.stringify(this.tableList));  // 这里我把表格数据和表头的配相同的了。需要定制化的就看26行代码中的prop这个key
      this.dataTable.tableStyle = { // 表格的样式
        textAlign: 'center',
        width: '100%'
      }
      this.dataTable.headerCellStyle = { // 表头文字的样式
        textAlign: 'center' // 表头文字是否居中对齐center居中，left左对齐，right右对齐
      }
      // 为了让组件重新渲染更新
      // this.$refs.tableConfig.domShow = false
      // this.$nextTick(() => {
      //   this.$refs.tableConfig.domShow = true
      // })
    },
    editorRow(index, row) { // 编辑行
      this.dialogTitle = '修改(' + row.realname + ')的地址'
      this.dialogVisible = true
      row.is_default ? row.is_default = true : row.is_default = false
      row.is_refund ? row.is_refund = true : row.is_refund = false
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.updateRuleForm = JSON.parse(JSON.stringify(row))
      this.changeProvince(row.province)
      this.changeCity(row.city)
    },
    delRow(index, row) { // 删除行
      // console.log(row, 'del')
      this.$confirm('此操作将永久删除该地址(' + row.realname + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delAddressList(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delAddressList(id) {
      wareHouseDel(id).then(res => {
        this.$message.success('删除成功')
        this.initAddress(this.initListPagination)
      })
    },
    paginationData(data) {
      this.dataTable.offset = (data.offset - 1) * 10
      this.dataTable.limit = data.limit
      let params = {
        offset: this.dataTable.offset,
        limit: this.dataTable.limit
      }
      this.initAddress(params)
    },
    changeProvince(val) {
      // let newArr = val.split(',')
      this.ruleForm.province = Number(val)
      // this.ruleForm.province_name = newArr[1]
      this.getCityData(val)
    },
    getCityData(id) {
      let newData = this.areaListData._child.find(item => {
        return String(item.id) === String(id)
      })
      this.ruleForm.province_name = newData.name
      this.cityListData = JSON.parse(JSON.stringify(newData))
    },
    changeCity(val) {
      this.ruleForm.city = Number(val)
      this.getDistrictData(val)
    },
    changeDistrict(val) {
      this.ruleForm.district = Number(val)
      let newData = this.districtListData._child.find(item => {
        return String(item.id) === String(val)
      })
      this.ruleForm.district_name = newData.name
    },
    getDistrictData(id) {
      let newData = this.cityListData._child.find(item => {
        return String(item.id) === String(id)
      })
      this.ruleForm.city_name = newData.name
      this.districtListData = JSON.parse(JSON.stringify(newData))
    },
    addAddress() { // 新增地址
      this.dialogVisible = true
      this.dialogTitle = '新增地址'
      // this.$nextTick(() => {
      this.resetForm('ruleForm')
      // })
    },
    resetAll(formName) {
      // this.$nextTick(() => {
      this.resetForm(formName)
      if (this.dialogTitle !== '新增地址') {
        this.ruleForm = JSON.parse(JSON.stringify(this.updateRuleForm))
        this.changeProvince(this.updateRuleForm.province)
        this.changeCity(this.updateRuleForm.city)
      }
    }
  }
}
</script>

<style scoped>

</style>
