<template>
  <div class="article" v-html="content"></div>
</template>

<script>
import http from '../../static/js/http.js'
export default {
  data() {
    return {
      content: '暂无内容'
    }
  },
  methods: {
    getContent() {
      http
        .postNormal('/frontend/article/detail', {
          article_id: this.$route.params.id
        })
        .then(res => {
          console.log(`获取id为${this.$route.params.id}的文章详情`)
          console.log(res)
          if (res.data.code == 200) {
            this.content = res.data.data.content
          }
        })
    }
  },
  mounted() {
    this.getContent()
  },
  watch: {
    $route(to, from) {
      this.getContent()
    }
  }
}
</script>

<style scoped lang="stylus">
</style>