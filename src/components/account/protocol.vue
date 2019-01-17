<template>
  <div class="protocol">
    <PageTitle>
      <template slot="mainPath">账户</template>
      <template slot="path">服务协议</template>
      <template slot="mainTitle">服务协议</template>
    </PageTitle>
    <div class="article" v-html="content"></div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import http from '../../static/js/http.js'
export default {
  data() {
    return {
      content: ''
    }
  },
  components: {
    PageTitle
  },
  methods: {
    getArticle() {
      http
        .postNormal('/frontend/article/detail', {
          key: 'server_protocol'
        })
        .then(res => {
          if (res.status == 200) return res.data
        })
        .then(res => {
          if (res.code == 200) {
            this.content = res.data.content
          }
        })
    }
  },
  mounted() {
    this.getArticle()
  }
}
</script>

<style scoped lang="stylus">
</style>
