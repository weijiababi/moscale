<template>
  <div class="forward">
    <div class="title">提现记录</div>
    <div class="scrollWrapper" ref="scroll">
      <div class="forwardList">
        <div class="forwardItem" v-for="(item, index) in forwardList" :key="index">
          <div class="left">
            <div class="date">{{item.create_time}}</div>
            <div class="account">支付账号: {{item.account}}</div>
          </div>
          <div class="right">
            收益
            <span
              :style="{color:'rgba(200,80,80,.9)',margin: '0 4px',fontSize:'14px'}"
            >{{item.money}}</span>元
          </div>
        </div>
      </div>
      <div class="listBottom" v-if="showBottom">
        <i class="material-icons">gavel</i>
        <p>我是有底线的</p>
      </div>
      <div v-if="forwardList.length==0" :style="{textAlign:'center',marginTop: '10px'}">暂无数据</div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      page: 1,
      showBottom: true,
      forwardList: [
        { create_time: '2018-10-10', money: 20, account: 6221000000000000 }
      ]
    }
  },
  methods: {
    _initBScroll() {
      this.BScroll = new BScroll(this.$refs.scroll, {
        click: true,
        probeType: 3,
        mouseWheel: {
          // pc端同样能滑动
          speed: 20,
          invert: false
        },
        pullUpLoad: {
          threshold: -50
        },
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        }
      })
      this.BScroll.on('pullingDown', () => {
        this.BScroll.finishPullDown()
        this.page = 1

        this.getData()
        this.$Message.success('刷新成功')
      })
      this.BScroll.on('pullingUp', () => {
        this.BScroll.finishPullUp()

        this.page++
        this.getData()
        this.$Message.success('加载更多')
      })

      console.log(this.BScroll)
    }
  },
  mounted() {
    this._initBScroll()
  }
}
</script>
<style lang="stylus" scoped>
@import '../../static/style/index.styl'
.forward
  position relative
  font-size 12px
  color rgba(20, 20, 20, 0.9)
  background-color #eee
  .title
    margin 0 20px
    height 40px
    line-height 40px
  .scrollWrapper
    position fixed
    top 40px
    left 0
    right 0
    bottom 0
    overflow hidden
    .forwardList
      width 100%
      .forwardItem
        display flex
        flex-direction row
        justify-content space-between
        align-items flex-start
        padding 12px 20px
        font-size 12px
        color rgba(20, 20, 20, 0.9)
        border-bottom 2px solid #eee
        .left
          display flex
          flex-direction column
          justify-content flex-start
          align-items flex-start
          .date
            font-size 14px
          .account
            margin-top 4px
            font-size 12px
            color #d3d2d2
        .right
          font-size 12px
          color #d3d2d2
    .listBottom
      margin-top 20px
      color #d3d2d2
      display flex
      flex-direction column
      align-items center
      justify-content center
      & > p
        margin-top 4px
</style>

