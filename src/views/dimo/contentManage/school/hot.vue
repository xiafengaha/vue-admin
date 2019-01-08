<template>
  <common :college-id="collegeId"/>
</template>

<script>
import common from './components/common'
export default {
  name: 'Hot',
  components: {
    common
  },
  data() {
    return {
      collegeId: 1 // 学院管理
    }
  }
}
</script>

<style scoped>

</style>
