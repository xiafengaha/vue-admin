<template>
  <el-row class="no__data">
    <el-col :span="24" class="no_data_style">
      <img src="./img/no-data.png" alt="">
      <span>暂无数据显示</span>

    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "NoData",
  data() {
    return{

    }
  },
  methods: {

  }
}
</script>
<style scoped lang="scss">
  .no__data{
    min-height: 100px;
    height: calc(100vh - 280px); // 根据页面布局算出来是220px，为啥多减10Px，因为屏幕小的时候会有滚动条
    background-color: #fff;
    .no_data_style{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex-direction: column;
      span{
        color: #999;
        line-height: normal; // 这个是因为父业面样式会冲突
      }
    }
  }
</style>
