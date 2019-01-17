<template>
  <div class="addProject">
    <PageTitle>
      <template slot="mainPath">计划</template>
      <template slot="path">全部计划</template>
      <template slot="mainTitle">全部计划</template>
    </PageTitle>

    <div class="mainContent">
      <div class="todayData">
        <div class="todayDataItem">
          <div class="todayDataItemTitle">今日总花费</div>
          <div class="todayDataItemContent">{{totalCost}}元</div>
        </div>
        <div class="todayDataItem">
          <div class="todayDataItemTitle">今日总关注量</div>
          <div class="todayDataItemContent">{{totalFans}}个</div>
        </div>
        <div class="todayDataItem">
          <div class="todayDataItemTitle">今日平均单粉价格</div>
          <div class="todayDataItemContent">{{perPri}}元</div>
        </div>
      </div>
      <div class="officeAccount">
        <div class="accountList" v-if="accountList.length>0">
          <div
            class="accountItem"
            v-for="(item, index) in accountList"
            :key="index"
            :class="{active: index==currentIndex}"
            @click="selectAccount(index)"
          >{{item.name}}</div>
        </div>
        <div class="addTask" @click="addTask">
          <Icon type="md-add"/>创建计划
        </div>
      </div>
    </div>

    <div class="tableWrapper">
      <Table
        stripe
        :columns="column"
        :data="tableData"
        :style="{border: 'none'}"
        :row-class-name="rowClassName"
      ></Table>
      <div class="page" v-if="switchPage">
        <Page :total="total" show-elevator @on-change="pageChange" :style="{padding: '2px 0'}"/>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import eventBus from '../../bus.js'
import http from '../../static/js/http.js'

