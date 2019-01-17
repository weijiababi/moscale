<template>
  <div class="cardTitle">
    <i class="material-icons" v-if="icon">{{icon}}</i>
    <div class="mainTitle">
      <slot name="mainTitle"></slot>
    </div>
    <p class="subTitle">
      <slot name="subTitle"></slot>
    </p>
    <p class="link" v-if="link" @click="jumpLink">更多
      <Icon type="ios-arrow-forward"/>
    </p>
  </div>
</template>

<script>
import eventBus from '../../bus.js'
export default {
  props: {
    icon: {
      type: String
    },
    link: {
      type: String
    }
  },
  methods: {
    jumpLink() {
      eventBus.$emit('changeActive', this.link)
      this.$router.push({ path: this.link })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.cardTitle
  position relative
  margin 0 20px
  padding 12px 0
  font-size $font-size-medium
  color rgba(154, 154, 154, 1)
  border-bottom 1px solid rgba(200, 200, 200, 0.3)
  display flex
  flex-direction row
  align-items center
  justify-content flex-start
  .mainTitle
    margin-left 12px
    font-size $font-size-medium
    display flex
    flex-direction row
    align-items center
  .subTitle
    flex 1
    margin-left 8px
    font-size $font-size-small
  .link
    font-size $font-size-small
    cursor pointer
    &.link:hover
      color rgba(0, 135, 255, 0.9)
</style>
