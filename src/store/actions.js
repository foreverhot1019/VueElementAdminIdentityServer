export async function AsyncSetHelloWorldMsg ({ commit, state }, Msg) {
  await commit('setHelloWorldMsg', Msg)
  state.HelloWorldMsgSetTimes++
}
