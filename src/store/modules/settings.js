import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
// import Cookies from 'js-cookie'
import storage from 'store'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const getSettingData = (name) => {
  let setval = storage.get(`settings-${name}`)
  setval = (setval === undefined || setval == null || setval === '') ? null : setval
  console.log('getCookie', name, setval)
  if (setval != null && name !== 'theme') {
    if (typeof setval === 'string') {
      if (setval === 'true') {
        return true
      } else {
        return false
      }
    } else {
      return setval
    }
  } else {
    return setval
  }
}

const { Ctheme, CshowSettings, CtagsView, CfixedHeader, CsidebarLogo } = {
  Ctheme: getSettingData(`theme`),
  CshowSettings: getSettingData(`showSettings`),
  CtagsView: getSettingData(`tagsView`),
  CfixedHeader: getSettingData(`fixedHeader`),
  CsidebarLogo: getSettingData(`sidebarLogo`)
}

const state = {
  theme: Ctheme != null ? Ctheme : variables.theme,
  showSettings: CshowSettings != null ? CshowSettings : showSettings,
  tagsView: CtagsView != null ? CtagsView : tagsView,
  fixedHeader: CfixedHeader != null ? CfixedHeader : fixedHeader,
  sidebarLogo: CsidebarLogo != null ? CsidebarLogo : sidebarLogo
}

const getters = {
  theme: state => state.theme,
  showSettings: state => state.showSettings,
  tagsView: state => state.tagsView,
  fixedHeader: state => state.fixedHeader,
  sidebarLogo: state => state.sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      console.log('CHANGE_SETTING', key, value)
      // Cookies.set(`settings-${key}`, value)
      storage.set(`settings-${key}`, value)
    }
  }
}

const actions = {
  changeSetting ({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
