<template>
  <div class="introduce">
    <div class="imgWrapper" v-for="item in 9" :key="item">
      <img :src="require(`../../static/image/introduce/0_0${item}.jpg`)">
    </div>
    <div class="imgWrapper" v-for="(item, index) in 6" :key="item+10">
      <img :src="require(`../../static/image/introduce/0_1${index}.jpg`)">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.introduce
  position relative
  width 100%
  &.introduce::-webkit-scrollbar
    width 0px
  .imgWrapper
    width 100%
    font-size 0
    img
      width 100%
</style>


