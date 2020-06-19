<!-- 登录 -->
<template>
  <div class="login-bg">
    <div class="login-body-model">
      <div class="login-body">
        <login-control></login-control>
      </div>
    </div>
  </div>
</template>
<script>
import LoginControl from "./loginControl/index.vue";
export default {
  components: {
    LoginControl
  }
};
</script>
<style lang="scss">
.login-bg {
  width: 100%;
  height: calc(100vh);
  // min-width: 1266px;
  // height: 100%;
  // min-height: 754px;
  background-color: #fff;
  background-image: url(./login_bg.png);
  background-size: cover;
  background-position: center;
  position: relative;
  .login-body-model {
    // margin: 27px 33px;
    // height: 100%;
    // min-width: 1200px;
    // min-height: 700px;
    position: absolute;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
    // left: 0;
    // right: calc(5.2%);
    // right: calc((41.25% - 424px) / 2 - 5px);
    // right: calc(0.052 * 100vw);
    top: 50%;
    bottom: 50%;
    z-index: 99;
    // background: rgba(255,255,255,.95);
    border-radius: 4px;
    .login-body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80%;
    }
  }
}
</style>
