<!-- 用户设置-密码修改 -->
<template>
  <el-dialog title :visible.sync="isShow" width="530px">
    <div class="user-setting">
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordForm"
        class="password-form"
        label-width="100px"
      >
        <el-form-item required label="原密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="passwordForm.oldPassword"
            :maxlength="32"
            placeholder="原密码"
          ></el-input>
        </el-form-item>
        <el-form-item required label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
            :maxlength="32"
            placeholder="4-32位字母加数字组合"
          ></el-input>
        </el-form-item>
        <el-form-item required label="确认密码" prop="checkPassword">
          <el-input
            type="password"
            :maxlength="32"
            v-model="passwordForm.checkPassword"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-control">
        <el-button type="primary" size="small" :loading="loading" @click="changePass">确认修改</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { changePassWord } from "api/user-api";
var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,32}$/;
import { mapMutations } from "vuex";

export default {
  props: {
    userSetting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var newPasswordValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (!reg.test(value)) {
        callback(new Error("4到32位字母加数字组合的密码"));
      } else {
        if (this.passwordForm.checkPassword !== "") {
          this.$refs.passwordForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var checkPasswordValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      isShow: false,
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        checkPassword: ""
      },
      loading: false,
      passwordRules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        newPassword: [{ validator: newPasswordValidator, trigger: "blur" }],
        checkPassword: [{ validator: checkPasswordValidator, trigger: "blur" }]
      }
    };
  },
  methods: {
    changePass() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          //验证通过
          this.loading = true;
          let passWord = {
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          };
          changePassWord(passWord)
            .then(res => {
              //3秒后跳转
              this.$message({
                message: "密码修改成功 3秒后跳转至登录",
                type: "success"
              });
              this.loading = false;
              //删除用户信息
              this.log_out();
              setTimeout(() => {
                this.$router.replace({
                  name: "login"
                });
              }, 3000);
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err);
            });
        }
      });
    },
    ...mapMutations({
      log_out: "LOG_OUT"
    }),
    showChangePass() {
      this.isShow = true;
    },
    cancel() {
      this.isShow = false;
      this.$refs.passwordForm.resetFields();
    }
  }
};
</script>
<style lang="scss">
.user-setting {
  background-color: #fff;
  padding: 40px;
  .password-form {
    width: 380px;
    min-height: 260px;
    .el-form-item__label {
      padding: 0 24px 0 0;
    }
    .el-select {
      width: 100%;
    }
  }
  .btn-control {
    text-align: center;
    height: 40px;
    line-height: 40px;
    .el-button {
      width: 120px;
    }
  }
}
</style>
