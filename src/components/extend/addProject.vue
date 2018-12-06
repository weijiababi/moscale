<template>
  <div class="addProject">
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
          <Icon type="md-people" />
          选择性别
        </div>
        <RadioGroup v-model="sex">
          <Radio label="1">
            <span>男性</span>
          </Radio>
          <Radio label="2">
            <span>女性</span>
          </Radio>
          <Radio label="3">
            <span>不限</span>
          </Radio>
        </RadioGroup>
      </div>

      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="md-cloud-circle" />
          选择地区
        </div>
        <div class="selectContent">
          <div class="cascaderWrapper">
            <Cascader 
              :data="areaData"
              @on-change='selectArea'>
            </Cascader>
          </div>
          <div class="selectedArea">
            <CheckboxGroup v-model="selectedAreaId">
              <template>
                <Checkbox
                  v-for='(item, index) in selectedArea'
                  :key='index'
                  :label='item.areaId'>
                  <span>{{item.label}}</span>
                </Checkbox>
              </template>
            </CheckboxGroup>
          </div>
        </div>
      </div>
      
      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="ios-home" />
          选择场景
        </div>
        <CheckboxGroup v-model="scene">
          <template>
            <Checkbox
              v-for='(item, index) in labelData'
              :key='index'
              :label='item.label_id'>
              <span>{{item.name}}</span>
            </Checkbox>
          </template>
        </CheckboxGroup>
      </div>

      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="md-desktop" />
          选择设备
        </div>
        <CheckboxGroup v-model="device">
          <Checkbox label="steelyard" disabled>
            <span>体重秤</span>
          </Checkbox>
        </CheckboxGroup>
      </div>

      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="ios-bulb" />
          选择投放公众号
        </div>
        <RadioGroup v-model="officeAccount">
          <template>
            <Radio
              v-for='(account, index) in accountData'
              :key='index'
              :label='account.id'>
              <span>{{account.name}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </div>
    </div>

    <div class="nextBtn" @click='toBid'>
      <div class="nextBtnInner">
        下一步,进入出价设置
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import eventBus from '../../bus.js'
import http from '../../static/js/http.js'
import {mapMutations} from 'vuex'
export default {
  data() {
    return {
      //初始数据
      areaData:[],
      labelData: [],
      accountData: [],
      device: ['steelyard'],
      //被绑定选择的数据
      sex: '1',
      area: [],
      scene: [],
      officeAccount: '0',
      //地区选择后形成的多选项
      selectedArea: [],
      selectedAreaId: []
    }
  },
  methods: {
    toBid() {
      if(this.officeAccount == '0') {
        this.$Message.warning('请先选择公众号')
        return false
      }

      const formData = {
        official_account_id: this.officeAccount,
        label_ids: this.scene,
        area_ids: this.selectedAreaId.indexOf(-1)>-1? [-1]:this.selectedAreaId,
        sex: this.sex
      }
      this.saveForm(formData)
      this.$router.push({path: '/extend/myBid'})
    },
    getArea() {
      http.postNormal('/frontend/area/findsToPc')
          .then((res) => {
            console.log('获取地区列表')
            console.log(res)
            if(res.data.code == 200) {
              this.areaData = res.data.data
            }
          })
    },
    getLabel() {
      http.postNormal('/frontend/label/finds',{page: 1}).then((res) => {
        console.log('获取场景标签')
        console.log(res)
        if(res.data.code == 200) {
          this.labelData = [...res.data.data.data].slice(0,-1)
        }
      })
    },
    getAccountList() {
      http.postNormal('/frontend/official_account/finds',{
        type: 2
      }).then((res) => {
        console.log('获取未参与活动的公众号列表')
        console.log(res)
        if(res.data.code == 200) {
          this.accountData = res.data.data.data.data
          this.officeAccount = this.accountData[0].id
        }
      }).catch((res) => {
        console.log('获取公众号列表失败')
        console.log(res)
      })
    },
    selectArea(val, list) {
      if(list[0].value == -1) {
        this.selectedArea.push({
          label: '不限',
          areaId: -1
        })
        this.selectedAreaId.push(-1)
        return 
      }

      let __label = list[list.length-1].__label.split('/')
      let __value = list[list.length-1].__value.split(',')
      __value = __value.slice(0, __value.indexOf('-1'))
      __label = __label.slice(0, __value.indexOf('-1')).join('/')
      let areaId = __value[__value.length-1]
      
      const isExit = this.selectedAreaId.filter(item => {
        return item == areaId
      }).length 

      if(isExit>0) {
        this.$Message.success('已选择该项')
        return false
      }
      
      this.selectedArea.push({
        label: __label,
        areaId
      })
      this.selectedAreaId.push(areaId)
    },
    ...mapMutations({
      saveForm: 'SAVE_FORM'
    })
  },
  components: {
    PageTitle
  },
  mounted() {
    //挂载后清空vuex中的form
    this.saveForm({})

    this.getArea()
    this.getLabel()
    this.getAccountList()
  },
  watch: {
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
  .selectList
    margin-top 20px
    width 60%
    .selectItem
      margin-bottom 20px
      padding 16px
      background-color #f6f6f6
      border-radius 8px
      &.selectItem:last-child
        margin-bottom 0
      .selectTitle
        margin-bottom 16px
        padding 8px 0 8px 8px
        width 50%
        background-color #f3f3f3
        border 1px solid #e8e8e8
        border-radius 8px
        i
          font-size $font-size-large
      .selectContent
        .cascaderWrapper
          margin-bottom 16px
          width 160px
        .selectedArea
          $flex-row-start()
  .nextBtn
    $flex-row-center()
    .nextBtnInner
      margin 40px auto
      padding 6px 10px
      font-size  $font-size-small
      color #fff
      background-color $theme-color
      text-align center
      border-radius 4px
      cursor pointer
</style>
