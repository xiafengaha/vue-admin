<template>
  <common :parent-data="pictureData" />
</template>

<script>
import common from './components/common'
export default {
  name: 'Picture',
  components: {
    common
  },
  data() {
    return {
      pictureData: {
        type: 2,
        title: '图片',
        accept: 'image/jpeg,image/gif,image/png'
      }
    }
  }
}
</script>

