<template>
  <div class="statisticChart">
    <PageTitle :tips="tips">
      <template slot="mainPath">报表</template>
      <template slot="path">统计报表</template>
      <template slot="mainTitle">统计报表</template>
    </PageTitle>

    <div class="condition">
      <div class="way">
        <div
          class="wayItem"
          v-for="(item, index) in wayList"
          :key="index"
          :class="{active: activeIndex == index}"
          @click="selectWay(index)"
        >按{{item.name}}显示</div>
      </div>
      <div class="date">
        <DatePicker
          type="date"
          show-week-numbers
          placeholder="选择日期"
          style="width: 200px"
          @on-change="selectData"
        ></DatePicker>
      </div>
    </div>

    <div class="tableWrapper">
      <div class="tableContent">
        <div class="tableInner">
          <MyTable :column="columns" :url="url" :params="params"></MyTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import MyTable from '../myTable/myTable1.vue'
import { getNowFormatDate } from '../../static/js/config.js'
export default {
  data() {
    return {
      tips: '消费记录按照每天进行日结,如果没有任何消费则不产生记录',
      wayList: [{ name: '任务' }, { name: '公众号' }],
      activeIndex: 0,
      columns: [
        {
          title: '任务名',
          render: (h, params) => {
            return h('div', [
              h(
                'strong',
                params.row.remark && params.row.remark != ''
                  ? params.row.remark
                  : params.row.identifier
              )
            ])
          }
        },
        {
          title: '日期',
          key: 'create_time'
        },
        {
          title: '消费金额（元）',
          key: 'price'
        },
        {
          title: '粉丝数（个）',
          key: 'number'
        },
        {
          title: '相关公众号',
          key: 'account_name'
        },
        {
          title: '单粉成本(元)',
          key: 'average_price'
        }
      ],
      url: '/frontend/goods_report_day/finds',
      params: {}
    }
  },
  methods: {
    selectWay(index) {
      this.activeIndex = index
    },
    selectData(val) {
      let startTime = val + ' 00:00:00'
      let endTime = val + ' 23:59:59'
      this.params = {
        start_time: startTime,
        end_time: endTime
      }
      console.log(this.params)
    },
    _initTime() {
      let startTime = getNowFormatDate() + ' 00:00:00'
      let endTime = getNowFormatDate(1) + ' 00:00:00'
      this.params = {
        start_time: startTime,
        end_time: endTime
      }
    }
  },
  mounted() {
    this._initTime()
  },
  components: {
    PageTitle,
    MyTable
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.statisticChart
  $flex-column-start()
  height 100%
  .condition
    $flex-row-start()
    flex 0 1 auto
    margin 20px 0
    .way
      $flex-row-start()
      margin-right 40px
      .wayItem
        padding 6px 0
        width 100px
        font-size $font-size-small
        color $theme-color
        background-color #fff
        text-align center
        border 1px solid $theme-color
        cursor pointer
        &.wayItem:first-child
          border-top-left-radius 4px
          border-bottom-left-radius 4px
        &.wayItem:last-child
          border-left none
          border-top-right-radius 4px
          border-bottom-right-radius 4px
        &.active
          color #fff
          background-color $theme-color
  .tableWrapper
    flex 1
    position relative
    .tableContent
      position absolute
      top 0
      left 0
      width 100%
      .tableInner
        position relative
        width 100%
</style>
