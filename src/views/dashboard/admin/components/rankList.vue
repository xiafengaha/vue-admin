<template>
  <div>
    <el-radio-group v-model="rankRadio" @change="changeRadio">
      <el-radio-button label="0">经销商排名</el-radio-button>
      <el-radio-button label="1">区域</el-radio-button>
      <el-radio-button label="2">官方</el-radio-button>
      <el-radio-button label="3">天使</el-radio-button>
    </el-radio-group>
    <!--排行榜-->
    <ul v-loadmore="rankListMore" class="rank-ul">
      <li v-for="(item, index) in rankListData" :key="index" class="rank-li">
        <div class="rank-name">
          <span>{{ item.name }}</span>
        </div>
        <div class="rank-money">
          <span>￥</span>
          <count-to :start-val="0" :end-val="item.money" :duration="2000" class="card-panel-num"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  name: 'RankList',
  components: {
    countTo
  },
  data() {
    return {
      rankRadio: '0',
      rankListData: []
    }
  },
  created() {
    this.rankList(0)
  },
  methods: {
    changeRadio(val) { // 排行榜选择事件
      this.rankListData = [] // 切换排行榜需要置空之前的数据
      this.rankList(val)
    },
    rankList(type) { // 获取排行榜的数据函数
      for (let i = 0; i < 10; i++) {
        this.rankListData.push(
          {
            name: '迪茉之家这是' + type,
            money: type * 10000
          })
      }
    },
    rankListMore() { // 加载更多
      this.rankListData.push(
        {
          name: '加载更多的',
          money: 10000
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .rank-ul{
    height: 350px;
    overflow-y: auto;
    margin: 0;
    .rank-li{
      overflow: hidden;
      padding: 10px 0;
      .rank-name{
        float: left;
      }
      .rank-money{
        float: right;
      }
    }
  }

</style>
