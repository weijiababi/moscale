<template>
  <div class="pageTitle">
    <div class="path">
      <slot name='mainPath'></slot>
      <Icon type="ios-arrow-forward" />
      <p>
        <slot name="path"></slot>
      </p>
    </div>
    <div class="mainTitle">
      <slot name='mainTitle'></slot>
    </div>
    <div class="tips" v-if='tips'>
      {{tips}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tips: {
      type: String
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.pageTitle
  $flex-column-start
  .path
    $flex-row-start()
    margin-bottom  20px
    font-size $font-size-small
    color $color-light
    p
      margin-left 4px
      color $color-dark
  .mainTitle
    margin-bottom 20px
    font-size $font-size-large
    color $color-dark
  .tips
    padding 8px
    font-size $font-size-small
    background-color rgba(200,200,200,.3)
    border-radius 4px
</style>
