<template>
  <el-card class="finance-config">
    <el-row>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
        <el-col :span="24">
          <el-form-item label="单次最低提现金额:">
            <el-input>
              <template slot="prepend">
                ¥
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="单次最高提现金额:">
            <el-input>
              <template slot="prepend">
                ¥
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="单日最高提现金额:">
            <el-input>
              <template slot="prepend">
                ¥
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手续费:" prop="price">
            <el-input maxLength="2" v-model="ruleForm.price">
              <template slot="prepend" style="width: 48px">
                %
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label=" ">
            <el-button v-db-click @click="returnPage">返 回</el-button>
            <el-button v-db-click type="primary">保 存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-card>
</template>

<script>
  import './style/config.less'
  export default {
    name: "config",
    data() {
      return {
        ruleForm: {},
         rules: {
           price: [
             {
               required: true, message: '请输入手续费', trigger: 'blur'
             },
             { pattern: '^[+]{0,1}(\\d+)$', message: '请输入1-99内的正整数'}
           ]
         }
      }
    },
    methods: {
      returnPage() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped lang="less">

</style>