export default {
  data() {
    return {
      totalCost: 0,
      totalFans: 0,
      perPri: 0,
      accountList: [],
      currentIndex: -1,
      remark: '',
      bid: '',
      column: [
        {
          title: '任务名',
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start'
                }
              },
              [
                h(
                  'strong',
                  {
                    style: {
                      cursor: 'pointer',
                      minWidth: '90px',
                      textAlign: 'right',
                      marginRight: '10px'
                    }
                  },
                  params.row.remark != ''
                    ? params.row.remark
                    : params.row.identifier
                ),
                h(
                  'span',
                  {
                    style: {
                      display: 'inline',
                      color: '#0266ce',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.setRemark(params.row.goods_id)
                      }
                    }
                  },
                  params.row.status != 3 ? '备注' : ''
                )
              ]
            )
          },
          width: 180
        },
        {
          title: '公众号',
          key: 'account_name'
        },
        {
          title: '出价上限（元）',
          key: 'bid',
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    width: '40px',
                    textAlign: 'right',
                    marginRight: '10px',
                    display: 'inline-block'
                  }
                },
                params.row.bidding
              ),
              h(
                'span',
                {
                  style: {
                    display:
                      params.row.status == 1 || params.row.status == 2
                        ? 'inline'
                        : 'none',
                    color: '#0266ce',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.changeBid(params.row, params.index)
                    }
                  }
                },
                '修改'
              )
            ])
          },
          width: 140
        },
        {
          title: '性别',
          key: 'sex',
          render: (h, params) => {
            if (params.row.property.sex == 1) {
              return h('div', '男')
            } else if (params.row.property.sex == 2) {
              return h('div', '女')
            } else if (params.row.property.sex == 3) {
              return h('div', '不限')
            }
          }
        },
        {
          title: '地区',
          key: 'address',
          render: (h, params) => {
            if (
              params.row.weightiness_tag.length == 0 ||
              params.row.weightiness_tag === null
            ) {
              return h('span', '不限制')
            } else {
              return params.row.weightiness_tag.map(item => {
                return h(
                  'span',
                  {
                    style: {
                      display: 'inline',
                      marginRight: '5px'
                    }
                  },
                  item.province_name + item.city_name + item.area_name
                )
              })
            }
          }
        },
        {
          title: '场景',
          key: 'scene',
          render: (h, params) => {
            if (
              params.row.label_scene.length == 0 ||
              params.row.label_scene.length === null
            ) {
              return h('span', '不限制')
            } else {
              return params.row.label_scene.map(item => {
                return h(
                  'span',
                  {
                    style: {
                      display: 'inline',
                      marginRight: '5px'
                    }
                  },
                  item.label_name
                )
              })
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: params.row.status == 1 ? 'inline' : 'none'
                  },
                  on: {
                    click: () => {
                      this.changeStatus(params.row, params.index)
                    }
                  }
                },
                '开启'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: params.row.status == 2 ? 'inline' : 'none'
                  },
                  on: {
                    click: () => {
                      this.changeStatus(params.row, params.index)
                    }
                  }
                },
                '暂停'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: params.row.status == 3
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.closeTask(params.row)
                    }
                  }
                },
                params.row.status == 3 ? '已移除' : '移除'
              )
            ])
          }
        }
      ],
      tableData: [],
      total: 1,
      currentPage: 1,
      switchPage: false
    }
  },
  methods: {
    selectAccount(index) {
      this.currentIndex = index
      this.currentPage = 1
      this.getData()
    },
    addTask() {
      eventBus.$emit('changeActive', '/extend/addProject')
      this.$router.push({ name: 'addProject' })
    },
    changeStatus(data, index) {
      let status = data.status == 1 ? 2 : 1
      let msg = data.status == 1 ? '开启成功' : '暂停成功'
      let title = data.status == 1 ? '开启任务后，用户可以正常关注' : '提示'
      let content =
        data.status == 1 ? '如果没有用户关注，建议调整出价' : '是否暂停任务'

      this.$Modal.confirm({
        title,
        content,
        onOk: () => {
          http
            .postLoading('/frontend/goods/status', {
              goods_id: data.goods_id,
              status
            })
            .then(res => {
              console.log('修改任务状态')
              console.log(res)
              if (res.data.code == 200) {
                this.$Message.success(msg)
                this.getData()
              } else if (res.data.code == 10001) {
                //账户余额不足
                throw res
              } else {
                this.$Message.error('修改失败')
              }
            })
            .catch(res => {
              console.log('修改失败')
              console.log(res)
              if (res.data.code == 10001) {
                //账户余额不足
                this.$Modal.confirm({
                  title: '提示',
                  content: '您的账户余额不足，是否前往充值?',
                  onOk: () => {
                    eventBus.$emit('changeActive', '/account/recharge')
                    this.$router.push({ name: 'recharge' })
                  }
                })
              }
            })
        }
      })
    },
    closeTask(data) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认关闭后，任务无法重新开启，是否继续？',
        onOk: () => {
          http
            .postLoading('/frontend/goods/status', {
              goods_id: data.goods_id,
              status: 3
            })
            .then(res => {
              console.log('关闭任务')
              console.log(res)
              if (res.data.code == 200) {
                this.$Message.success('关闭任务成功'), this.getData()
              } else {
                this.$Message.error('关闭任务失败')
              }
            })
        }
      })
    },
    changeBid(data, index) {
      this.$Modal.confirm({
        title: '修改出价',
        render: h => {
          return h('Input', {
            props: {
              value: this.bid,
              autofocus: true,
              placeholder: '请输入出价'
            },
            on: {
              input: val => {
                this.bid = val
              }
            }
          })
        },
        onOk: () => {
          http
            .postLoading('/frontend/goods/bidding', {
              goods_id: data.goods_id,
              bidding: this.bid
            })
            .then(res => {
              console.log('修改出价')
              console.log(res)
              if (res.data.code == 200) {
                this.bid = ''
                this.$Message.success('修改成功')
                this.getData()
              } else {
                this.$Message.error('修改失败')
              }
            })
        },
        onCancel: () => {
          this.bid = ''
          this.$Message.info('取消修改')
        }
      })
    },
    getData() {
      let params =
        this.currentIndex > -1
          ? {
              page: this.currentPage,
              official_account_id: this.accountList[this.currentIndex].id
            }
          : {
              page: this.currentPage
            }
      http.postNormal('/frontend/goods/finds', params).then(res => {
        console.log('获取任务列表')
        console.log(res)
        if (res.data.code == 200) {
          this.tableData = this.handleData(res.data.data.data)
          this.currentPage = res.data.data.current_page
          this.total = res.data.data.total > 0 ? res.data.data.total : 1
          this.switchPage = res.data.data.last_page > 1 ? true : false
        }
      })
    },
    pageChange(val) {
      this.currentPage = val
      this.getData()
    },
    getAccountList() {
      http
        .postNormal('/frontend/official_account/finds', {
          type: 1
        })
        .then(res => {
          console.log('获取用户公众号列表')
          console.log(res)
          if (res.data.code == 200) {
            this.accountList = res.data.data.data
            this.getData()
          }
        })
    },
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
    setRemark(goods_id) {
      this.$Modal.confirm({
        title: '修改备注',
        render: h => {
          return h('Input', {
            props: {
              value: this.remark,
              autofocus: true,
              placeholder: '输入备注'
            },
            on: {
              input: val => {
                this.remark = val
              }
            }
          })
        },
        onOk: () => {
          http
            .postLoading('/frontend/goods/remark', {
              goods_id,
              remark: this.remark
            })
            .then(res => {
              console.log('修改备注')
              console.log(res)
              if (res.data.code == 200) {
                this.$Message.success('修改成功')
                this.remark = ''
                this.getData()
              }
            })
        },
        onCancel: () => {
          this.remark = ''
          this.$Message.info('取消修改')
        }
      })
    },
    handleData(arr) {
      let arr1 = arr.filter(item => {
        return item.status == 1 || item.status == 2
      })
      let arr2 = arr.filter(item => {
        return item.status == 3
      })
      let result = [...arr1, ...arr2]
      return result
    },
    rowClassName(item, index) {
      if (item.status == 3) {
        return 'disabled'
      }
    }
  },
  created() {},
  mounted() {
    this.getAccountList()
    this.getTodayData()
  },
  watch: {},
  components: {
    PageTitle
  }
}
</script>

<style lang="stylus">
@import '../../static/style/index.styl'
.mainContent
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
        margin-bottom 10px
        font-size $font-size-small
        color $color-light
      .todayDataItemContent
        font-size $font-size-medium-x
        font-weight 700
        color $color-dark
        &.active
          color $theme-color
  .officeAccount
    $flex-row-space()
    margin 40px 0 20px
    .accountList
      $flex-row-start()
      border 1px solid $theme-color
      border-radius 4px
      background-color $theme-color
      .accountItem
        padding 6px 10px
        font-size $font-size-small
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
    .addTask
      $flex-row-center()
      padding 6px 10px
      font-size $font-size-small
      color #fff
      background-color $theme-color
      border-radius 4px
      cursor pointer
      i
        margin-right 2px
.tableWrapper
  .page
    margin-top 10px
</style>
