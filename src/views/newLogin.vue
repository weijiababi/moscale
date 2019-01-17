<template>
  <div class="login" ref="wrapper">
    <div class="content">
      <!--顶部导航-->
      <div class="nav" ref="nav">
        <div class="navWrapper">
          <div class="logoWrapper">
            <img src="../static/image/logo.jpg" alt>
          </div>
          <div class="navContent">
            <div v-for="(nav, index) in navList" :key="index" class="navItem">{{nav.title}}</div>
          </div>
          <div class="navBtn">
            <div class="loginBtn">登陆</div>
            <div class="registerBtn">注册</div>
          </div>
        </div>
      </div>
      <!--首页动效-->
      <div class="main">
        <div class="mainWrapper">
          <div class="mainContentTop">
            <h1>新媒体营销增长引擎</h1>
            <p>致力于新媒体粉丝增长，低成本解决营销难题，通过任务宝、分享宝、消息宝等营销工具突破公众号限制，实现粉丝有效运营。</p>
            <div>马上注册</div>
          </div>
          <div class="mainContentBottom">
            <h1>媒想到，就是这么有效</h1>
            <div class="effectList">
              <div class="effect">
                <div>
                  <img src="../static/image/effect_1.png" alt>
                </div>
                <h2>低成本营销，带来粉丝裂变增长</h2>
              </div>
              <div class="effect">
                <div>
                  <img src="../static/image/effect_2.png" alt>
                </div>
                <h2>突破公众号限制，实现精细化运营</h2>
              </div>
              <div class="effect">
                <div>
                  <img src="../static/image/effect_3.png" alt>
                </div>
                <h2>CRM式关系管理，沉淀用户数据</h2>
              </div>
              <div class="effect">
                <div>
                  <img src="../static/image/effect_4.png" alt>
                </div>
                <h2>解放小编双手，告别重复操作</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="tranWrapper">
          <img src="../static/image/pic.png" alt>
        </div>
      </div>
      <!--产品介绍-->
      <div class="introduce">
        <div class="introduceWrapper">
          <h1>产品介绍</h1>
          <h2>致力于增长，只为更有效营销</h2>
          <div class="introItem">
            <div class="introLogo">
              <img src="../static/image/pro_1.png" alt>
            </div>
            <div class="content">
              <h1>任务宝</h1>
              <h2>一张海报让你轻松涨粉10万</h2>
              <p>设置简单，1分钟创建涨粉活动</p>
              <p>数据统计，粉丝增长情况一目了然</p>
              <p>A/B测试，各环节数据对比明显</p>
            </div>
          </div>
          <div class="introItem">
            <div class="introLogo">
              <img src="../static/image/pro_2.png" alt>
            </div>
            <div class="content"></div>
          </div>
          <div class="introItem">
            <div class="introLogo">
              <img src="../static/image/pro_3.png" alt>
            </div>
            <div class="content"></div>
          </div>
          <div class="introItem">
            <div class="introLogo">
              <img src="../static/image/pro_4.png" alt>
            </div>
            <div class="content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navList: [
        { title: '首页', link: '' },
        { title: '产品介绍', link: '' },
        { title: '产品特点', link: '' },
        { title: '合作伙伴', link: '' },
        { title: '联系我们', link: '' }
      ],
      currentTop: 0
    }
  },
  methods: {},
  mounted() {
    this.$refs.wrapper.addEventListener('scroll', () => {
      this.currentTop = Number(this.$refs.wrapper.scrollTop.toFixed(2))
      console.log(this.currentTop)
    })
  },
  watch: {
    currentTop(val) {
      if (val > 5) {
        this.$refs.nav.className = 'nav active'
      } else {
        this.$refs.nav.className = 'nav'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@keyframes move
  from
    transform translateX(200px)
  to
    transform translateX(0)
@import '../static/style/index.styl'
.login
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  margin auto
  overflow-x auto
  overflow-y auto
  .content
    position relative
    width 100%
    min-width 860px
    font-size 14px
    color #909298
    .nav
      position fixed
      top 0
      left 0
      right 0
      z-index 1000
      background-color #fff
      transition all 0.5s ease 0.1s
      &.active
        box-shadow 0 5px 30px 3px rgba(100, 100, 100, 0.06)
      .navWrapper
        margin 0 auto
        padding 15px 0
        max-width 1100px
        min-width 860px
        height 70px
        display flex
        flex-direction row
        align-items center
        .logoWrapper
          width 200px
          height 40px
          img
            height 40px
        .navContent
          flex 1
          height 40px
          display flex
          flex-direction row
          justify-content flex-start
          align-items center
          .navItem
            padding 0 20px
            font-size 14px
            color #909298
            cursor pointer
            &:hover
              color $theme-color
        .navBtn
          width 180px
          height 40px
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          & > div
            width 80px
            height 40px
            font-size 14px
            line-height 40px
            text-align center
            border-radius 5px
            cursor pointer
            transition 0.5s
          & > div:hover
            box-shadow 0 0 20px 5px rgba(255, 125, 33, 0.3)
          .loginBtn
            color $theme-color
            background-color #fff
            border 1px solid $theme-color
          .registerBtn
            color #fff
            background linear-gradient(to right, #ffaf63 0%, #ff7d21 100%)
    .main
      width 100%
      padding-top 70px
      position relative
      .mainWrapper
        margin 0 auto
        max-width 1100px
        min-width 860px
        height 1300px
        display flex
        flex-direction column
        justify-content space-between
        z-index 1
        .mainContentTop
          margin-top 200px
          display flex
          flex-direction column
          align-items flex-start
          & > h1
            color rgba(20, 20, 20, 0.9)
          & > p
            margin-top 40px
            font-size 14px
            width 400px
          & > div
            margin-top 40px
            width 200px
            height 40px
            font-size 14px
            color #fff
            background linear-gradient(to right, #ffaf63 0%, #ff7d21 100%)
            line-height 40px
            text-align center
            border-radius 5px
            cursor pointer
            transition 0.5s
            &:hover
              box-shadow 0 0 20px 5px rgba(255, 125, 33, 0.3)
        .mainContentBottom
          display flex
          flex-direction column
          justify-content flex-start
          align-items center
          & > h1
            margin 40px 0
            width 100%
            text-align center
            color rgba(20, 20, 20, 0.9)
          .effectList
            width 100%
            display flex
            flex-direction row
            justify-content space-around
            align-items center
            flex-wrap wrap
            .effect
              width 45%
              display flex
              flex-direction column
              justify-content center
              align-items center
              height 200px
              & > div
                width 80px
                height 80px
                & > img
                  width 100%
              & > h2
                margin-top 20px
                font-size 20px
                color #909298
      .tranWrapper
        position absolute
        top 140px
        right 0
        width 60%
        height 60%
        transform translateX(200px)
        animation move 1.2s ease 0.1s 1 forwards
        z-index -1
        img
          width 100%
    .introduce
      margin-top 100px
      width 100%
      position relative
      .introduceWrapper
        margin 0 auto
        max-width 1100px
        min-width 860px
        display flex
        flex-direction column
        z-index 1
        & > h1
          color rgba(20, 20, 20, 0.9)
          text-align center
        & > h2
          margin-top 20px
          font-size 20px
          color #909298
          text-align center
        .introItem
          margin-top 100px
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          &:nth-child(even)
            flex-direction row-reverse
          .introLogo
            width 375px
            height 375px
            img
              width 375px !important
          .content
            flex 1
            padding 0 100px
            height 375px
            display flex
            flex-direction column
            justify-content flex-start
</style>
