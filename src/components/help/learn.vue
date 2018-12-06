<template>
  <div class="learn">
    <div class="articleListWrapper">
      <articleList 
        :articles = 'articles'
        :path = 'path'>
        <template slot='mainTitle'>
          学习专区
        </template>
      </articleList>
    </div>
    <div class="learnContent">
      <PageTitle>
        <template slot='mainPath'>
          帮助
        </template>
        <template slot='path'>学习专区</template>
      </PageTitle>
      <router-view />
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
      path: '/help/learn/'
    }
  },
  methods: {
    getArticles() {
      http.postNormal('/frontend/article/finds',{
        category: 2,
        per_page: 30
      }).then((res) => {
        console.log('获取文章列表')
        console.log(res)
        if(res.data.code == 200){
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
.learn
  height 100%
  display flex
  flex-direction row
  justify-content flex-start
  align-items stretch
  .articleListWrapper
    position relative
    flex 0 0 200px
    width 200px
  .learnContent
    flex 1
    $flex-column-start()
    margin 12px 20px
</style>