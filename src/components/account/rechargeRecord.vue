<template>
  <div class="rechargeRecord">
    <PageTitle :tips="tips">
      <template slot='mainPath'>
        账户
      </template>
      <template slot='path'>
        充值记录
      </template>
      <template slot='mainTitle'>
        充值记录
      </template>
    </PageTitle>
    <div class="balance" v-if='user.balance'>
      账户余额: <p class="money">{{user.balance}}</p> 元
    </div>
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
import http from '../../static/js/http.js'
import Cookies from 'js-cookie'
import {mapGetters} from 'vuex'
import MyTable from '../myTable/myTable1.vue'

export default {
  data() {
    return {
      tips: '如使用网银打款，到账时间将延迟',
      columns: [
        {title: '日期', key: 'create_time'},
        {title: '金额(元)', key: 'recharge_price'},
        {title: '状态', key: 'status',render:(h,params) => {
          if(params.row.status == 1) {
            return h('div','未支付')
          }else if(params.row.status == 2) {
            return h('div','已支付')
          }
        }}
      ],
      url: '/frontend/recharge_record/finds',
    }
  },
  methods: {
  },
  mounted() {
  },
  components: {
    PageTitle,
    MyTable
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.rechargeRecord
  $flex-column-start()
  height 100%
  .balance
    flex 0 1 auto
    $flex-row-start()
    margin-top 20px
    font-size $font-size-medium
    color $color-dark
    .money 
      margin 0 4px 0 6px
      color $theme-color
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
