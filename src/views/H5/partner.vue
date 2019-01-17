<template>
  <div class="partner">
    <div class="top">
      <div class="userData">
        <div class="userInfo">
          <p
            :style="{fontSize: '14px', color: 'rgba(20,20,20,.9)', fontWeight:'500'}"
          >{{partnerData.phone}}</p>
          <p :style="{color: '#d3d2d2'}">
            邀请码
            <span :style="{marginLeft: '7px'}">{{partnerData.code}}</span>
          </p>
        </div>
        <div class="userType">
          <span v-if="partnerData.type === 1">普通合伙人</span>
          <span v-else-if="partnerData.type === 2">银锤合伙人</span>
          <span v-else>金锤合伙人</span>
        </div>
      </div>
      <div class="clientData">
        <div class="clientItem">
          <div class="clientTitle">激活客户/未激活</div>
          <div class="clientContent">
            <div class="num">{{partnerData.valid}}/{{partnerData.unvalid}}</div>
            <div class="unit">个</div>
          </div>
        </div>
        <p class="split"></p>
        <div class="clientItem">
          <div class="clientTitle">客户消费</div>
          <div class="clientContent">
            <div class="num">{{partnerData.consume}}</div>
            <div class="unit">元</div>
          </div>
        </div>
        <div class="bgWrapper">
          <img src="https://img.xiaopiu.com/userImages/img4510116817f78cf0.png">
        </div>
      </div>
      <div class="forward" @click="toForward">
        <div class="left">
          <i class="material-icons">receipt</i>
          提现明细
        </div>
        <div class="right">
          <i class="material-icons">chevron_right</i>
        </div>
      </div>
    </div>
    <div class="content">
      <p class="contentTitle">客户列表</p>
      <div class="scrollWrapper" ref="scroll">
        <div class="clientList">
          <div class="clientItem" v-for="(client, index) in clientList" :key="index">
            <div v-if="client.user">
              <div class="clientLeft">
                <div class="clientInfo">
                  <div class="phone">{{client.user.phone}}</div>
                  <div class="status" v-if="client.is_valid == 1">
                    <span>未激活</span>
                  </div>
                </div>
                <div class="date">{{client.create_time}}</div>
              </div>
              <div class="clientRight">
                消费
                <span :style="{color:' rgba(200,80,80,.9)'}">{{client.consume_amount}}</span>
                元
              </div>
            </div>
          </div>
          <div class="listBottom" v-if="showBottom">
            <i class="material-icons">gavel</i>
            <p>我是有底线的</p>
          </div>
        </div>
        <div v-if="clientList.length==0" :style="{textAlign:'center',marginTop: '10px'}">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import http from '../../static/js/http.js'
