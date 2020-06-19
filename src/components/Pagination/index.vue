<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      v-if="pageShow"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return{
      pageShow: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        // const newVal = val * 10
        // const newPage = val - 1
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      if (this.currentPage * val > this.total) { // 只有比总数大的情况下需要重新加载分页，不然不需要
        this.pageShow = false;
        this.$nextTick(() => {
          this.pageShow = true
        })
      }
      this.$emit('pagination', { page: this.currentPage, limit: val })
      // if (this.autoScroll) {
      //   scrollTo(0, 800)
      // }
    },
    handleCurrentChange(val) {
      // const newVal = (val - 1) * 10
      // size不管选择多少都让page为1
      this.$emit('pagination', { page: val, limit: this.pageSize })
      // if (this.autoScroll) {
      //   scrollTo(0, 800)
      // }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 0 16px;
}
.pagination-container.hidden {
  display: none;
}
.pagination-container{
  margin-top: 20px;
}
</style>
