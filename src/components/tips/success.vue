<template>
  <div class="success">
    <div class="content">
      <div class="logoWrapper">
        <img src="../../static/image/authSuccess.png">
      </div>
      <span class="mainTitle">扫码授权成功</span>
      <div class="subTitle"></div>
      <div class="returnBtn" @click="back">返回</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: '',
      urlList: {
        '1': 'https://moscales.7wenyi.com/backend/#/account/list',
        '2': 'https://moscales.7wenyi.com/#/wechat/index',
        '3': 'https://www.goco123.com/#/extend/officeAccount'
      }
    }
  },
  methods: {
    back() {
      window.location.href = this.urlList[this.$route.query.type]
    }
  },
  mounted() {}
}
</script>

<style lang="stylus" scoped>
@import '../../static/style/index.styl'
.success
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  margin auto
  $flex-common-center()
  .content
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    .logoWrapper
      width 100px
      height 100px
      overflow hidden
      img
        width 100%
    .mainTitle
      margin-top 50px
      font-size 24px
      color #28a009
      letter-spacing 10px
    .subTitle
      margin-top 50px
    .returnBtn
      padding 6px 60px
      font-size 18px
      letter-spacing 6px
      color #fff
      background-color $theme-color
      border-radius 20px
      cursor pointer
</style>
