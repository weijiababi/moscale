<template>
  <div class="myBid">
    <PageTitle>
      <template slot='mainPath'>
        推广
      </template>
      <template slot='path'>
        创建计划
      </template>
      <template slot='mainTitle'>
        创建计划
      </template>
    </PageTitle>

    <div class="selectList">
      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="logo-usd" />
          设置默认出价上限
        </div>
        <InputNumber
          :style="{width: '160px'}"
          :min="0.1"
          :step='0.1'
          v-model="value">
        </InputNumber>
        元
        <span>
          (即单次点击出价上限，最终上限还会考虑粉丝折扣，系统根据流量质量动态出价，过滤低质流量，实际出价不高于最终出价上限)
        </span>
      </div>
    </div>

    <div class="ctrlBtn">
      <div class="prev" @click='toPrev'>上一步</div>
      <div class="confirm" @click='addTask'>确定创建</div>
    </div>
  </div>
</template>

<script>
import eventBus from '../../bus.js'
import PageTitle from '../pageTitle/pageTitle.vue'
import {mapGetters} from 'vuex'
import http from '../../static/js/http.js'
export default {
  data() {
    return {
      value: 0.1
    }
  },
  methods: {
    toPrev() {
      eventBus.$emit('changeActive',"/extend/addProject")
      this.$router.push({name: 'addProject'})
    },
    addTask() {
      this.form.bidding = this.value
      console.log(this.form)
       http.postLoading('/frontend/goods/create',this.form).then((res) => {
         console.log('请求创建新任务')
         console.log(res)
         if(res.data.code == 200) {
           this.$Message.success('任务创建成功')
           setTimeout(() => {
             this.toPrev()
           }, 500)
         }
      })
    }
  },
  computed: {
    ...mapGetters([
      'form'
    ])
  },
  components: {
    PageTitle
  },
  mounted() {
    
  },
  destoryed() {
    this.$router.push({path: '/extend/addProject'})
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
    .confirm
      padding 4px 16px
      color #fff
      background-color $theme-color
      border-radius 4px
      cursor pointer
</style>
