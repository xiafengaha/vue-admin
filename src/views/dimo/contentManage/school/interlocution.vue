<template>
  <common :college-id="collegeId"/>
</template>

<script>
import common from './components/common'
export default {
  name: 'Interlocution',
  components: {
    common
  },
  data() {
    return {
      collegeId: 4 // 问答管理
    }
  }
}
</script>

<style scoped>

</style>
