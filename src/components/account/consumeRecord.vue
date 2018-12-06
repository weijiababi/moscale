<template>
  <div class="consumeRecord">
    <PageTitle :tips="tips">
      <template slot='mainPath'>
        账户
      </template>
      <template slot='path'>
        消费记录
      </template>
      <template slot='mainTitle'>
        消费记录
      </template>
    </PageTitle>
    <div class="recordTable">
      <div class="tableWrapper">
        <div class="tableContent">
          <MyTable
            :column='columns'
            :url='url'>
          </MyTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import MyTable from '../myTable/myTable1.vue'
export default {
  data() {
    return {
      tips: '消费记录按照每日进行更新，如果当前无任何消费则不产生记录',
      columns: [
          {
            title: '日期',
            key: 'create_time',
            render: (h, params) => {
              return h('div', params.row.create_time.substr(0, 10))
            }
          },
          {
            title: '消费金额(元)',
            key: 'price'
          },
          {
            title: '粉丝数(个)',
            key: 'number'
          },
      ],
      url: '/frontend/user_wallet/consumeRecord'
    }
  },
  components: {
    PageTitle,
    MyTable
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.consumeRecord
  $flex-column-start()
  height 100%
  .recordTable
    flex 1
    position relative
    padding 20px 0
    .tableWrapper
      position absolute
      top 20px
      left 0
      width 100%
      .tableContent
        position relative
        height 100%
</style>
