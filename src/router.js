import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cookies from 'js-cookie'
import iView from 'iview'

Vue.use(Router)
Vue.use(iView)

const router = new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          redirect: 'index'
        },
        {
          path: '/extend',
          component: () => import('./components/extend/extend.vue'),
          meta: {requireAuth: true},
          children: [
            {
              path: '',
              redirect: 'addProject'
            },
            {
              path: 'addProject',
              name: 'addProject',
              component: () => import('./components/extend/addProject.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'allProject',
              name: 'allProject',
              component: () => import('./components/extend/allProject.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'officeAccount',
              name: 'officeAccount',
              component: () => import('./components/extend/officeAccount.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'myBid',
              name: 'myBid',
              component: () => import('./components/extend/myBid.vue'),
              meta: {requireAuth: true}
            },
          ]
        },
        {
          path: '/chart',
          component: () => import('./components/chart/chart.vue'),
          meta: {requireAuth: true},
          children: [
            {
              path: '',
              redirect: 'currentChart'
            },
            {
              path: 'currentChart',
              name: 'currentChart',
              component: () => import('./components/chart/currentChart.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'statisticChart',
              name: 'statisticChart',
              component: () => import('./components/chart/statisticChart.vue'),
              meta: {requireAuth: true}
            }
          ]
        },
        {
          path: '/account',
          component: () => import('./components/account/account.vue'),
          meta: {requireAuth: true},
          children: [
            {
              path: '',
              redirect: 'recharge'
            },
            {
              path: 'recharge',
              name: 'recharge',
              component: () => import('./components/account/recharge.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'rechargeRecord',
              name: 'rechargeRecord',
              component: () => import('./components/account/rechargeRecord.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'consumeRecord',
              name: 'consumeRecord',
              component: () => import('./components/account/consumeRecord.vue'),
              meta: {requireAuth: true}
            },
            {
              path: 'protocol',
              name: 'protocol',
              component: () => import('./components/account/protocol.vue'),
              meta: {requireAuth: true}
            }
          ]
        },
        {
          path: '/help',
          component: () => import('./components/help/help.vue'),
          children: [
            {
              path: '',
              redirect: 'learn'
            },
            {
              path: 'learn',
              name: 'learn',
              component: () => import('./components/help/learn.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./components/article/article.vue')
                }
              ]
            },
            {
              path: 'currentQus',
              name: 'currentQus',
              component: () => import('./components/help/currentQus.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./components/article/article.vue')
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('./views/index.vue')
    },
    {
      path:'/login',
      name: 'login',
      component: () => import('./views/login.vue')
    },
    {
      path:'/register',
      name: 'register',
      component: () => import('./views/register.vue')
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('./views/reset.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if(to.meta.requireAuth) {
    if(Cookies.get('access') == 1) {
      next()
    }else{
      iView.Modal.warning({
        title: '提示',
        content: '请登陆后重试',
        onOk: () => {
          next({
            path: '/login',
            query: {redirect: to.fullPath}
          })
        }
      })
    }
  }else if(to.name=='homepage' && Cookies.get('access') != 1){ //避免点击首页进行登陆仍弹出弹窗
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  }else {
    next()
  }
})

router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0,0)
})

export default router