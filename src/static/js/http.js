import Cookies from 'js-cookie'
import axios from 'axios'
import iView from 'iview'
import router from '../../router.js'
import config from './config.js'

function web(params) {
  params.url = config.baseURL + params.url
  if(!params.data) params.data = {}
  return axios(params)
}

web.post = function(url, data, header = {"Content-Type":"application/json"}) {
  const method = 'post'
  return web({url, header, data, method})
}

web.postLoading = function(url, data, header = {"Content-Type":"application/json"}) {
  iView.Spin.show()
  return web
        .post(url, {...data, session_id:Cookies.get('session')}, header)
        .then((res) => {
          iView.Spin.hide()
          switch(res.data.code) {
            case 0:
              return res
            case 200:
              return res
            case 500:
              throw res
            case 10000: //未登陆
              Cookies.remove('access')
              router.push({path: '/login'})
              throw res
          }
        })
        .catch(({data}) => {
          if(data.msg == 'ok') {
            return false
          }

          iView.Message.warning(data.msg)
          throw data
        })
}

web.postNormal = function(url, data, header = {"Content-Type":"application/json"}) {
  return web
        .post(url, {...data, session_id:Cookies.get('session')}, header)
        .then((res) => {
          switch(res.data.code) {
            case 0:
              return res
            case 200:
              return res
            case 500:
              throw res
            case 10000: //未登陆
              Cookies.remove('access')
              router.push({path: '/login'})
              throw res
          }
        })
        .catch(({data}) => {
          if(data.msg == 'ok') {
            return false
          }
          
          iView.Message.warning(data.msg)
          throw data
        })
}

export default web