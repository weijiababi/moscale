<template>
  <div class="currentQus">
    <div class="articleListWrapper">
      <articleList :articles="articles" :path="path">
        <template slot="mainTitle">常见问题</template>
      </articleList>
    </div>
    <div class="currentQusContent">
      <PageTitle>
        <template slot="mainPath">帮助</template>
        <template slot="path">常见问题</template>
      </PageTitle>
      <router-view/>
    </div>
  </div>
</template>

<script>
import articleList from '../articleList/articleList.vue'
import PageTitle from '../pageTitle/pageTitle.vue'
import http from '../../static/js/http.js'
export default {
  data() {
    return {
      articles: [],
      path: '/help/currentQus/'
    }
  },
  methods: {
    getArticles() {
      http
        .postNormal('/frontend/article/finds', {
          category: 3,
          per_page: 30
        })
        .then(res => {
          console.log('获取文章列表')
          console.log(res)
          if (res.data.code == 200) {
            this.articles = res.data.data.data
          }
        })
    }
  },
  components: {
    articleList,
    PageTitle
  },
  mounted() {
    this.getArticles()
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.currentQus
  height 100%
  display flex
  flex-direction row
  justify-content flex-start
  align-items stretch
  padding 20px 0
  border-radius 6px
  .articleListWrapper
    position relative
    flex 0 0 200px
    width 200px
  .currentQusContent
    flex 1
    $flex-column-start()
    margin-left 20px
    padding 12px 20px
    border 1px solid rgba(200, 200, 200, 0.3)
    overflow-y auto
</style>