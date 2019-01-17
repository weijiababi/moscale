import * as type from './mutation-type'
import Cookie from 'js-cookie'

const mutations = {
  [type.SET_LOGIN](state, flag) {
    state.login = flag
  },
  [type.SET_USER](state, user) {
    state.user = user
  },
  [type.SAVE_FORM](state, form) {
    state.form = form
    Cookie.set('form', form)
  }
}

export default mutations
