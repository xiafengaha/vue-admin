<template>
  <div class="change-address">
    <el-cascader
      style="width:100%"
      v-model="address"
      :options="addressData"
      @change="changeAddress"
      :disabled="routerData.type === 'check'"
      placeholder="请选择地址"
      :props="props"
    >
      <template slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
      </template>
    </el-cascader>
  </div>
</template>

<script>
import { getAddressJson } from "utils/address.js";
export default {
  name: "",
  props: {
    propsAddress: {
      default: [],
      required: true
    }
  },
  data() {
    return {
      addressData: getAddressJson(),
      props: {
        label: "name",
        value: "code"
      },
      address: [],
      routerData: {}
    };
  },

  components: {},

  computed: {},

  beforeMount() {},
  created() {
    this.initData();
  },
  mounted() {
    // console.log(this.addressData, "addressJson");
    this.address = [...this.propsAddress];
    console.log(this.address, "address");
  },

  methods: {
    changeAddress(val) {
      let filterProvince = this.addressData.filter(item => {
        return item.code === val[0];
      });
      let filterCity = filterProvince[0].children.filter(item => {
        return item.code === val[1];
      });
      let filterArea = filterCity[0].children.filter(item => {
        return item.code === val[2];
      });
      let valName = [
        filterProvince[0].name,
        filterCity[0].name,
        filterArea[0].name
      ];
      this.$emit("changeAddress", val, valName);
    },
    initData() {
      let routerData = this.$route.query;
      this.routerData = { ...routerData };
    }
  },

  watch: {}
};
</script>
<style lang='' scoped>
</style>