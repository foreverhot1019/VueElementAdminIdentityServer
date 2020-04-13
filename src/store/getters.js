const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  // 测试 不带Module，注册到全局
  HelloWorldMsg: state => state.HelloWorldMsg,
  HelloWorldMsgSetTimes: state => state.HelloWorldMsgSetTimes,
  Vuex1: state => state.Vuex1,
  Vuex2: state => state.Vuex2,
  Vuex3: state => state.Vuex3,
  Vuex4: state => state.Vuex4,
  Vuex1db: state => state.Vuex1 * 2
}
export default getters
