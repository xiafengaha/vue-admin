<template>
  <common :college-id="collegeId"/>
</template>

<script>
import common from './components/common'
export default {
  name: 'Personality',
  components: {
    common
  },
  data() {
    return {
      collegeId: 3 // 个性管理
    }
  }
}
</script>

<style scoped>

</style>
