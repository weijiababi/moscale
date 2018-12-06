<template>
  <div class="wrapper">
    <div class="nav">
      <Nav />
    </div>
    <div class="homePage">
      <div class="mainHomePage">
        <!--实时数据-->
        <div class="mainHomePageTop">
          <cardTitle :icon="'insert_chart'">
            <template slot='mainTitle'>
              实时数据
            </template>
            <template slot='subTitle'>
              数据每分钟更新一次
            </template>
          </cardTitle>

          <!--当日总数据-->
          <div class="todayData">
            <div class="todayDataItem">
              <div class="todayDataItemTitle">
                今日总花费
              </div>
              <div class="todayDataItemContent active">
                {{totalCost}}元
              </div>
            </div>
            <div class="todayDataItem">
              <div class="todayDataItemTitle">
                今日总关注量
              </div>
              <div class="todayDataItemContent active">
                {{totalFans}}个
              </div>
            </div>
            <div class="todayDataItem">
              <div class="todayDataItemTitle">
                今日平均单粉价格
              </div>
              <div class="todayDataItemContent active">
                {{perPri}}元
              </div>
            </div>
          </div>

          <!--当日报表-->
          <div class="todayChart">
            <div class="todayChartTitle">
              <div class="consume">
                <p>
                  今日花费(元)
                </p>
                <div class="deadline">
                  （数据截止 {{endTime}}）
                </div>
              </div>
              <div class="checkHistoryTable">
                <div class="checkHistoryBtn" @click="jump('/chart/statisticChart')">
                  查看历史报表
                </div>
              </div>
              <div class="officeAccount" v-if='accountList.length>0'>
                <div class="accountItem" 
                  v-for='(account, index) in accountList'
                  :key='index'
                  :class="{active: index === accountIndex}"
                  @click='selectAccount(index)'>
                  {{account.name}}
                </div>
              </div>
            </div>
            <div class="todayChartContent">
              <div class="chartWrapper">
                <div class="chartInner" id="echart">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--今日计划任务-->
        <div class="mainHomePageBottom">
          <div class="pageTitle">
            <div class="titleContent">
              <i class="material-icons">schedule</i>
              <p class='mainTitle'>今日计划任务</p>
              <p class='subTitle'>数据每分钟更新一次</p>
            </div>
            <div class="addNewTask" @click="jump('/extend/addProject')">
              <Icon type="md-add" />
              <p>新增任务</p>
            </div>
            <div class="checkTaskList" @click="jump('/extend/allProject')">
              进入计划任务列表
            </div>
          </div>
          <div class="pageTable">
            <div class="tableWrapper">
              <div class="tableContent">
                <MyTable
                  :url='url'
                  :column='column' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightHomePage">
        <!--账户余额-->
        <div class="rightHomePageItem">
          <cardTitle 
            :icon="'account_balance_wallet'">
            <template slot='mainTitle'>
              账户余额
            </template>
          </cardTitle>
          <div class="rightHomePageItemContent flexContainer">
            <div class="money" v-if='user.balance'>
              {{user.balance}}
              <p class="unit">元</p>
            </div>
            <div class="walletCtl">
              <div class="recharge" @click="jump('/account/recharge')">立即充值</div>
              <div class="accountDetail" @click="jump('/account/consumeRecord')">账户明细</div>
            </div>
          </div>
        </div>
        <!--学习专区-->
        <div class="rightHomePageItem special" v-if='learnList.length>0'>
          <cardTitle 
            :icon="'school'"
            :link="'/help/learn'">
            <template slot='mainTitle'>
              学习专区
            </template>
          </cardTitle>
          <div class="rightHomePageItemContent">
            <swiper
              :options="swiperOption" 
              ref="mySwiper">
              <template>
                <swiper-slide
                  v-for='(article, index) in learnList'
                  :key='index'>
                  <div class="swiperItem">
                    <div class="swiperImgWrapper">
                      <img :src='article.img_url'/>
                    </div>
                    <p class='articleTitle'>
                      {{article.title}}
                    </p>
                  </div>
                </swiper-slide>
              </template>
            </swiper>
            <div class="pagination">
              <div class="swiper-pagination"></div>
            </div>
          </div>
        </div>
        <!--常见问题-->
        <div class="rightHomePageItem" v-if='questionList.length> 0'>
          <cardTitle 
            :icon="'help'"
            :link="'/help/currentQus'">
            <template slot='mainTitle'>
              常见问题
            </template>
          </cardTitle>
          <div class="rightHomePageItemContent">
            <div class="questionList">
              <div class="questionItem"
                v-for='(question, index) in questionList'
                :key='index'
                @click='toQus(question.article_id)'>
                {{question.title}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cardTitle from '../components/cardTitle/cardTitle.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import eventBus from '../bus.js'
import {mapGetters, mapMutations} from 'vuex'
import Nav from '../components/nav/nav.vue'
import http from '../static/js/http.js'
import MyTable from '../components/myTable/myTable1.vue'
import echarts from 'echarts'

export default {
  data() {
    return {
      column: [
          {
            title: '任务名',
            key: 'name',
            render: (h, params) => {
              return h('div', params.row.identifier)
            }
          },
          {
            title: '性别',
            key: 'sex',
            render: (h, params) => {
              if(params.row.property.sex == 1) {
                return h('div','男')
              }else if(params.row.property.sex == 2) {
                return h('div','女')
              }else if(params.row.property.sex == 3) {
                return h('div','不限')
              }
            }
          },
          {
            title: '地区',
            key: 'address',
            render: (h,params) => {
              if(params.row.weightiness_tag === null || params.row.weightiness_tag.length == 0) {
                return h('span', '暂无数据')
              }else {
                return (
                  params.row.weightiness_tag.map(item => {
                    return h('span', {
                      style: {
                        display: 'inline',
                        marginRight: '5px'
                      }
                    },item.province_name + item.city_name + item.area_name)
                  })
                )
              }
            }
          },
          {
            title: '场景',
            key: 'scene',
            render: (h, params) => {
              if(params.row.label_scene === null || params.row.label_scene.length == 0) {
                return h('span', '暂无数据')
              }else {
                return (
                  params.row.label_scene.map(item => {
                    return  h('span',{
                      style: {
                        display: 'inline',
                        marginRight: '5px'
                      }
                    },item.label_name)
                  })
                )
              }
            }
          },
          {
            title: '今日花费',
            render: (h, params) => {
              if(params.row.report_day === null) {
                return h('span', '暂无数据')
              }else {
                return h('span', params.row.report_day.price)
              }
            }
          },
          {
            title: '今日关注(个)',
            render: (h, params) => {
              if(params.row.report_day === null) {
                return h('span', '暂无数据')
              }else {
                return h('span', params.row.report_day.number)
              }
            }
          },
          {
            title: '单粉成本(元)',
            render: (h, params) => {
              if(params.row.report_day === null) {
                return h('span', '暂无数据')
              }else {
                return h('span', params.row.report_day.average_price)
              }
            }
          }
      ],
      url: '/frontend/goods/finds',
      swiperOption: {
        grabCursor: true,
        preventClicks: false,
        on: {
          click: () => {
            let id = this.learnList[this.swiper.activeIndex].article_id
            this.toLearn(id)
          }
        },
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active'
        },
        autoplay: {
          disableOnInteraction: false
        }
      },
      accountList: [],
      accountIndex: 0,
      learnList: [],
      questionList: [],
      totalCost: 0,
      totalFans: 0,
      perPri: 0,
      endTime: '00:00'
    }
  },
  methods: {
    getTodayData() {
      http.postNormal('/frontend/goods_report_minutes/finds').then((res) => {
        console.log('获取当日数据')
        console.log(res)
        if(res.data.code == 200) {
          this.totalCost = res.data.data.price_total,
          this.totalFans = res.data.data.number_total,
          this.perPri = res.data.data.average_price
        }
      })
    },
    selectAccount(index) {
      this.accountIndex = index
      this.toDayCost(this.accountList[index].appid)
    },
    //跳转更新侧边栏
    jump(path) {
      eventBus.$emit('changeActive', path)
      this.$router.push({path})
    },
    //获取公众号列表
    getAccount() {
      http.postNormal('/frontend/official_account/finds',{
        type: 1
      }).then((res) => {
        console.log('获取用户公众号列表')
        console.log(res)
        if(res.data.code == 200) {
          this.accountList = res.data.data.data.data
          this.toDayCost(this.accountList[0].appid)
        }
      })
    },
    //获取学习专区
    getLearnList() {
      http.postNormal('/frontend/article/finds', {
        category: 2,
        per_page: 5
      }).then((res) => {
        console.log('获取学习专区')
        console.log(res)
        if(res.data.code == 200) {
          this.learnList = res.data.data.data
        }
      }).catch((res) => {
        console.log('获取失败')
        console.log(res)
      })
    },
    //获取问题专区
    getQusList() {
      http.postNormal('/frontend/article/finds', {
        category: 3,
        per_page: 5
      }).then((res) => {
        console.log('获取问题专区')
        console.log(res)
        if(res.data.code == 200) {
          this.questionList = res.data.data.data
        }
      }).catch((res) => {
        console.log('获取失败')
        console.log(res)
      })
    },
    toQus(id) {
      eventBus.$emit('changeActive', '/help/currentQus')
      this.$router.push({path: `/help/currentQus/${id}`})
    },
    toLearn(id) {
      eventBus.$emit('changeActive', '/help/learn')
      this.$router.push({path: `/help/learn/${id}`})
    },
    //获取每小时消费记录
    toDayCost(appid) {
      http.postNormal('/frontend/goods_report_hours/getEveryHourRecord',{appid}).then((res) => {
        console.log('获取每小时消费记录')
        console.log(res)
        let labels = []
        let data = []
        let dataList = {...res.data.data}
        let endTime = ''
        if(res.data.code == 200) {
          for (let i=0;i<=24;i++) {
            let k = i
            if(i<10) {
              k = '0' + i
            }
            labels.push(k)
            data.push(0)
            
            for(let j in dataList) {
              let index = Number(j.substr(11, 2))
              if(index == k) {
                data[i] = dataList[j]
                endTime = k
              }
            }
          }
        }
        this.endTime = endTime>0? endTime + ':00' : '00:00'
        this._datatoChart(labels, data)
      })
    },
    getUser() {
      http.postNormal('/frontend/user_wallet/detail').then((res) => {
        console.log('获取用户个人信息')
        console.log(res)
        if(res.data.code == 200) {
          this.setUser(res.data.data)
        }
      })
    },
    _initeChart() {
      this.myChart = echarts.init(document.getElementById('echart'))
      this.myChart.setOption({
        tooltip: {
          trigger: 'axis',
          position: (pt) => {
            return [pt[0], '10%']
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
        },
        series: [{
          data: [],
          name: '花费',
          type: 'line',
          symbol: 'none',
          sampling: 'average',
          /*areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(255, 158, 68)'
            }, {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }])
          }*/
        }]
      })

      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    _datatoChart(labels, data) {
      this.myChart.setOption({
        xAxis: {
          data: labels
        },
        series: [{
          data,
          name: '花费'
        }]
      })
    },
    ...mapMutations({
      setUser: 'SET_USER'
    })
  },
  mounted() {
    this._initeChart()
    this.getUser()
    this.getTodayData()
    this.getAccount()
    this.getLearnList()
    this.getQusList()
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    ...mapGetters([
      'user'
    ])
  },
  components: {
    cardTitle,
    swiper,
    swiperSlide,
    MyTable,
    Nav
  }
}
</script>

<style lang="stylus">
@import '../static/style/index.styl'
.wrapper
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width 100%
  height 100%
  background-color #f2f2f2
  $flex-column-start()
  .nav
    flex 0 1 auto
  .homePage
    padding 16px
    width 100%
    height 100%
    $flex-row-space()
    align-items stretch
    overflow-x hidden
    flex 1
    .mainHomePage
      margin-right 16px
      flex 1
      $flex-column-start()
      overflow hidden
      .mainHomePageTop
        $flex-column-start()
        margin-bottom 16px
        flex 1 1 auto
        background-color #fff
        box-shadow 0 0 6px 6px rgba(200,200,200,.15)
        border-radius 6px
        .todayData
          flex 0 1 auto
          $flex-row-start()
          margin 0 20px
          padding 20px 0
          .todayDataItem
            display flex
            flex-direction column
            justify-content flex-start
            align-items center
            margin-right 60px
            &.todayDataItem:last-child
              margin-right 0
            .todayDataItemTitle
              margin-bottom 16px
              font-size $font-size-small
              color $color-light
            .todayDataItemContent
              font-size $font-size-medium-x
              font-weight 700
              color $color-dark
              &.active
                color $theme-color
        .todayChart
          flex 1
          $flex-column-start()
          margin 0 20px
          padding 20px 0
          .todayChartTitle
            $flex-row-start()
            flex 0 0 48px
            height 48px
            .consume
              $flex-row-start()
              width 280px
              p
                margin-right 8px
                font-size $font-size-medium
                color $color-dark
              .deadline
                font-size $font-size-small-s
                color $color-light
            .checkHistoryTable
              flex 1
              $flex-row-start()
              .checkHistoryBtn
                padding 6px 10px
                font-size $font-size-small
                color #fff
                background-color $theme-color
                border-radius 4px
                cursor pointer
            .officeAccount
              $flex-row-start()
              border 1px solid $theme-color
              border-radius 4px
              background-color $theme-color
              .accountItem
                padding 6px 10px
                color $theme-color
                background-color #fff
                border-right 1px solid $theme-color
                cursor pointer
                &.accountItem:first-child
                  border-top-left-radius 4px
                  border-bottom-left-radius 4px
                &.accountItem:last-child
                  border-right none
                  border-top-right-radius 4px
                  border-bottom-right-radius 4px
                &.active
                  color #fff
                  background-color $theme-color
          .todayChartContent
            flex 1
            position relative
            .chartWrapper
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              .chartInner
                position relative
                width 100%
                height 100%
                overflow hidden
      .mainHomePageBottom
        flex 0 1 auto
        position relative
        background-color #fff
        box-shadow 0 0 6px 6px rgba(200,200,200,.15)
        border-top-left-radius 6px
        border-top-right-radius 6px
        .pageTitle
          $flex-row-start()
          margin 0 20px
          padding 12px 0 
          font-size $font-size-medium
          .titleContent
            $flex-row-start()
            width 280px
            color rgba(154, 154, 154, 1)
            .mainTitle
              margin-left 12px
              font-size $font-size-medium-x
            .subTitle
              margin-left 8px
              font-size $font-size-small
          .addNewTask
            $flex-row-center()
            padding 6px 10px
            color #fff
            background-color $theme-color
            border-radius 4px
            cursor pointer
            i
              font-size $font-size-small
            p
              font-size $font-size-small
          .checkTaskList
            $flex-common-center
            margin-left 8px
            padding 6px 10px
            font-size $font-size-small
            color $color-dark
            background-color rgba(200,200,200,.9)
            border-radius 4px
            cursor pointer
        .pageTable
          position relative
          .tableWrapper
            position relative
            width 100%
            .tableContent
              position relative
              padding 12px 20px
              max-height 180px
              background-color #fff
              overflow-x hidden
              overflow-y auto
    .rightHomePage
      flex 0 0 200px
      width 200px
      $flex-column-start()
      .rightHomePageItem
        $flex-column-start()
        flex 1
        margin-bottom 16px
        background-color #fff
        box-shadow 0 0 6px 6px rgba(200,200,200,.15)
        border-radius 6px
        &.rightHomePageItem:last-child
          margin-bottom 0
        &.special
          flex 1 1 auto
          min-height 260px
          max-height 280px
        .rightHomePageItemContent
          flex 1
          margin 20px
          font-size $font-size-small
          overflow hidden
          &.flexContainer
            $flex-column-start()
          .swiperItem
            height 170px
            display flex
            flex-direction column
            justify-content space-between
            .swiperImgWrapper
              flex 1
              overflow hidden
              img
                width 100%
                height 100%
            .articleTitle
              margin-top 10px
              font-size $font-size-small
              color rgba(154,154,154,1)
              text-align center
          .pagination
            $flex-row-center()
            margin-top 10px
            position relative
            width 100%
            height 15px
            .my-bullet
              margin-right 4px
              width 8px
              height 8px
              display inline-block
              background rgba(0,0,0,0.20)
              border-radius 4px
            .my-bullet-active
              background $theme-color
          .money
            flex 1
            font-size $font-size-large
            font-weight 700
            color #000
            .unit
              display inline
              margin-left 3px
              font-size $font-size-small-s
              color $color-dark
          .walletCtl
            $flex-row-start()
            flex 0 0 40px
            height 40px
            .recharge,
            .accountDetail
              padding 6px 10px
              font-size $font-size-small
              border-radius 4px
              cursor pointer
            .recharge
              margin-right 8px
              color #fff
              background-color $theme-color
            .accountDetail
              color $color-dark
              background-color rgba(200,200,200,.9)
          .questionList
            $flex-column-start()
            .questionItem
              margin-bottom 10px
              color $color-light
              cursor pointer
              &.questionItem:hover
                color rgba(0,84,193,.99)
</style>
