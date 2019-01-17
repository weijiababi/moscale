<template>
  <transition name="slide">
    <div class="mobileTips">
      <div class="imgWrapper">
        <img src="../../static/image/mobile/mobileTip.jpg">
      </div>
    </div>
  </transition>
</template>

<script>
export default {}
</script>

<style scoped lang="stylus">
.mobileTips
  position relative
  width 100%
  height 100%
  font-family 'Microsoft YaHei'
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  overflow hidden
  background-color #ff7c21
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s linear 0.05s
    opacity 1
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
    opacity 0
  .imgWrapper
    margin 0 auto
    width 100%
    max-width 375px
    img
      width 100%
</style>
