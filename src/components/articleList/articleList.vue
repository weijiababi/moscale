<template>
  <div class="articleList">
    <div class="mainTitle">
      <slot name="mainTitle"></slot>
    </div>
    <div class="list">
      <div
        class="article"
        v-for="(article, index) in articles"
        :key="index"
        @click="jump(article)"
      >{{article.title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    articles: {
      type: Array
    },
    path: {
      type: String
    },
    height: {
      type: String
    }
  },
  methods: {
    jump(article) {
      this.$router.push({
        path: this.path + article.article_id
      })
    }
  },
  mounted() {}
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.articleList
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  $flex-column-start()
  background-color rgba(200, 200, 200, 0.3)
  .mainTitle
    margin 0 24px
    padding 12px 0
    font-size $font-size-large
    color $color-dark
    text-align center
    box-sizing border-box
    border-bottom 1px solid rgba(200, 200, 200, 0.3)
  .list
    flex-column-start()
    margin 32px 20px 0
    .article
      margin-bottom 12px
      font-size $font-size-small
      color $color-light
      cursor pointer
      letter-spacing 0.4px
      &.article:hover
        color rgba(60, 60, 150, 0.9)
</style>