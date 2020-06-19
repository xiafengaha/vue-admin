<template>
  <div class="navbar-container">
    <div style="display:flex;margin-left:24px;align-items:center;">
      <hamburger
        class="hamburger-container"
        :toggleClick="toggleSideBar"
        :isActive="sidebar.opened"
      ></hamburger>
      <breadcrumb class="breadcrumb-container" />
    </div>

    <el-menu class="navbar" mode="horizontal">
      <div class="right-menu">
        <el-dropdown trigger="click" class="avatar-container right-menu-item" @visible-change="changeDropDown">
          <span class="el-dropdown-link">
            <i class="iconfont icon-user"></i>
            {{user.realName}}
            <!-- dropDownShow -->
            <i class="el-icon-arrow-down el-icon--right" :style="dropDownShow ? 'transform: rotateZ(180deg); transition: transform .3s' : 'transform: rotateZ(0);transition: transform .3s'"></i>
      
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePassword" command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="singOut" command="singOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <user-setting v-if="show" ref="changePassword"></user-setting>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import UserSetting from "components/user-setting/user-setting.vue";
import hamburger from "components/hamburger/hamburger.vue";
export default {
  components: {
    UserSetting,
    Breadcrumb,
    hamburger
  },
  data() {
    return {
      show: false,
      dropDownShow: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "user"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    // this.getTreeLayerr();
  },
  methods: {
    changeDropDown(type) {
      console.log(type, 'type')
      this.dropDownShow = type;
    },
    toggleSideBar() {
      let menuDom = document.querySelectorAll('.el-menu--inline')
      if (menuDom.length > 0) {
        for (let i = 0 ;i < menuDom.length; i++) {
          menuDom[i].style.display = 'none'
        }
      }
      this.$store.dispatch("toggleSideBar");
    },
    changePassword() {
      this.show = true;
      setTimeout(() => {
        this.$refs.changePassword.showChangePass();
      }, 20);
    },
    singOut() {
      //清空token 角色信息
      this.log_out();
      this.$router.push({
        name: "login"
      });
    },
    ...mapActions(["getTreeLayerr"]),
    ...mapMutations({
      log_out: "LOG_OUT"
    })
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 100%;
}
.el-menu--horizontal {
  border: 0;
}
.navbar {
  height: 100%;
  // line-height: 56px;
  border-radius: 0px !important;
  // background: #0e213f;
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
      &.el-dropdown {
        // color: #fff;
      }
    }
    .question-container {
      cursor: pointer;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
      .international-icon {
        font-size: 20px;
        cursor: pointer;
        vertical-align: -5px;
      }
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 100%;
      margin-right: 30px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>



