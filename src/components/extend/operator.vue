<template>
  <div class="operator">
    <PageTitle>
      <template slot="mainPath">计划</template>
      <template slot="path">运营人员</template>
      <template slot="mainTitle">运营人员</template>
    </PageTitle>

    <div class="addAccount">
      <div class="addBtn" @click="addOperator">
        <Icon type="md-add"/>新增运营人员
      </div>
    </div>

    <div class="tableWrapper">
      <MyTable :column="column" :url="url" ref="myTable"/>
    </div>

    <Modal title="添加运营人员" v-model="addVisible" ok-text="已经扫码" @on-ok="freshTable">
      <div
        class="modalContent"
        :style="{display: 'flex',flexDirection: 'row', alignItems: 'flex-start'}"
      >
        <div
          class="qrcode"
          :style="{width: '200px', height: '200px', backgroundColor: 'rgba(200,200,200,.6)'}"
        >
          <img :src="qrUrl" :style="{width: '100%'}">
        </div>
        <div
          class="tips"
          :style="{marginTop: '10px',marginLeft: '20px', flex: '1', height: '200px'}"
        >
          <div class="tipsTitle" :style="{fontSize: '18px', lineHeight:'1.4'}">使用运营人员手机微信扫描屏幕上的二维码</div>
          <div class="tipsContent" :style="{marginTop: '16px',fontSize: '12px',lineHeight: '1.2'}">
            <p>绑定微信之后可以收到平台的开启任务提醒、出价实时情况提醒，账户余额提醒等。</p>
            <p :style="{marginTop: '16px'}">绑定微信之后可以收到平台的最新动态。</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import http from '../../static/js/http.js'
import MyTable from '../myTable/myTable1.vue'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      addVisible: false,
      column: [
        {
          title: '运营人员',
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }
              },
              [
                h('img', {
                  style: {
                    width: '40px',
                    heigth: '40px',
                    borderRadius: '50%'
                  },
                  attrs: {
                    src: params.row.head_img_url
                  }
                }),
                h(
                  'span',
                  {
                    style: {
                      marginLeft: '5px',
                      fontSize: '12px'
                    }
                  },
                  params.row.name
                ),
                h(
                  'span',
                  {
                    style: {
                      marginLeft: '5px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: 'rgb(2, 102, 206)'
                    },
                    on: {
                      click: () => {
                        this.setRemark(params.row.operative_id)
                      }
                    }
                  },
                  '备注'
                )
              ]
            )
          }
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '确定移除该运营人员吗',
                        onOk: () => {
                          this.delete(params.row.operative_id)
                        }
                      })
                    }
                  }
                },
                '移除'
              )
            ])
          }
        }
      ],
      url: '/frontend/operative/finds',
      remark: '',
      qrUrl: ''
    }
  },
  methods: {
    addOperator() {
      this.addVisible = true
      this.getQr()
    },
    setRemark(id) {
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
          this.resetRemark(id)
        },
        onCancel: () => {
          this.remark = ''
        }
      })
    },
    resetRemark(id) {
      http
        .postNormal('/frontend/operative/remark', {
          operative_id: id,
          name: this.remark
        })
        .then(res => {
          console.log('修改备注')
          console.log(res)
          if (res.data.code == 200) {
            this.$Message.success('修改成功')
            this.remark = ''
            this.$refs.myTable.getData()
          }
        })
    },
    getQr() {
      http
        .postNormal('/frontend/operative/create')
        .then(res => {
          if (res.status == 200) {
            return Promise.resolve(res.data)
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.qrUrl = res.data
          }
        })
    },
    freshTable() {
      this.$refs.myTable.getData()
    },
    delete(id) {
      http
        .postNormal('/frontend/operative/deletes', {
          operative_id: id
        })
        .then(res => {
          if (res.status == 200) {
            return Promise.resolve(res.data)
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.$Message.success('删除成功')
            this.$refs.myTable.getData()
          } else {
            this.$Message.error('删除失败')
          }
        })
    }
  },
  mounted() {},
  components: {
    PageTitle,
    MyTable
  }
}
</script>
<style lang="stylus" scoped>
@import '../../static/style/index.styl'
.operator
  width 100%
  overflow hidden
  .addAccount
    $flex-row-start()
    width 100%
    .addBtn
      padding 6px 10px
      font-size $font-size-small
      color #fff
      background-color $theme-color
      border-radius 4px
      text-align center
      cursor pointer
    i
      margin-right 5px
  .tableWrapper
    margin-top 20px
</style>
