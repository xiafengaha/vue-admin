/*
* 分页器事件mixin
* */


export const pagination = {
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      totalCount: 0,
    }
  },
  methods: {
    handleCurrentChange(val) {
      //页码
      this.pageNum = val
      this.paginationEvents()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.paginationEvents()
    },
    resetPagination(){
      this.pageNum = 1
    }
  }
}
