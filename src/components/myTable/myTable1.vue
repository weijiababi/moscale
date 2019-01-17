<template>
  <div class="myTable">
    <Table stripe :columns="column" :data="tableData" :width="width" :style="{border: 'none'}"></Table>
    <div class="page" v-if="switchPage">
      <Page
        :total="total"
        :pageSize="pageSize"
        @on-change="pageChange"
        :style="{padding: '2px 0'}"
      />
    </div>
  </div>
</template>

<script>
import http from '../../static/js/http.js'
export default {
  props: {
    column: {
      type: Array
    },
    url: {
      type: String
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: String,
      default: () => {
        return 'auto'
      }
    },
    pageSize: {
      type: Number,
      default: () => {
        return 10
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      total: 1,
      tableData: [],
      switchPage: false
    }
  },
  methods: {
    getData() {
      http
        .postNormal(this.url, { ...this.params, page: this.currentPage })
        .then(res => {
          console.log(`获取第${this.currentPage}页数据`)
          console.log(res)
          if (res.data.code == 200) {
            this.tableData = res.data.data.data
            this.currentPage =
              res.data.data.current_page > 0 ? res.data.data.current_page : 1
            this.total = res.data.data.total
            this.switchPage = res.data.data.last_page > 1 ? true : false
          }
        })
    },
    pageChange(val) {
      this.currentPage = val
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    params() {
      this.currentPage = 1
      this.getData()
    }
  }
}
</script>

<style scoped lang="stylus">
.page
  margin-top 10px
</style>
