<template>
  <div class="success" :style="{height: windowHeight}" ref="success">
    <div class="logo">
      <img src="../../static/image/mobile/successlogo.png">
    </div>
    <div class="title">成功领券</div>
    <div class="arrow">
      <img src="../../static/image/mobile/arrow.png">
    </div>
    <p class="tips">请您到电脑端操作使用</p>
    <p class="tips red">www.goco123.com</p>
    <div class="arrow">
      <img src="../../static/image/mobile/arrow.png">
    </div>
    <button class="copyBtn" data-clipboard-text="www.goco123.com" onclick=''>点击复制网址</button>
  </div>
</template>

<script>
import http from '../../static/js/http.js'
import Cookie from 'js-cookie'
import ClipboardJS from 'clipboard'
export default {
  data() {
    return {
      windowHeight: '100%'
    }
  },
  mounted() {
    if (Cookie.get('success') != 1) {
      this.$router.go(-1)
    }
    
    this.$nextTick(() => {
      this._initClip()
    })

    this.windowHeight = this.$refs.home.success + 'px'
    console.log(this.$refs.home.success + 'px')
  },
  methods: {
    _initClip() {
      this.clipboard = new ClipboardJS('.copyBtn')
      this.clipboard.on('success', () => {
        this.$Message.success('复制成功')
      })
      this.clipboard.on('error', () => {
        this.$Message.success('复制成功')
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.success
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  font-family 'Microsoft YaHei'
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  overflow hidden
  .logo
    margin 50px auto 0
    width 35%
    max-width 250px
    img
      width 100%
  .title
    margin 0 auto
    width 40%
    max-width 250px
    text-align center
    font-size 36px
    color rgba(200, 80, 80, 0.99)
  .arrow
    margin 10px auto
    width 15px
    img
      width 100%
  .tips
    font-size 20px
    text-align center
    &.red
      color rgba(200, 80, 80, 0.99)
  .copyBtn
    display block
    margin 0 auto
    padding 10px 32px
    width 50%
    max-width 300px
    font-size 20px
    color #fff
    background-color #f99506
    text-align center
    border-radius 32px
    border none
    box-shadow none
</style>