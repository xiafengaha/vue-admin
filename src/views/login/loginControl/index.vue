<!--8 雇员加减人（编辑） -->
<template>
  <div class="login-container">
    <!-- <div class="img">
      <img src="./logo.png" alt="启舰LOGO">
    </div>-->
    <div class="login-left">
      <img src="./login_left.png" alt />
    </div>
    <div class="login-right">
      <h1 class="title">登录</h1>
      <!-- <div class="title-line"></div> -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        size="large"
        ref="loginForm"
        class="login-form"
      >
        <el-form-item prop="username" class="login-input" label="账号">
          <el-input
            name="username"
            :maxlength="32"
            v-model.trim="loginForm.username"
            autocomplete="off"
            placeholder="账号"
          >
            <!-- <i slot="prefix" class="iconfont icon-user"></i> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="login-input" label="密码">
          <el-input
            name="password"
            type="password"
            :maxlength="32"
            v-model.trim="loginForm.password"
            autocomplete="off"
            placeholder="密码"
          >
            <!-- <i slot="prefix" class="iconfont icon-password"></i> -->
          </el-input>
        </el-form-item>

        <!-- 验证码 -->
        <!-- <el-form-item class="verifyCode login-input"> -->
        <!-- <el-input
            name="verifyCode"
            :maxlength="6"
            @keyup.enter.native="handleLogin"
            v-model.trim="loginForm.verifyCode"
            autocomplete="off"
            placeholder="请输入验证码"
          >
            <p slot="append" class="verifyCode-img" @click="getVerifyCode">
              <img :src="codeImg" alt="图形验证码" />
            </p>
        </el-input>-->

        <!-- </el-form-item> -->

        <!--记住密码-->
        <!-- <el-form-item class="mini-item" :class="{rememberPass: remember}">
          <el-checkbox name="remember" v-model="remember">记住密码</el-checkbox>
        </el-form-item>-->

        <el-form-item size="small">
          <el-button
            type="primary"
            class="sub-form-btn"
            :loading="loading"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
      <div class="verify-img" v-if="verifyShow">
        <div class="img-box">
          <div class="header">
            <span class="verify-title">请完成安全验证</span>
            <i class="el-icon-close" @click="closeVerify"></i>
          </div>
          <div id="can" @click="getVerifyCode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, getVerifyApi, verifyCode } from "api/user-api";
import { mapMutations } from "vuex";

import {
  saveAccountInfo,
  getAccountInfo,
  removeAccountInfo
} from "utils/storage";
import uuidv4 from "uuid/v4";
import hosts from "api/hosts";

const ENV = process.env.NODE_ENV;

export default {
  data() {
    return {
      verifyShow: false,
      verifyConf: {
        // 设置图片验证参数
        content: "can"
      },
      loginForm: {
        username: "",
        password: "",
        verifyCode: "",
        verifyToken: ""
      },
      verifyCode: "",
      remember: true,
      loginRules: {
        username: [
          { required: true, message: "请输入电话号码", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 32, message: "请输入4-32位密码", trigger: "blur" }
        ]
      },
      loading: false
    };
  },
  computed: {
    codeImg() {
      return hosts[ENV] + this.verifyCode;
    }
  },
  components: {},
  mounted() {
    this.$_getAccountInfo();
  },
  methods: {
    $_getAccountInfo() {
      //登录页打开后检查有没有本地存储 有则数据更新到表单
      let accountInfo = getAccountInfo();

      if (accountInfo) {
        this.loginForm.username = accountInfo.username;
        this.loginForm.password = accountInfo.password;
        this.remember = accountInfo.remember;
      }
    },
    getVerifyCode() {
      //获取验证码
      let _verifyToken = uuidv4()
        .split("-")
        .join("");
      this.loginForm.verifyToken = _verifyToken;
      this.verifyCode = `/session/verifycode?t=${_verifyToken}&w=${300}&h=${80}`;
      // this.$axios({
      //   url: userApi.getVerifyApi.url,
      //   method: userApi.getVerifyApi.method,
      //   params: {
      //     token: _verifyToken
      //   }
      // }).then(res => {
      //   console.log(res, "res");
      // });
      let that = this;
      getVerifyApi({ token: _verifyToken }).then(res => {
        this.verifyShow = true;
        this.$nextTick(() => {
          fastCaptcha.captcha(that.verifyConf).build(res, that.verifyCallback);
        });
      });
      // console.log(fastCaptcha);
    },
    closeVerify() {
      this.verifyShow = false;
    },
    handleSuccess() {},
    initVerify() {
      let that = this;
      // fastCaptcha.captcha(that.conf).build(result, that.verifyCallback);
    },
    verifyCallback(data, postStatus) {
      // 验证回调
      let that = this;
      // if (data > 200) {
      //   postStatus(true, function() {
      //     // console.log('')
      //   });
      // } else {
      //   postStatus(false, function() {
      //     that.getVerifyCode();
      //   });
      // }

      this.ruleCode(data, postStatus);
    },
    ruleCode(data, postStatus) {
      // 验证验证码是否OK
      let that = this;
      verifyCode({ verifyData: data, token: this.loginForm.verifyToken })
        .then(res => {
          if (res.data === "true") {
            postStatus(true, function() {
              that.loginHandle();
            });
          } else {
            this.$message.warning("验证失败，请重新验证！");
            postStatus(false, function() {
              that.getVerifyCode();
            });
          }
        })
        .catch(() => {
          this.$message.warning("验证失败，请重新验证！");

          postStatus(false, function() {
            that.getVerifyCode();
          });
        });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.getVerifyCode();
        } else {
          return false;
        }
      });
    },
    loginHandle() {
      this.loading = true;
      let params = {
        username: this.loginForm.username,
        password: this.loginForm.password,
        // verifyCode: this.loginForm.verifyCode,
        token: this.loginForm.verifyToken
      };
      getToken(params)
        .then(res => {
          this.loading = false;
          this.$message.success("登录成功！");
          let resData = res.data || {};
          let token = resData.token;
          let user = {
            realName: resData.realName,
            functionList: resData.functionList || []
          };
          this.verifyShow = false;
          // if (user.functionList.length === 0) {
          //   this.$message.warning("该账号暂未有权限，请联系管理员！");
          //   return false;
          // }
          //vuex存储
          this.setToken(token);
          this.setUserInfo(user);
          //记住密码勾选
          if (this.remember) {
            let userInfo = {
              username: this.loginForm.username,
              password: this.loginForm.password,
              remember: this.remember
            };
            //使用本地存储记住密码
            saveAccountInfo(userInfo);
          } else {
            //未勾选
            if (getAccountInfo) {
              removeAccountInfo();
            }
          }

          /* 路由跳转*/
          // 重置到保单查询下面的雇主责任险
          let redirectRouter = this.$route.query.redirect;
          // if (redirectRouter === '/dashboard' || !redirectRouter || redirectRouter === '/') {
          //   redirectRouter = '/policy/employer-policy'
          // }
          // redirectRouter = "";
          if (!redirectRouter) {
            redirectRouter = "/dashboard";
          }
          let redirect = decodeURIComponent(redirectRouter);

          this.$router.replace({
            path: redirect
          });
        })
        .catch(err => {
          this.loading = false;
          this.verifyShow = false;
          // this.getVerifyCode();
        });
    },
    ...mapMutations({
      setToken: "TOKEN",
      setUserInfo: "LOGIN"
    })
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scope>
@import "~styles/variable.scss";

