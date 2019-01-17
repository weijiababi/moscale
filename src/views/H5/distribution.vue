<template>
  <transition name="slide">
    <div class="distribution">
      <div class="form">
        <p>请输入您的邀请码进行绑定</p>
        <input v-model="code">
        <div class="confirm" @click="confirmBind">绑定</div>
      </div>
    </div>
  </transition>
</template>

<script>
import http from '../../static/js/http.js'
export default {
  data() {
    return {
      code: ''
    }
  },
  methods: {
    confirmBind() {
      if (!this.$route.query.openid) {
        this.$Message.warning('无法绑定，请重试')
        return
      }
      if (!/^[0-9]{6}$/.test(this.code)) {
        this.$Message.warning('邀请码出错,请检查')
        return
      }

      let params = {
        invitation_code: this.code,
        openid: this.$route.query.openid
      }
      http
        .postNormal('/frontend/vocational_worker/bindVocationalWorker', params)
        .then(res => {
          console.log('绑定邀请码')
          console.log(res)
          if (res.data.code == 200) {
            this.$Message.success('绑定成功')
            window.location.href = res.data.url
          }
        })
    }
  },
  created() {
    console.log(this.$route.query)
  }
}
</script>

<style lang="stylus" scoped>
.distribution
  position relative
  width 100%
  height 100%
  background-color #ff7c21
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s ease-in 0.05s
    opacity 1
  &.slide-enter, &.slide-leave-to
    opacity 0
    transform translate3d(100%, 0, 0)
  .form
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    margin auto
    height 50%
    p
      padding 10px 0
      color #fff
      font-size 16px
      text-align center
    input
      display block
      margin 0 auto
      padding 4px 0
      width 50%
      max-width 200px
      height 32px
      font-size 14px
      text-align center
      border-radius 12px
      border none
    .confirm
      margin 20px auto
      width 40%
      max-width 160px
      height 32px
      line-height 32px
      font-size 16px
      color #000
      background-color #ffd799
      text-align center
      border-radius 12px
</style>
