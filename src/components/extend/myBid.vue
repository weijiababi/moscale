<template>
  <div class="myBid">
    <PageTitle>
      <template slot="mainPath">计划</template>
      <template slot="path">创建计划</template>
      <template slot="mainTitle">创建计划</template>
    </PageTitle>

    <div class="selectList">
      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="logo-usd"/>设置默认出价上限
        </div>
        <InputNumber
          :style="{width: '160px',marginRight: '5px'}"
          :min="0.1"
          :step="0.1"
          v-model="value"
        ></InputNumber>元
        <span>(即单次点击出价上限，最终上限还会考虑粉丝折扣，系统根据流量质量动态出价，过滤低质流量，实际出价不高于最终出价上限)</span>
        <div class="recommend">
          <p :style="{marginTop: '10px',fontSize: '14px'}">公锤数据分析当前计划推荐出价为</p>
          <div
            :style="{marginTop: '5px',display:'flex',flexDirection:'row',alignItems:'flex-end'}"
          >高于
            <div
              :style="{margin: ' 0 5px', color: '#c43f38', fontSize: '20px', height: '30px', lineHeight:'38px'}"
            >{{recommendPrice}}</div>元
          </div>
        </div>
      </div>
    </div>

    <div class="ctrlBtn">
      <div class="prev" @click="toPrev">上一步</div>
      <div class="confirm" @click="addTask">确定创建</div>
    </div>
  </div>
</template>

<script>
import eventBus from '../../bus.js'
import PageTitle from '../pageTitle/pageTitle.vue'
import { mapGetters } from 'vuex'
import http from '../../static/js/http.js'
import Cookie from 'js-cookie'
export default {
  data() {
    return {
      value: 0.1,
      price: {},
      recommendPrice: 0.5
    }
  },
  methods: {
    toPrev() {
      eventBus.$emit('changeActive', '/extend/addProject')
      this.$router.push({ name: 'addProject' })
    },
    addTask() {
      this.form.bidding = this.value
      console.log(this.form)

      if (this.value < this.recommendPrice) {
        this.$Modal.confirm({
          title: '提示',
          content:
            '当前出价低于建议价格，可能导致短时间内没有粉丝关注，确定要创建任务吗？',
          onOk: () => {
            http.postLoading('/frontend/goods/create', this.form).then(res => {
              console.log('请求创建新任务')
              console.log(res)
              if (res.data.code == 200) {
                this.$Modal.confirm({
                  title: '提示',
                  content: '任务创建成功，赶紧去任务列表开启任务吧',
                  onOk: () => {
                    eventBus.$emit('changeActive', '/extend/allProject')
                    this.$router.push({
                      name: 'allProject'
                    })
                  }
                })
              }
            })
          }
        })
        return false
      }

      http.postLoading('/frontend/goods/create', this.form).then(res => {
        console.log('请求创建新任务')
        console.log(res)
        if (res.data.code == 200) {
          this.$Message.success('任务创建成功')
          this.$Modal.confirm({
            title: '提示',
            content: '任务创建成功，赶紧去任务列表开启任务吧',
            onOk: () => {
              eventBus.$emit('changeActive', '/extend/allProject')
              this.$router.push({
                name: 'allProject'
              })
            }
          })
        }
      })
    },
    getPrice() {
      http.postNormal('/frontend/sex_price_setting/detail').then(res => {
        console.log('获取建议价格')
        console.log(res)
        if (res.data.code == 200) {
          let type = this.form.sex
          switch (type) {
            case '1':
              this.recommendPrice = res.data.data.male
              break
            case '2':
              this.recommendPrice = res.data.data.female
              break
            case '3':
              this.recommendPrice = res.data.data.unlimited
              break
            default:
              this.recommendPrice = res.data.data.unlimited
              break
          }
        }
      })
    }
  },
  computed: {},
  components: {
    PageTitle
  },
  mounted() {
    this.form = Cookie.getJSON('form')
    console.log(this.form)
    this.getPrice()
  },
  destoryed() {
    this.$router.push({ path: '/extend/addProject' })
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.selectList
  margin-top 20px
  .selectItem
    margin-bottom 20px
    padding 16px
    background-color #ececec
    border-radius 8px
    &.selectItem:last-child
      margin-bottom 0
    .selectTitle
      margin-bottom 16px
      padding 8px 0 8px 8px
      width 50%
      background-color #f6f6f6
      border 1px solid #e8e8e8
      border-radius 8px
      i
        font-size $font-size-large
    span
      font-size $font-size-small
      color #aaa
.ctrlBtn
  $flex-row-center()
  margin-top 60px
  .prev
    margin-right 10px
    padding 4px 10px
    color #fff
    background-color #666
    border-radius 4px
    cursor pointer
    font-size $font-size-small
  .confirm
    padding 4px 16px
    color #fff
    background-color $theme-color
    border-radius 4px
    cursor pointer
    font-size $font-size-small
</style>
