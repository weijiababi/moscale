<template>
  <div class="login" ref="login">
    <div class="content">
      <div class="sliderWrapper">
        <!--<swiper
          :options="swiperOption" 
          ref="mySwiper"
          :style="{height: '400px'}">
          <swiper-slide>I'm Slide 1</swiper-slide>
          <swiper-slide>I'm Slide 2</swiper-slide>
          <swiper-slide>I'm Slide 3</swiper-slide>
          <swiper-slide>I'm Slide 4</swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>-->
        <img src="../static/image/slide1.jpg">
      </div>
      <!--登录框-->
      <div class="loginWrapper">
        <div class="loginTitle">登陆公锤</div>
        <Input
          prefix="ios-phone-portrait"
          style="marginBottom: 5px"
          v-model.trim="userName"
          placeholder="请输入登陆手机号"
        />
        <Input prefix="ios-lock" type="password" v-model.trim="password" placeholder="请输入登陆密码"/>
        <div class="confirmLogin" @click="login">登陆</div>
        <div class="accountCtrl">
          <div class="resetPwd" @click="jump('/reset')">忘记密码</div>
          <div class="register" @click="jump('/register')">快速注册</div>
        </div>
      </div>

      <div class="logoWrapper">
        <img src="../static/image/logo.png">
      </div>
    </div>
    <div class="exhibition">
      <div
        class="exhibitionItem"
        :class="{reverse: index%2==1}"
        v-for="(item, index) in exhibition"
        :key="index"
      >
        <div class="itemWrapper" :class="{reverse: index%2==1}">
          <div class="imgWrapper">
            <img :src="item.img">
          </div>
          <div class="contentWrapper">
            <div class="mainTitle">{{item.mainTitle}}</div>
            <div class="subTitle">{{item.subTitle}}</div>
            <div class="btnWrapper">
              <div class="btn" @click="toTop">立即体验</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Cookies from 'js-cookie'
import http from '../static/js/http.js'
export default {
  data() {
    return {
      swiperOption: {
        loop: true,
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          disableOnInteraction: false
        }
      },
      userName: '',
      password: '',
      exhibition: [
        {
          img: require('../static/image/exh1.jpg'),
          mainTitle: '实时出价,实时进粉，一个粉丝也可成交',
          subTitle: '1分钟设置完成，实时投放市场，精准引流'
        },
        {
          img: require('../static/image/exh2.jpg'),
          mainTitle: '全国各级城市大量铺设，覆盖面积广，铺设数量多',
          subTitle: '覆盖全国一线二线城市'
        },
        {
          img: require('../static/image/exh3.jpg'),
          mainTitle: '按不同地区，场景，分类，性别，等维度精准投放',
          subTitle: '全自动成交'
        }
      ],
      delay: ''
    }
  },
  methods: {
    jump(path) {
      this.$router.push({ path })
    },
    login() {
      http
        .postNormal('/frontend/user/login', {
          phone: this.userName,
          password: this.password
        })
        .then(res => {
          console.log('登陆成功，获取session')
          console.log(res) / /**登陆成功后**/ Cookies.set('access', '1')
          Cookies.set('session', res.data.data.session_id)
          this.$Message.success('登陆成功')
          let path = decodeURIComponent(window.location.hash).split('=')[1] //获取重定向的path
          if (!path) {
            path = '/index'
          }
          this.$router.push({ path })
        })
        .catch(res => {
          console.log(res)
        })
    },
    toTop() {
      this.delay = setTimeout(() => {
        document.getElementById('app').scrollBy(0, -100)
        this.toTop()
        if (document.getElementById('app').scrollTop <= 0) {
          clearTimeout(this.delay)
        }
      }, 10)
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted() {},
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.$router.push({ name: 'mobileTips' })
    }
  },
  watch: {}
}
</script>

<style scoped lang="stylus">
@import '../static/style/index.styl'
.login
  $flex-column-start()
  background-color #f7f7f7
  .content
    position relative
    width 100%
    .sliderWrapper
      position relative
      width 100%
      img
        width 100%
        height 100%
    .loginWrapper
      position absolute
      top 20%
      right 100px
      padding 20px
      width 300px
      background-color #fff
      border 1px solid #eee
      border-radius 8px
      z-index 2
      .loginTitle
        margin-bottom 10px
        font-size $font-size-medium
        font-weight 700
        color $color-dark
      .confirmLogin
        margin-top 20px
        padding 8px 0
        font-size $font-size-medium
        color #fff
        background-color $theme-color
        text-align center
        border-radius 4px
        cursor pointer
      .accountCtrl
        $flex-row-space()
        margin-top 25px
        .resetPwd, .register
          font-size $font-size-small
          cursor pointer
        .resetPwd
          color $color-light
        .register
          color $theme-color
    .logoWrapper
      position absolute
      top 12%
      left 120px
      width 140px
      height 30px
      img
        width 100%
        height 100%
  .exhibition
    $flex-column-start()
    margin 60px 0
    width 100%
    .exhibitionItem
      $flex-common-center()
      padding 60px 0
      width 100%
      &.reverse
        background-color #fff
      .itemWrapper
        $flex-row-space()
        width 70%
        &.reverse
          flex-direction row-reverse
        .imgWrapper
          margin 0 40px
          width 380px
          $flex-common-center()
          img
            width 100%
        .contentWrapper
          margin 0 60px
          display flex
          flex-direction column
          align-items stretch
          justify-content center
          .mainTitle
            font-size $font-size-large
            font-weight 700
            color $color-dark
          .subTitle
            margin-top 20px
            font-size $font-size-small
            color $color-dark
          .btnWrapper
            margin-top 20px
            .btn
              $flex-common-center()
              width 100px
              height 30px
              font-size $font-size-small
              color #ffffff
              background-color $theme-color
              border-radius 8px
              cursor pointer
</style>
