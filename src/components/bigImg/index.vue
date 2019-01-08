<template>
  <!-- 过渡动画 -->
  <!--<transition name="fade">-->
  <self-dialog
    :visible.sync="selfDialog"
    :before-close="handleClose"
    width="50%"
  >
    <div class="img-view" @click="bigImgs">
      <!-- 遮罩层 -->
      <!--<div class="img-layer">-->

      <!--</div>-->
      <div class="img">
        <img :src="imgSrc" >
      </div>
      <!--<div class="img">-->
      <!--</div>-->
    </div>
  </self-dialog>

  <!--</transition>-->
</template>

<script>
import './index.scss'
import selfDialog from '@/components/selfDialog/selfDialog'
export default {
  name: 'BigImg',
  components: {
    selfDialog
  },
  // props: ['imgSrc'],
  props: {
    imgSrc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selfDialog: true
    }
  },
  methods: {
    bigImgs() {
      this.$emit('clickit')
    },
    handleClose() {
      this.bigImgs()
    }
  }
}
</script>

<style scoped>

</style>
