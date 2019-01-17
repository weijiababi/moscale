<template>
  <div class="nav">
    <div class="logoWrapper">
      <img src="../../static/image/logo.png">
    </div>
    <div class="topNav">
      <div class="navList">
        <div
          class="navItem"
          v-for="(item, index) in navList"
          :key="index"
          :class="{active: index === activeIndex}"
          @click="jump(item.path, index)"
        >{{item.name}}</div>
      </div>
    </div>

    <div class="user" v-if="user.user">
      <div class="userName">
        <Dropdown placement="bottom-start" @on-click="clickMenu">
          <a href="javascript:void(0)" :style="{color: '#fff'}">
            {{user.user.phone}}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="logout">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Badge>
        <Avatar :src="logo"/>
      </Badge>
      <div class="login"></div>
    </div>
  </div>
</template>

<script>
import eventBus from '../../bus.js'
import Cookies from 'js-cookie'
import http from '../../static/js/http.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      navList: [
        { name: '首页', path: '/index' },
        { name: '计划', path: '/extend/addProject' },
        { name: '报表', path: '/chart/currentChart' },
        { name: '账户', path: '/account/recharge' },
        { name: '帮助', path: '/help/learn' }
      ],
      activeIndex: 0,
      logo: require('../../static/image/logo.jpg')
    }
  },
  methods: {
    jump(path, index) {
      // this.navList = this.navList.map((el, order) => {
      //   return order === index? {...el,active: 1} : {...el,active: 0}
      // })
      eventBus.$emit('changeActive', path)
      this.activeIndex = index
      this.$router.push({ path: path })
    },
    clickMenu(name) {
      switch (name) {
        case 'userInfo':
          console.log(name)
          break
        case 'logout':
          http.postLoading('/frontend/user/logout').then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.$Message.info('退出成功')
            }
          })

          Cookies.remove('access')
          Cookies.remove('session')
          this.setUser({})
          this.$router.push({ path: '/login' })
      }
    },
    ...mapMutations({
      setUser: 'SET_USER'
    })
  },
  created() {
    eventBus.$on('changeNav', val => {
      this.activeIndex = val
    })
  },
  computed: {
    ...mapGetters(['user'])
  },
  beforeDestory() {
    eventBus.$off('changeNav')
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.nav
  flex 0 0 48px
  width 100%
  height 48px
  $flex-row-start()
  background-color #f98400
  .logoWrapper
    flex 0 0 180px
    width 180px
    $flex-common-center()
    img
      width 120px
      height 30px
  .topNav
    flex 1
    .navList
      $flex-row-start()
      .navItem
        margin-right 36px
        padding 12px
        font-size $font-size-medium
        font-weight 500
        color rgba(240, 240, 240, 0.8)
        cursor pointer
        &.navItem:last-child
          margin-right 0
        &.active
          color #fff
  .user
    flex 0 0 250px
    width 250px
    $flex-row-center()
    .userName
      margin-right 12px
      font-size $font-size-medium
      color #fff
</style>