import axios from 'axios'
export default {
  data() {
    return {
      partnerData: {
        type: 1,
        clientNum: 0,
        consume: 0,
        phone: 13800000000,
        code: 888888,
        valid: 0,
        unvalid: 0
      },
      page: 1,
      clientList: [],
      showBottom: false
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
      /*
      this.BScroll.on('touchEnd', pos => {
        if (pos.y > 50) {
          this.$Message.success('下拉刷新')
        }
        if (this.BScroll.maxScrollY > pos.y + 10) {
          this.$Message.success('加载更多')
          this.BScroll.refresh()
        }
      })
      */
      this.BScroll.on('pullingDown', () => {
        this.BScroll.finishPullDown()
        this.page = 1
        this.showBottom = false

        this.getData()
        this.$Message.success('刷新成功')
      })
      this.BScroll.on('pullingUp', () => {
        this.BScroll.finishPullUp()

        this.page++
        this.getData()

        if (!this.showBottom) {
          this.$Message.success('加载更多')
        }
      })

      console.log(this.BScroll)
    },
    getData() {
      http
        .postNormal('/frontend/vocational_worker/getUserData', {
          openid: this.$route.query.openid,
          page: this.page
        })
        .then(res => {
          console.log(`获取分销第${this.page}页数据`)
          console.log(res)
          if (res.data.code == 200) {
            this.partnerData = {
              type: res.data.data.type,
              clientNum: res.data.data.total,
              consume: res.data.data.total_price,
              phone: res.data.data.vocational_worker_phone,
              code: res.data.data.invitation_code,
              valid: res.data.data.valid_user,
              unvalid: res.data.data.total - res.data.data.valid_user
            }

            if (
              res.data.data.current_page == res.data.data.last_page &&
              res.data.data.current_page >= 1
            ) {
              this.showBottom = true
            }

            if (this.page == 1) {
              this.clientList = []
            }

            this.page =
              res.data.data.current_page > 0 ? res.data.data.current_page : 1
            let list = [...this.clientList, ...res.data.data.data]
            this.clientList = list

            setTimeout(() => {
              this.BScroll.refresh() //延时刷新，避免高度问题
            }, 200)
          }
        })
    },
    toForward() {
      this.$router.push({
        name: 'forward'
      })
    }
  },
  mounted() {
    this.getData()
    this.$nextTick(() => {
      this._initBScroll()
    })
  },
  created() {}
}
</script>
<style lang="stylus" scoped>
@import '../../static/style/index.styl'
.partner
  position relative
  width 100%
  height 100%
  display flex
  flex-direction column
  font-size 12px
  align-items stretch
  justify-content flex-start
  background-color #eee
  .top
    flex 0 0 200px
    width 100%
    height 200px
    display flex
    flex-direction column
    justify-content flex-start
    background-color #fff
    .userData
      padding 12px 20px
      height 62px
      font-size 12px
      display flex
      flex-direction row
      justify-content flex-start
      align-items flex-start
      .userInfo
        display flex
        flex-direction column
        & > p
          height 20px
          line-height 20px
      .userType
        margin-left 10px
        height 20px
        color #fff
        text-align center
        line-height 20px
        background-color $theme-color
        padding 0px 15px
        border-radius 5px
    .clientData
      position relative
      padding 20px
      height 90px
      display flex
      flex-direction row
      align-items center
      background-color $theme-color
      z-index 10
      .clientItem
        flex 1
        height 60px
        display flex
        flex-direction column
        justify-content space-between
        align-items center
        .clientTitle
          color #fff
          font-size 14px
        .clientContent
          color #f8fe01
          font-size 18px
          display flex
          flex-direction row
          align-items center
          .num
            40px
          .unit
            margin-left 10px
      .split
        width 1px
        height 40px
        background-color #fff
      .bgWrapper
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        z-index -1
        img
          width 100%
          height 90px
    .forward
      padding 12px 20px
      height 48px
      font-size 12px
      color rgba(20, 20, 20, 0.9)
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      cursor pointer
      .left
        height 20px
        display flex
        flex-direction row
        align-items center
        & > i
          font-size 16px
          margin-right 10px
      .right
        height 20px
        & > i
          font-size 20px
  .content
    flex 1
    position relative
    margin 0
    .contentTitle
      margin 7px 20px
      font-size 12px
      color #d3d2d2
    .scrollWrapper
      position absolute
      top 35px
      bottom 0
      width 100%
      overflow hidden
      background-color #fff
      .clientList
        width 100%
        .clientItem
          & > div
            display flex
            flex-direction row
            justify-content space-between
            align-items center
            padding 12px 20px
            font-size 12px
            color rgba(20, 20, 20, 0.9)
            border-bottom 2px solid #eee
            .clientLeft
              display flex
              flex-direction column
              align-items flex-start
              justify-content center
              .clientInfo
                display flex
                flex-direction row
                align-items center
                .phone
                  font-size 14px
                .status
                  margin-left 10px
                  padding 2px 8px
                  color #fff
                  background-color rgb(200, 200, 200)
                  border-radius 12px
              .date
                margin-top 4px
                color #d8d7d7
      .listBottom
        padding 7px 0
        color #d3d2d2
        display flex
        flex-direction column
        align-items center
        justify-content center
        & > p
          margin-top 4px
</style>

