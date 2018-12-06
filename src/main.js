import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './static/style/reset.css'
import Global from './static/js/config.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import http from './static/js/http'
import store from './store'
import 'babel-polyfill'

Vue.config.productionTip = true
Vue.prototype.$global = Global
Vue.prototype.$http = http.postLoading

Vue.use(iView)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
