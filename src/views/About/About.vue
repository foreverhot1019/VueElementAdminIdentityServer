<template>
  <div class="hello">
    <Logo :page="page" :vuex_1="2" :vuex_2="false" :vuex_3="page" />
    <h1>{{ msg }}-{{ HelloWorldMsgSetTimes }}</h1>
    <el-button @click="setHelloWorldMsg(page+'-234')">setHelloWorldMsg</el-button>
    <el-button @click="AsyncSetHelloWorldMsg(page+'-456')">AsyncsetHelloWorldMsg</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// import axiosAPI from '@/axiosAPI'

export default {
  name: 'About',
  data () {
    return {
      page: 'About',
      publicPath: `${process.env.BASE_URL}/src/assets`
    }
  },
  components: {
    Logo: () => import('components/Logo')
  },
  methods: {
    ...mapMutations(['setHelloWorldMsg']),
    ...mapActions(['AsyncSetHelloWorldMsg'])
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters({
      msg: 'HelloWorldMsg'
    }),
    ...mapGetters([
      'HelloWorldMsgSetTimes',
      'Vuex1',
      'Vuex2'
    ]),
    ...mapState({
      Vuex3: state => state.Vuex3
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  background-color: #678;
  color: black;
}
</style>
