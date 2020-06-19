<template>
  <div class="time-line-box">
    <div class="header">
      <div class="product-box">
        <span class="express">{{info.expressName}}</span>
        <span class="order">{{info.expressNo}}</span>
      </div>
    </div>
    <!-- {list.map((item, index) => ( -->
    <div v-for="(item, index) in info.list" :key="'timeLine' + index" class="ys-list">
      <div class="des-time">
        <span class="date">{{item.date}}</span>
        <span class="time">{{item.time}}</span>
      </div>
      <div class="des-mes">
        <div class="list-dot">
          <div class="dot" />
        </div>
        <span class="des">{{item.acceptStation}}</span>
      </div>
    </div>
    <!-- ))} -->
  </div>
</template>

<script>
import "./index.scss";
export default {
  name: "",
  props: ["info"],
  data() {
    return {};
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {},

  watch: {}
};
</script>
<style lang='' scoped>
</style>