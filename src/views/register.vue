<template>
  <div class="register">
    <div class="navWrapper">
      <Nav/>
    </div>
    <div class="title">快速注册</div>
    <div class="content">
      <div class="contentItem">
        <div class="itemTitle">手机号</div>
        <div class="itemContent">
          <Input prefix="ios-phone-portrait" placeholder="输入您的手机号" v-model="regData.phone"/>
        </div>
      </div>
      <div class="contentItem">
        <div class="itemTitle">登陆密码</div>
        <div class="itemContent">
          <Input
            v-model="regData.password"
            placeholder="输入您的登陆密码"
            type="password"
            style="text-align: center"
          />
        </div>
      </div>
      <div class="contentItem">
        <div class="itemTitle">邀请码</div>
        <div class="itemContent">
          <Input
            v-model="regData.invitation_code"
            placeholder="输入您的邀请码"
            style="text-align: center"
          />
        </div>
      </div>
      <div class="contentItem">
        <div class="itemTitle">验证码</div>
        <div class="itemContent">
          <Input v-model="regData.code" placeholder="验证码" style="width: 100px"/>
          <Button
            type="primary"
            @click="sendCode"
            :style="'width:90px'"
            :disabled="locking"
          >{{send}}</Button>
        </div>
      </div>
      <div class="contentItem">
        <div class="itemTitle"></div>
        <div class="itemContent">
          <div class="confirmBtn" @click="confirmReg">注册</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '../components/nav/nav.vue'
import { isPoneAvailable, checkLength } from '../static/js/validate.js'
import http from '../static/js/http.js'
export default {
  data() {
    return {
      regData: {
        phone: '',
        password: '',
        invitation_code: '',
        code: ''
      },
      locking: false,
      sec: 60,
      interval: ''
    }
  },
  methods: {
    sendCode() {
      if (
        isPoneAvailable(this.regData.phone) &&
        checkLength(this.regData.password, 6, 15)
      ) {
        this.locking = true
        http
          .post('/frontend/sms/send', {
            phoneNumber: this.regData.phone,
            type: 1
          })
          .then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.$Message.info('短信已发送')
            }
          })
        this.interval = setInterval(() => {
          this.sec--
        }, 1000)
      } else if (!isPoneAvailable(this.regData.phone)) {
        this.$Message.error('请输入正确的手机号')
        return
      } else if (!checkLength(this.regData.password, 6, 15)) {
        this.$Message.error('请输入6-15位长度的密码')
        return
      }
    },
    confirmReg() {
      if (
        isPoneAvailable(this.regData.phone) &&
        checkLength(this.regData.password, 6, 15) &&
        checkLength(this.regData.code, 6, 6) &&
        checkLength(this.regData.invitation_code, 6, 6)
      ) {
        console.log(this.regData)
        http
          .postLoading('/frontend/user/register', this.regData)
          .then(res => {
            console.log(res)
            this.$Message.success('注册成功')
            setTimeout(() => {
              this.$router.push({ path: '/login' })
            }, 500)
          })
          .catch(res => {
            console.log(res)
            if (res.code == 500) {
              this.regData = {
                phone: '',
                password: '',
                code: ''
              }
            }
          })
      } else {
        this.$Message.error('请重新检查注册信息')
      }
    }
  },
  computed: {
    send() {
      return this.locking ? this.sec + 's' : '发送验证码'
    }
  },
  watch: {
    sec(val) {
      if (val == 0) {
        clearInterval(this.interval)
        this.locking = false
        this.sec = 60
      }
    }
  },
  components: {
    Nav
  },
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.$router.push({ name: 'mobileRegister' })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../static/style/index.styl'
.title
  margin 0 60px
  padding 24px 0
  font-size $font-size-large
  color $color-dark
  border-bottom 1px solid rgba(200, 200, 200, 0.3)
.content
  margin-top 60px
  display flex
  flex-direction column
  align-items center
  justify-content flex-start
  .contentItem
    $flex-row-center()
    margin-bottom 6px
    &.contentItem:last-child
      margin 20px 0 0
    .itemTitle
      margin-right 16px
      width 100px
      height 36px
      line-height 36px
      text-align right
    .itemContent
      $flex-row-space()
      width 200px
      .confirmBtn
        padding 8px 0
        width 200px
        text-align center
        color #fff
        background-color $theme-color
        border-radius 4px
        cursor pointer
</style>