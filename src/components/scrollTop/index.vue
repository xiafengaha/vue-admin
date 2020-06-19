<template>
  <transition name="el-fade-in">
    <div class="page-up" @click="scrollToTop" v-show="toTopShow">
      <svg-icon icon-class="top-active"></svg-icon>
    </div>
  </transition>
</template>

<script>
export default {
  name: "index",
  data() {
    return{
      toTopShow: false
    }
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('scroll', this.handleScroll,true);
    });
  },
  methods: {
    handleScroll() {
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrollTop, 'scrollTop')
      // console.log(document.getElementsByClassName('el-main')[0].scrollTop)
      let scrollTop = document.getElementsByClassName('el-main')[0].scrollTop;
      this.scrollTop = scrollTop;
      this.toTopShow = scrollTop > 300
    },
    scrollToTop() {
      let that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5)
        document.getElementsByClassName('el-main')[0].scrollTop = that.scrollTop + ispeed
        if (that.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    }
  },
  destroyed() {
    window.addEventListener('scroll', this.handleScroll,true);
  }
}
</script>

<style scoped lang="scss">
  .page-up{
    position: fixed;
    right: 50px;
    bottom: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: .3s;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
    z-index: 100;
    .el-icon-caret-top{
      color: #fff;
      display: block;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
    }
    p{
      display: none;
      text-align: center;
      color: #fff;
    }
    &:hover{
      color: #fff;
      background-color: #333;
    }
  }
</style>
