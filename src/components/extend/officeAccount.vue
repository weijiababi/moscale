<template>
  <div class="officeAccount">
    <PageTitle>
      <template slot='mainPath'>
        推广
      </template>
      <template slot='path'>
        公众号
      </template>
      <template slot='mainTitle'>
        公众号
      </template>
    </PageTitle>

    <div class="addAccount">
      <div class="addBtn" @click='addAccount'>
        <Icon type="md-add" />
        新增公众号
      </div>
    </div>

    <div class="tableWrapper">
      <div class="tableConte">
        <div class="tableInner">
          <MyTable
            :column='column'
            :url='url'
            :params='param'>
          </MyTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../pageTitle/pageTitle.vue'
import http from '../../static/js/http.js'
import MyTable from '../myTable/myTable.vue'
import {mapGetters} from 'vuex'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      column: [
        {
          title: '公众号名字',
          key: 'name'
        },
        {
          title: 'AppId',
          key: 'appid'
        },
        {
          title: '类型',
          key: 'type',
          render: (h, params) => {
            if(params.row.type == 0) {
              return h('span', '订阅号')
            }else if(params.row.type == 1) {
              return h('span', '服务号')
            }
          }
        }
      ],
      url: '/frontend/official_account/finds',
      param: {type: 1},
    }
  },
  methods: {
    addAccount() {
      window.location.href = this.$global.baseURL + '/frontend/official_account/create?user_id=' + this.user.user_id + '&session_id=' + Cookies.get('session')
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {

  },
  components: {
    PageTitle,
    MyTable
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.officeAccount
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
    position relative
    margin-top 20px
    width 100%
    .tableContent
      position absolute
      top 0
      left 0
      width 100%
      .tableInner
        position relative
</style>
