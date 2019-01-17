<template>
  <div class="home" ref="home" :style="{height: windowHeight}">
    <div class="title">注册</div>
    <div class="logo">
      <img src="../../static/image/mobile/logo.png">
    </div>
    <div class="form">
      <div class="formItem">
        <div class="inputLogo">
          <img src="../../static/image/mobile/avatar.png">
        </div>
        <div class="inputArea">
          <input v-model="phone" placeholder="请输入手机号码">
        </div>
      </div>
      <div class="formItem">
        <div class="inputLogo">
          <img src="../../static/image/mobile/code.png">
        </div>
        <div class="inputArea">
          <input v-model="code" placeholder="请输入验证码">
        </div>
        <div class="sendCode" @click="reqSendCode">{{msg}}</div>
      </div>
      <div class="formItem">
        <div class="inputLogo">
          <img src="../../static/image/mobile/pwd.png">
        </div>
        <div class="inputArea">
          <input v-model="password" type="password" placeholder="请设置密码">
        </div>
      </div>
      <div class="formItem">
        <div class="inputLogo">
          <img src="../../static/image/mobile/walk.png">
        </div>
        <div class="inputArea">
          <input v-model="invitation_code" placeholder="请输入邀请码">
        </div>
      </div>
    </div>
    <div class="confirmBtn" @click="register">注册</div>
  </div>
</template>

<script>
import http from '../../static/js/http.js'
import Cookie from 'js-cookie'
export default {
  name: 'home',
  data() {
    return {
      phone: '',
      code: '',
      password: '',
      invitation_code: '',
      time: 60,
      windowHeight: '100%'
    }
  },
  methods: {
    sendCode() {
      if (this.time <= 0) {
        clearTimeout(this.timeout)
        this.time = 60
      } else {
        this.time--
        this.timeout = setTimeout(() => {
          this.sendCode()
        }, 1000)
      }
    },
    reqSendCode() {
      if (this.time < 60) {
        return
      }

      let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!reg.test(this.phone)) {
        this.$Message.error('请输入正确的手机号')
        return
      }

      http
        .postNormal('/frontend/sms/send', {
          phoneNumber: this.phone,
          type: 1
        })
        .then(res => {
          console.log('发送注册')
          console.log(res)
          if (res.data.code == 200) {
            this.sendCode()
            this.$Message.success('验证码已发送')
          }
        })
    },
    register() {
      let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!reg.test(this.phone)) {
        this.$Message.info('请输入正确的手机号')
        return
      }

      if (this.code.split('').length != 6) {
        this.$Message.info('请输入正确的验证码')
        return
      }

      if (this.password.split('').length < 6) {
        this.$Message.info('请输入6位及以上的密码')
        return
      }

      if (this.invitation_code.split('').length != 6) {
        this.$Message.info('请输入6位邀请码')
        return
      }

      let formData = {
        code: this.code,
        phone: this.phone,
        password: this.password,
        invitation_code: this.invitation_code,
        vocational_worker_id: this.$route.query.vocationalWorkerId,
        openid: this.$route.query.openid
      }

      http
        .postNormal('/frontend/user/register', formData)
        .then(res => {
          console.log('请求注册')
          console.log(res)
          if (res.data.code == 200) {
            this.$Message.success('注册成功')
            Cookie.set('success', '1')

            setTimeout(() => {
              this.$router.push({ name: 'success' })
            }, 500)
          }
        })
        .catch(res => {
          console.log(res)
          this.code = ''
          this.phone = ''
          this.password = ''
        })
    }
  },

  computed: {
    msg() {
      return this.time == 60 ? '获取验证码' : this.time + 's'
    }
  },
  components: {},

  created() {
    if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.$router.push({ name: 'register' })
    }
  },

  mounted() {
    console.log(this.$route.query)
    this.windowHeight = this.$refs.home.offsetHeight + 'px'
    console.log(this.$refs.home.offsetHeight + 'px')
  }
}
</script>
<style lang="stylus">
.home
  position relative
  width 100%
  height 100%
  font-family 'Microsoft YaHei'
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  overflow hidden
  background-image url('../../static/image/mobile/bg.png')
  .bg
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index -1
    img
      width 100%
      height 100%
  .title
    margin 0 10px
    padding 10px 0
    font-size 16px
    color #fff
    text-align center
    border-bottom 1px solid rgba(255, 255, 255, 0.9)
  .logo
    margin 42px auto 35px
    width 30%
    max-width 250px
    img
      width 100%
      height 100%
  .form
    margin 0 auto
    width 280px
    .formItem
      display flex
      flex-direction row
      justify-content flex-start
      align-items center
      padding 8px 3px 7px
      width 100%
      border-bottom 1px solid rgba(255, 255, 255, 0.9)
      .inputLogo
        flex 0 0 24px
        width 24px
        img
          width 100%
      .inputArea
        flex 0 1 auto
        margin-left 18px
        max-width 140px
        input
          padding 0 4px
          font-size 16px
          color #fff
          background-color transparent
          border none
          outline none
        input::-webkit-input-placeholder
          color #fff
      .sendCode
        padding-left 10px
        width 100px
        color #fff
        text-align center
        border-left 1px solid #fff
  .confirmBtn
    margin 40px auto 0
    width 280px
    height 39px
    line-height 39px
    text-align center
    font-size 18px
    color #fff
    background-color #fe2929
    border-radius 16px
</style>
