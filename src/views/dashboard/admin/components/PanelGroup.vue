<template>
  <el-row :gutter="32" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" style="text-align: center;height: 180px" @click="handleSetLineChartData('purchases')">
        <div class="overflow-hidden" style="margin-top: 10px">
          <svg-icon icon-class="wallet" class="svg-wallet"/>
        </div>
        <div style="font-size: 48px;font-weight: bold">
          ￥
          <count-to :start-val="0" :end-val="todayCountNum" :duration="3200" class="card-panel-num"/>
          <!--<span>{{ countNum | filteNumber }}</span>-->
        </div>
        <div style="margin-bottom: 20px">
          <span>今日成交额</span>
        </div>
        <div style="margin-bottom: 20px">
          <span>昨日成交额￥</span>
          <count-to :start-val="0" :end-val="yesterdayCountNum" :duration="3200" class="card-panel-num"/>
          <svg-icon :icon-class="topOrDown?'arrow-top': 'arrow-down'"/>
          <span>{{ percentageData }}</span>
        </div>
        <!--<div class="card-panel-icon-wrapper icon-money">-->

        <!--</div>-->
        <!--<div class="card-panel-description">-->
        <!--<div class="card-panel-text">Purchases</div>-->
        <!--</div>-->
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" style="text-align: center;height: 180px" @click="handleSetLineChartData('newVisitis')">
        <div class="overflow-hidden" style="margin-top: 10px">
          <svg-icon icon-class="order" style="font-size: 48px"/>
        </div>
        <div style="font-size: 48px;font-weight: bold;color: #000">
          <count-to :start-val="0" :end-val="pendingData" :duration="3200" class="card-panel-num"/>
        </div>
        <div style="margin-bottom: 20px">
          <span>待处理订单</span>
        </div>
        <div style="margin-bottom: 20px">
          <span>待发货:</span>
          <count-to :start-val="0" :end-val="pendingDelivery" :duration="3200" class="card-panel-num"/>
          <span>售后:</span>
          <count-to :start-val="0" :end-val="afterSale" :duration="3200" class="card-panel-num"/>
        </div>
        <!--<div class="card-panel-icon-wrapper icon-people">-->
        <!--<svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
        <!--</div>-->
        <!--<div class="card-panel-description">-->
        <!--<div class="card-panel-text">New Visits</div>-->
        <!--<count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/>-->
        <!--</div>-->
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" style="height: 180px" @click="handleSetLineChartData('messages')">
        <!--<pie-chart/>-->
        <pie-chart/>
        <!--<count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>-->
        <!--<div class="card-panel-icon-wrapper icon-message">-->
        <!--<svg-icon icon-class="message" class-name="card-panel-icon" />-->
        <!--</div>-->
        <!--<div class="card-panel-description">-->
        <!--<div class="card-panel-text">Messages</div>-->

        <!--</div>-->
      </div>
    </el-col>

    <!--<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
    <!--<div class="card-panel" @click="handleSetLineChartData('shoppings')">-->
    <!--<div class="card-panel-icon-wrapper icon-shopping">-->
    <!--<svg-icon icon-class="shopping" class-name="card-panel-icon" />-->
    <!--</div>-->
    <!--<div class="card-panel-description">-->
    <!--<div class="card-panel-text">Shoppings</div>-->
    <!--<count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-col>-->
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import pieChart from './PieChart'
export default {
  components: {
    CountTo,
    pieChart
  },
  data() {
    return {
      todayCountNum: 6000,
      yesterdayCountNum: 9000,
      percentageData: '', // 百分比
      topOrDown: false, // 升还是降
      pendingData: 100,
      pendingDelivery: 2, // 待发货
      afterSale: 3 // 售后
    }
  },
  created() {
    this.handleCountTage(this.todayCountNum, this.yesterdayCountNum)
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleCountTage(num, total) {
      if ((100 - (Math.round(num / total * 10000) / 100.00)).toFixed(2) < 0) { // 小于0是上升的
        this.percentageData = (((Math.round(num / total * 10000) / 100.00).toFixed(2)) - 100 + '%')// 小数点后两位百分比
        this.topOrDown = true // true是升
      } else {
        this.percentageData = ((100 - (Math.round(num / total * 10000) / 100.00)).toFixed(2) + '%')// 小数点后两位百分比
        this.topOrDown = false // true是升
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    /*height: 108px;*/
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  .svg-wallet{
    font-size: 48px;
  }
}
</style>
