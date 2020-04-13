const mutations = {
  setHelloWorldMsg: (state, HelloWorldMsg) => {
    state.HelloWorldMsg = HelloWorldMsg
    console.log('----')
  },
  setVuex1: (state, Vuex1) => {
    state.Vuex1 = Vuex1
    console.log(state, 'setVuex1----')
  },
  setVuex2: (state, Vuex2) => {
    state.Vuex2 = Vuex2
    console.log(state, 'setVuex2----')
  },
  setVuex3: (state, Vuex3) => {
    state.Vuex3 = Vuex3
    console.log(state, 'setVuex3----')
  },
  setVuex4: (state, Vuex4) => {
    state.Vuex4 = Vuex4
    console.log(state, 'setVuex4----')
  }
}
export default mutations
