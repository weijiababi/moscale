<template>
  <div class="recharge">
    <PageTitle :tips="tips">
      <template slot='mainPath'>
        账户
      </template>
      <template slot='path'>
        充值
      </template>
      <template slot='mainTitle'>
        充值
      </template>
    </PageTitle>
    <div class="balance" v-if='user.balance'>
      账户余额: <p class="money">{{user.balance}}</p> 元
    </div>
    <div class="selectRecharge">
      <div class="amount">
        <RadioGroup 
          v-model="amount"
          vertical
          >
          <template>
            <Radio
              v-for='(item, index) in ammountList'
              :key='index'
              :label='item'>
              <span>{{item}}</span>
            </Radio>
          </template>
          <Radio label='-1'>
            <span>自定义充值</span>
            <InputNumber 
              v-model="amountSecond" 
              :editable="true"
              :step='1'
              :precision='precision'>
            </InputNumber>
          </Radio>
        </RadioGroup>
      </div>
      <div class="way">
        <RadioGroup v-model="way">
          <Radio label="1">
            <span>支付宝</span>
          </Radio>
          <Radio label="2">
            <span>网银支付</span>
          </Radio>
        </RadioGroup>
      </div>
      <div class="confirm">
        <div class="confirmBtn" @click='confirmRecharge'>
          立即充值
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import http from '../../static/js/http.js'
import {mapGetters} from 'vuex'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      tips: '如使用网银打款，到账时间可能有延迟',
      ammountList: ['500','1000','2000','5000'],
      amount: '500',
      amountSecond: 100,
      way: '1',
      precision: 2
    }
  },
  methods: {
    confirmRecharge() {
      let balance = this.amount>0? this.amount:this.amountSecond
      balance = Number(balance)
      
      if(balance < 100) {
        this.$Message.warning('充值金额需大于等于100')
        return 
      }

      balance = parseFloat(balance.toFixed(2))

      if(this.way == '1') {
        this.aliPay(balance)
      }else if(this.way == '2') {
        this.unionPay(balance)
      }
    },
    getWallet() {
      http.postNormal('/frontend/user_wallet/detail').then((res) => {
        console.log('获取用户账户信息')
        console.log(res)
      })
    },
    unionPay(balance) {
      window.location.href = this.$global.baseURL + '/frontend/user_wallet/recharge?session_id=' + Cookies.get('session') + '&type=2&balance=' + balance
    },
    aliPay(balance) {
      http.postNormal('/frontend/user_wallet/recharge', {
        type: 1,
        balance
      }).then((res) => {
        console.log('发送充值请求')
        console.log(res)
        if(res.data.code == 200) {
          window.location.href = res.data.data
        }
      }).catch((res) => {
        console.log(res)
      })
    }
  }, 
  mounted() {
  },
  components: {
    PageTitle
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
  .balance
    $flex-row-start()
    margin-top 20px
    font-size $font-size-medium
    color $color-dark
    .money 
      margin 0 4px 0 6px
      color $theme-color
  .selectRecharge
    .amount
      margin-bottom 20px
    .way
      margin-bottom 20px
    .confirm
      $flex-row-start()
      .confirmBtn
        padding 6px 10px
        font-size $font-size-small
        color #fff
        background-color $theme-color
        border-radius 4px
        cursor pointer
</style>