.login-container {
  // width: 280px;
  // height: 350px;
  display: flex;
  .login-left,
  .login-right {
    flex-shrink: 0;
  }
  .login-left {
    position: relative;
    width: 440px;
    // .img-title {
    //   position: absolute;
    //   width: 100%;
    //   top: 88px;
    //   left: 0;
    //   text-align: center;
    //   // right: 50%;
    //   // transform: translate(-50%, -50%);
    //   font-size: 20px;
    //   font-weight: 500;
    //   color: rgba(244, 246, 247, 1);
    //   line-height: 28px;
    // }
    img {
      width: 100%;
    }
  }
  .login-right {
    width: 564px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    .el-input__inner {
      border: 0px;
      border-bottom: 1px solid #dcdfe6;
    }
    .verify-img {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .img-box {
        // height: 100%;
        // padding: 19px 30px 20px;
        border-radius: 4px;
        background-color: #fff;
      }
      #can {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 18px;
        margin-top: 15px;
        table {
          &:last-child {
            canvas {
              margin-bottom: 15px;
            }
          }
        }
      }
      .header {
        display: flex;
        align-items: center;
        padding: 19px;
        justify-content: space-between;
        padding-bottom: 18px;
        border-bottom: 1px solid #e6e8ec;
        .verify-title {
          font-size: 16px;
          font-weight: 400;
          color: rgba(19, 20, 21, 1);
          line-height: 22px;
        }
      }
    }
  }
  .el-input {
    width: 100%;
    .el-input__inner {
      padding-left: 30px;
    }
  }
  //logo
  .img {
    height: 58px;
    width: 280px;
    margin-bottom: 10px;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    img {
      height: 100%;
      width: 152px;
    }
  }
  //系统名称
  .title {
    text-align: center;
    font-size: 38px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 53px;
    margin-bottom: 41px;
    span {
      letter-spacing: 6px;
    }
  }
  .title-line {
    width: 102px;
    height: 6px;
    margin: 0 auto 49px !important;
    background-color: $themeColor;
  }
  //表单
  .login-form {
    //输入框
    .login-input {
      width: 424px;
      // height: 67px;
      .el-input__inner {
        background-color: #fff;
        // background: rgba(255,255,255);
        // border: 0;
        // border-bottom: 1px solid #d9d9d9;
        border-radius: 0;
      }
      .el-input__prefix {
        // top:3px;
        .iconfont {
          font-size: 18px;
        }
      }
      ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #c0c4cc;
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #c0c4cc;
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #c0c4cc;
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #c0c4cc;
      }
    }
    //验证码
    .verifyCode {
      &.login-input {
        .el-input__inner {
          padding-left: 30px;
          padding-right: 0;
        }
      }
      .el-input-group__append {
        background: transparent;
        border: 0;
        padding: 0;
        .verifyCode-img {
          width: 130px;
          height: 40px;
          border: 1px solid #d9d9d9;
          border-radius: 3px;
          overflow: hidden;
          margin-left: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    //button
    .el-button {
      width: 100%;
      padding: 11px 15px;
    }
  }
}
</style>
