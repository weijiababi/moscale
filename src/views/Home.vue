<template>
  <div class="home">
		<Nav />
    <div class="main">
      <Layout
        :style="{backgroundColor: '#f1f1f1', width: '100%'}">
        <Sider 
          ref='side'
          collapsible
          width='160'
          :collapsed-width="0"
          v-model="isCollapsed"
          :style="{zIndex: 998}">
          <Slide :isCollapsed='isCollapsed'/>
        </Sider>
        <Content
          :style="{padding: '12px 20px',backgroundColor: '#fff', overflowX: 'hidden', overflowY: 'auto'}">
          <keep-alive>
            <router-view />
          </keep-alive>
        </Content>
      </Layout>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '../components/nav/nav.vue'
import Slide from '../components/slide/slide.vue'
import {mapGetters, mapMutations} from 'vuex'
import http from '../static/js/http.js'
export default {
  name: 'home',
  data() {
    return {
      isCollapsed: false //default-collapsed
    }
  },
  methods: {
    getUser() {
      http.postNormal('/frontend/user_wallet/detail').then((res) => {
        console.log('获取用户个人信息')
        console.log(res)
        if(res.data.code == 200) {
          this.setUser(res.data.data)
        }
      })
    },
    ...mapMutations({
      setUser: 'SET_USER'
    })
  },
  created() {
    console.log('配置文件中的全局数据')
    console.log(this.$global)
    this.getUser()
  },
  computed: {
    ...mapGetters([
      'login',
      'user'
    ])
  },
  components:{
    Nav,
    Slide
  }
}
</script>

<style scoped lang='stylus'>
@import '../static/style/index.styl'

.home
  width 100%
  height 100%
  $flex-column-start()
  .main 
    flex 1
    width 100%
    display flex
    align-items stretch
</style>
