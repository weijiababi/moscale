<template>
  <div class="addProject">
    <PageTitle>
      <template slot="mainPath">计划</template>
      <template slot="path">创建计划</template>
      <template slot="mainTitle">创建计划</template>
    </PageTitle>

    <div class="selectList">
      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="md-people"/>选择性别
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
          <Icon type="md-cloud-circle"/>选择地区
        </div>
        <div class="selectContent">
          <div class="cascaderWrapper">
            <Cascader :data="areaData" @on-change="selectArea"></Cascader>
          </div>
          <div class="selectedArea">
            <CheckboxGroup v-model="selectedAreaId" @on-change="selectAreaId">
              <template>
                <Checkbox v-for="(item, index) in selectedArea" :key="index" :label="item.areaId">
                  <span>{{item.label}}</span>
                </Checkbox>
              </template>
            </CheckboxGroup>
          </div>
        </div>
      </div>

      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="ios-home"/>选择场景
        </div>
        <CheckboxGroup v-model="scene" @on-change="selectLabel">
          <template>
            <Checkbox label="-1">
              <span>不限</span>
            </Checkbox>
            <Checkbox v-for="(item, index) in labelData" :key="index" :label="item.label_id">
              <span>{{item.name}}</span>
            </Checkbox>
          </template>
        </CheckboxGroup>
      </div>

      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="md-desktop"/>选择设备
        </div>
        <CheckboxGroup v-model="device" @on-change="selectDevice">
          <template>
            <Checkbox label="-1">不限</Checkbox>
            <Checkbox v-for="(item, index) in deviceData" :key="index" :label="item.id">
              <span>{{item.name}}</span>
            </Checkbox>
          </template>
        </CheckboxGroup>
      </div>

      <div class="selectItem">
        <div class="selectTitle">
          <Icon type="ios-bulb"/>选择投放公众号
        </div>
        <RadioGroup v-model="officeAccount">
          <template>
            <Radio v-for="(account, index) in accountData" :key="index" :label="account.id">
              <span>{{account.name}}</span>
            </Radio>
          </template>
        </RadioGroup>
      </div>
    </div>

    <div class="nextBtn" @click="toBid">
      <div class="nextBtnInner">下一步,进入出价设置</div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import eventBus from '../../bus.js'
import http from '../../static/js/http.js'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      //初始数据
      areaData: [],
      labelData: [],
      accountData: [],
      deviceData: [
        { id: 1, name: '体重秤' },
        { id: 2, name: '娃娃机' },
        { id: 3, name: '纸巾机' },
        { id: 4, name: '福袋机' },
        { id: 5, name: '按摩椅' },
        { id: 6, name: '洗衣机' },
        { id: 7, name: '口红机' }
      ],
      //被绑定选择的数据
      sex: '3',
      area: [],
      scene: ['-1'],
      officeAccount: '0',
      device: ['-1'],
      //地区选择后形成的多选项
      selectedArea: [{ areaId: -1, label: '不限' }],
      selectedAreaId: [-1],
      showDialog: false
    }
  },
  methods: {
    toBid() {
      if (this.officeAccount == '0') {
        this.$Modal.confirm({
          title: '提示',
          content: '当前暂未可用公众号，是否先选择添加?',
          onOk: () => {
            eventBus.$emit('changeActive', '/extend/officeAccount')
            this.$router.push({ name: 'officeAccount' })
          }
        })
        return false
      }

      const formData = {
        official_account_id: this.officeAccount,
        label_ids: this.scene.indexOf('-1') > -1 ? [] : this.scene,
        area_ids:
          this.selectedAreaId.indexOf(-1) > -1 ? [] : this.selectedAreaId,
        sex: this.sex,
        stem_from: this.device.indexOf('-1') > -1 ? [] : this.device
      }
      this.saveForm(formData)
      this.$router.push({ path: '/extend/myBid' })
    },
    getArea() {
      http.postNormal('/frontend/area/findsToPc').then(res => {
        console.log('获取地区列表')
        console.log(res)
        if (res.data.code == 200) {
          this.areaData = res.data.data
        }
      })
    },
    getLabel() {
      http.postNormal('/frontend/label/finds', { page: 1 }).then(res => {
        console.log('获取场景标签')
        console.log(res)
        if (res.data.code == 200) {
          this.labelData = res.data.data.data
          /*this.labelData.map(item => {
            this.scene.push(item.label_id)
          })*/
        }
      })
    },
    getAccountList() {
      http
        .postNormal('/frontend/official_account/finds', {
          type: 2
        })
        .then(res => {
          console.log('获取未参与活动的公众号列表')
          console.log(res)
          if (res.data.code == 200) {
            if (res.data.data.data) {
              console.log('has account')
              for (let i in res.data.data.data) {
                this.accountData.push(res.data.data.data[i])
                this.officeAccount = this.accountData[0].id
              }
            }
          }
        })
        .catch(res => {
          console.log('获取公众号列表失败')
          console.log(res)
          this.$Modal.confirm({
            title: '提示',
            content: '当前没有空闲的公众号可以使用，请添加新的公众号',
            onOk: () => {
              eventBus.$emit('changeActive', '/extend/officeAccount')
              this.$router.push({ name: 'officeAccount' })
            },
            okText: '去添加',
            cancelText: '　'
          })
        })
    },
    selectArea(val, list) {
      if (list[0].value == -1) {
        this.selectedArea.push({
          label: '不限',
          areaId: -1
        })
        this.selectedAreaId.push(-1)
        return
      }

      let __label = list[list.length - 1].__label.split('/')
      let __value = list[list.length - 1].__value.split(',')
      __value = __value.slice(0, __value.indexOf('-1'))
      __label = __label.slice(0, __value.indexOf('-1')).join('/')
      let areaId = __value[__value.length - 1]

      const isExit = this.selectedAreaId.filter(item => {
        return item == areaId
      }).length

      if (isExit > 0) {
        this.$Message.success('已选择该项')
        return false
      }

      this.selectedArea.push({
        label: __label,
        areaId
      })
      this.selectedAreaId.push(areaId)
    },
    selectLabel(val) {
      if (val.length == 0) {
        this.scene = ['-1']
      }
      let index = val.indexOf('-1')
      if (index > -1) {
        if (index == 0) {
          this.scene.splice(0, 1)
        } else {
          this.scene = ['-1']
        }
      } else {
        if (val.length == this.labelData.length) {
          this.scene = ['-1']
        }
      }
    },
    selectDevice(val) {
      if (val.length == 0) {
        this.device = ['-1']
      }

      let index = val.indexOf('-1')
      if (index > -1) {
        if (index == 0) {
          this.device.splice(0, 1)
        } else {
          this.device = ['-1']
        }
      } else {
        if (val.length === this.deviceData.length) {
          this.device = ['-1']
        }
      }
    },
    selectAreaId(val) {},
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
    selectedAreaId(val) {
      let index = val.indexOf(-1)
      if (val.length == 0) {
        this.selectedAreaId = [-1]
      }
      if (index > -1 && val.length > 1) {
        if (index == 0) {
          this.selectedAreaId.splice(0, 1)
        } else {
          this.selectedAreaId = [-1]
        }
      }
    }
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
    font-size $font-size-small
    color #fff
    background-color $theme-color
    text-align center
    border-radius 4px
    cursor pointer
</style>
