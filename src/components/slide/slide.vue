<template>
  <div>
    <Menu
      theme="dark"
      width="auto"
      :active-name="activeName"
      ref="menu"
      @on-select="selectItem"
      accordion
    >
      <!--
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-keypad"></Icon>
          推广
        </template>
        <MenuItem name="/extend/addProject" to='/extend/addProject'>添加计划</MenuItem>
        <MenuItem name="/extend/allProject" to='/extend/allProject'>全部计划</MenuItem>
        <MenuItem name="/extend/officeAccount" to='/extend/officeAccount'>公众号列表</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
            <Icon type="ios-analytics"></Icon>
            报表
        </template>
        <MenuItem name="/chart/currentChart" to='/chart/currentChart'>实时报表</MenuItem>
        <MenuItem name="/chart/statisticChart" to='/chart/statisticChart'>统计报表</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
            <Icon type="ios-navigate"></Icon>
            账户
        </template>
        <MenuItem name="/account/recharge" to='/account/recharge'>充值</MenuItem>
        <MenuItem name="/account/rechargeRecord" to='/account/rechargeRecord'>充值记录</MenuItem>
        <MenuItem name="/account/consumeRecord" to='/account/consumeRecord'>消费记录</MenuItem>
        <MenuItem name="/account/protocol" to='/account/protocol'>服务协议</MenuItem>
      </Submenu>
      <Submenu name="4">
        <template slot="title">
            <Icon type="ios-bookmarks-outline" />
            帮助
        </template>
        <MenuItem name="/help/learn" to='/help/learn'>学习专区</MenuItem>
        <MenuItem name="/help/currentQus" to='/help/currentQus'>常见问题</MenuItem>
      </Submenu>
      -->
      <MenuItem v-if="activeMenu==1" name="/extend/addProject" to="/extend/addProject">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">add_box</i>
        <span>添加计划</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==1" name="/extend/allProject" to="/extend/allProject">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">schedule</i>
        <span>全部计划</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==1" name="/extend/officeAccount" to="/extend/officeAccount">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">public</i>
        <span>公众号列表</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==1" name="/extend/operator" to="/extend/operator">
        <i
          class="material-icons"
          :style="{fontSize: '16px',verticalAlign: 'middle'}"
        >chrome_reader_mode</i>
        <span>运营人员</span>
      </MenuItem>

      <MenuItem v-if="activeMenu==2" name="/chart/currentChart" to="/chart/currentChart">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">assignment</i>
        <span>实时报表</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==2" name="/chart/statisticChart" to="/chart/statisticChart">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">date_range</i>
        <span>统计报表</span>
      </MenuItem>

      <MenuItem v-if="activeMenu==3" name="/account/recharge" to="/account/recharge">
        <i
          class="material-icons"
          :style="{fontSize: '16px',verticalAlign: 'middle'}"
        >account_balance_wallet</i>
        <span>充值</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==3" name="/account/rechargeRecord" to="/account/rechargeRecord">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">event_note</i>
        <span>充值记录</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==3" name="/account/consumeRecord" to="/account/consumeRecord">
        <i
          class="material-icons"
          :style="{fontSize: '16px',verticalAlign: 'middle'}"
        >monetization_on</i>
        <span>消费记录</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==3" name="/account/protocol" to="/account/protocol">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">description</i>
        <span>服务协议</span>
      </MenuItem>

      <MenuItem v-if="activeMenu==4" name="/help/learn" to="/help/learn">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">school</i>
        <span>学习专区</span>
      </MenuItem>
      <MenuItem v-if="activeMenu==4" name="/help/currentQus" to="/help/currentQus">
        <i class="material-icons" :style="{fontSize: '16px',verticalAlign: 'middle'}">sync_problem</i>
        <span>常见问题</span>
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
import eventBus from '../../bus.js'
export default {
  props: {
    isCollapsed: {
      type: Boolean
    }
  },
  data() {
    return {
      activeMenu: 0,
      activeName: ''
    }
  },
  methods: {
    selectItem(val) {
      console.log(`当前路径为${val}`)
      let navName = val.split('/')[1]
      let navIndex = 0
      switch (navName) {
        case 'extend':
          navIndex = 1
          break
        case 'chart':
          navIndex = 2
          break
        case 'account':
          navIndex = 3
          break
        case 'help':
          navIndex = 4
          break
        default:
          navIndex = 0
      }
      this.activeMenu = navIndex
      this.$nextTick(() => {
        //数据更新后再执行
        this.activeName = val
        this.$refs.menu.updateActiveName()
        eventBus.$emit('changeNav', navIndex)
      })
    }
  },
  computed: {
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  created() {
    eventBus.$on('changeActive', name => {
      this.selectItem(name)
    })
  },
  mounted() {
    this.$nextTick(() => {
      let path = window.location.hash.slice(1)
      let n = path.split('/').length - 1
      if (n >= 3) {
        path = path
          .split('/')
          .slice(0, -1)
          .join('/')
      }
      console.log('当前一级路径为' + path)
      this.selectItem(path)
    })
  }
}
</script>

<style scoped lang="stylus">
@import '../../static/style/index.styl'
.menu-item
  span
    display inline-block
    overflow hidden
    width 69px
    font-size $font-size-small
    text-overflow ellipsis
    white-space nowrap
    vertical-align bottom
    transition width 0.2s ease 0.2s
  &.collapsed-menu
    span
      width 0px
      transition width 0.2s ease
.menu-item
  i
    transform translateX(0px)
    transition font-size 0.2s ease, transform 0.2s ease
    vertical-align middle
    font-size 16px
  &.collapsed-menu
    i
      transform translateX(5px)
      transition font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s
      vertical-align middle
      font-size 22px
</style>
