<template>
  <div>
    <el-date-picker v-model="filters.column.create_start_date" :picker-options="pickerBeginDateBefore" type="date" format="yyyy-MM-dd" placeholder="开始日期" @change="changeStartTime"/>
    <span>至</span>
    <el-date-picker v-model="filters.column.create_end_date" :picker-options="pickerBeginDateAfter" type="date" format="yyyy-MM-dd" placeholder="结束日期" @change="changeEndTime"/>
  </div>

</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      filters: {
        column: {
          create_start_date: '',
          create_end_date: ''
        }
      },
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          const beginDateVal = this.filters.column.create_end_date
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          const beginDateVal = this.filters.column.create_start_date
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      }
    }
  },
  methods: {
    changeStartTime(val) {
      const startTime = moment(val).format('YYYY-MM-DD')
      this.$emit('getStartTime', startTime)
      // console.log('开始日期',)
    },
    changeEndTime(val) {
      const endTime = moment(val).format('YYYY-MM-DD')
      // console.log('结束日期',moment(val).format("YYYY-MM-DD HH:mm:ss"))
      this.$emit('getEndTime', endTime)
    },
    resetTime() {
      this.filters.column.create_end_date = ''
      this.filters.column.create_start_date = ''
    }
  }
}
</script>

<style scoped>

</style>
