<template>
  <div class="hello">
    <Logo :page="page" :vuex_1="3" :vuex_2="true" :vuex_3="page" />
    <h1>{{ msg }}-{{ HelloWorldMsgSetTimes }}</h1>
    <el-button @click="setMsg('234')">setHelloWorldMsg</el-button>
    <el-button @click="AsyncSetHelloWorldMsg(page+'-456')">AsyncsetHelloWorldMsg</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import axiosAPI from '@/axiosAPI'

export default {
  name: 'Contact',
  data () {
    return {
      page: 'Contact',
      publicPath: `${process.env.BASE_URL}/src/assets`
    }
  },
  components: {
    Logo: () => import('components/Logo')
  },
  mounted () {
    console.log(axiosAPI)
    var thisVue = this
    axiosAPI.TestPost('admin').then(data => {
      thisVue.set('axiosAPITestPostData', data)
    }, err => {
      console.log(thisVue.page, err)
    })
  },
  methods: {
    ...mapMutations(['setHelloWorldMsg', 'setVuex4']),
    ...mapActions(['AsyncSetHelloWorldMsg']),
    setMsg (msg) {
      this.setHelloWorldMsg(this.page + '-' + msg)
      this.setVuex4('vuex4')
    }
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
  background-color:#678;
  color: white;
}
</style>
<style scoped lang="scss">
  $--color-success: "#67C23A";
</style>
