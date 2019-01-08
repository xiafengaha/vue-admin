<template>
  <common :college-id="collegeId"/>
</template>

<script>
import common from './components/common'
export default {
  name: 'Advanced',
  components: {
    common
  },
  data() {
    return {
      collegeId: 2 // 进阶管理
    }
  }
}
</script>

<style scoped>

</style>
