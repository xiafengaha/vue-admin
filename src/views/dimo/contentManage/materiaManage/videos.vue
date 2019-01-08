<template>
  <common :parent-data="videoData" />
</template>

<script>
import common from './components/common'
export default {
  name: 'Videos',
  components: {
    common
  },
  data() {
    return {
      videoData: {
        type: 1,
        title: '视频',
        tip: '上传视频预览图',
        accept: '.mp4,.mov,.f4v,.mpg,.mkv'
      }
    }
  }
}
</script>

