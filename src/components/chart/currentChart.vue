<template>
  <div class="currentChart">
    <PageTitle>
      <template slot="mainPath">报表</template>
      <template slot="path">实时概况</template>
      <template slot="mainTitle">实时概况</template>
    </PageTitle>

    <div class="mainContent">
      <div class="todayData">
        <div class="todayDataItem">
          <div class="todayDataItemTitle">今日总花费</div>
          <div class="lastDay">昨{{lastCost}}</div>
          <div class="todayDataItemContent active">{{totalCost}}元</div>
        </div>
        <div class="todayDataItem">
          <div class="todayDataItemTitle">今日总关注量</div>
          <div class="lastDay">昨{{lastFans}}</div>
          <div class="todayDataItemContent active">{{totalFans}}个</div>
        </div>
        <div class="todayDataItem">
          <div class="todayDataItemTitle">今日平均单粉价格</div>
          <div class="lastDay">昨{{lastPri}}</div>
          <div class="todayDataItemContent active">{{perPri}}元</div>
        </div>
      </div>
    </div>

    <div class="perHourChart">
      <div class="chartTitle">每小时进粉记录</div>
      <div class="chartContent">
        <div class="chartWrapper">
          <div class="chartInner" id="echart">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import http from '../../static/js/http.js'
import { getNowFormatDate } from '../../static/js/config.js'
import echarts from 'echarts'
export default {
  data() {
    return {
      totalCost: 0,
      totalFans: 0,
      perPri: 0,
      lastCost: 0,
      lastFans: 0,
      lastPri: 0
    }
  },
  components: {
    PageTitle
  },
  methods: {
    getTodayData() {
      http.postNormal('/frontend/goods_report_minutes/finds').then(res => {
        console.log('获取当日数据')
        console.log(res)
        if (res.data.code == 200) {
          ;(this.totalCost = res.data.data.price_total),
            (this.totalFans = res.data.data.number_total),
            (this.perPri = res.data.data.average_price)
        }
      })
    },
    getLastData() {
      let startTime = getNowFormatDate(-1) + ' 00:00:00'
      let endTime = getNowFormatDate() + ' 00:00:00'
      http
        .postNormal('/frontend/goods_report_minutes/finds', {
          start_time: startTime,
          end_time: endTime
        })
        .then(res => {
          console.log('获取昨日数据')
          console.log(res)
          if (res.data.code == 200) {
            this.lastCost = res.data.data.price_total
            this.lastFans = res.data.data.number_total
            this.lastPri = res.data.data.average_price
          }
        })
    },
    getFansData() {
      let query =
        this.$route.query.goodsId && this.$route.query.goodsId > 0
          ? { goods_id: this.$route.query.goodsId }
          : {}
      http
        .postNormal('/frontend/goods_report_minutes/getEveryMinutesFans', query)
        .then(res => {
          console.log('获取每分钟进粉量')
          console.log(res)
          this._initeChart()
          if (res.data.code == 200) {
            let labels = []
            let data = []
            let dataList = { ...res.data.data }
            for (let i in dataList) {
              labels.push(i.substr(11, 5))
              data.push(dataList[i])
            }
            /*let myData = new Date()
          for(let i=0; i<60; i++) {
            let k = i
            if(i<10) {
              k = '0' + i
            }
            labels.push(String(myData.getHours()) + ':' + k)
            data.push(0)

            for(let j in dataList) {
              let index = Number(j.substr(14, 2))
              if(index == k) {
                data[i] = dataList[j]
              }
            }
          }*/
            this._dataToChart(labels, data)
          }
        })
    },
    _initeChart() {
      this.myChart = echarts.init(document.getElementById('echart'))
      this.myChart.setOption({
        legend: {
          data: ['销量']
        },
        tooltip: {
          trigger: 'axis',
          position: pt => {
            return [pt[0], '10%']
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: '进粉',
            data: [],
            type: 'line',
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }
              ])
            }
          }
        ]
      })

      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
    },
    _dataToChart(labels, data) {
      this.myChart.setOption({
        xAxis: {
          data: labels
        },
        series: [
          {
            name: '进粉',
            data
          }
        ]
      })
    }
  },
  watch: {},
  mounted() {
    this.getTodayData()
    this.getLastData()
    this.getFansData()
  },
  created() {}
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.currentChart
  $flex-column-start()
  height 100%
  .mainContent
    flex 0 1 auto
    .todayData
      $flex-row-start()
      margin 20px 0
      .todayDataItem
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        margin-right 45px
        &.todayDataItem:last-child
          margin-right 0
        .todayDataItemTitle
          margin-bottom 6px
          font-size $font-size-small
          color $color-light
        .lastDay
          margin-bottom 4px
          font-size $font-size-small
          color $color-light
        .todayDataItemContent
          font-size $font-size-medium-x
          font-weight 700
          color $color-dark
          &.active
            color $theme-color
  .perHourChart
    $flex-column-start()
    flex 1
    padding 10px 0
    color $color-light
    border-radius 6px
    .chartTitle
      padding 6px
      flex 0 1 auto
      border-radius 6px
      background-color rgba(200, 200, 200, 0.3)
    .chartContent
      flex 1
      position relative
      .chartWrapper
        position absolute
        top 0
        left 0
        width 90%
        height 90%
        .chartInner
          position relative
          width 100%
          height 100%
</style>
