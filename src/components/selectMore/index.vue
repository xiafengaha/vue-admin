<template>
  <div>
    <el-select v-loadmore="moreData" @change="changeSelect" v-model="selectData.value" filterable :placeholder="selectData.placeholder" clearable>
      <el-option
        v-for="item in selectData.options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "SelectMore",
  props: {
    selectData: {
      type: Object,
      required: true
    }
  },
  methods: {
    moreData() { // 加载更多数据
      this.$emit('moreData')
    },
    changeSelect(val) { // 选择事件
      // 为了将value传给父组件
      this.$emit('changeSelect', val)
    }
  }
}
</script>

<style scoped>

</style>
