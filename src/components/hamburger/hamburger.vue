<template>
  <div>
    <div class="hamburger" @click="toggleClick">
      <div>
        <i :class="isActive ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
      </div>
      
      <!-- <p class="unfold hamburger-item" v-if='isActive'>
        
      </p>
      <p class="pack hamburger-item" v-if="!isActive">
        <i class="el-icon-s-unfold"></i>
      </p> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hamburger',
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
      toggleClick: {
        type: Function,
        default: null
      }
    }
  }
</script>

<style scoped lang="scss">
  .hamburger {
    // color: #fff;
    i{
      font-size: 18px;
    }
    cursor: pointer;
    .hamburger-item{
      height: 48px;
      line-height: 48px;
      width: 100%;
      // background-color: rgba(255, 255, 255, 0.15);
      i {
        font-size: 16px;
        display: inline-block;
        margin: 0;
      }
    }
    .unfold {
      text-align: right;
      padding-right: 20px;
    }
    .pack {
      text-align: center;
      i {
        transform: rotate(180deg);
      }
    }
  }
  /*

    .hamburger {
      display: inline-block;
      cursor: pointer;
      width: 20px;
      height: 20px;
      transform: rotate(90deg);
      transition: .38s;
      transform-origin: 50% 50%;
    }

    .hamburger.is-active {

  transform:

  rotate
  (
  0
  deg

  )
  ;
  } */

</style>
