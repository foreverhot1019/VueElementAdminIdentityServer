<template>
  <div class="hello">
    <Logo :page="page" :vuex_1="1" :vuex_2="true" :vuex_3="page" />
    <h1>{{ Msg }}-{{ HelloWorldMsgSetTimes }}</h1>
    <p>
      <el-button @click="setHelloWorldMsg(page+'-234')" icon="el">setHelloWorldMsg</el-button>
      <el-button @click="AsyncSetHelloWorldMsg(page+'-456')">AsyncsetHelloWorldMsg</el-button>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

var home = {
  name: 'Home',
  data () {
    return {
      page: 'Home',
      publicPath: `${process.env.BASE_URL}/src/assets`
    }
  },
  components: {
    Logo: () => import('components/Logo')
  },
  methods: {
    ...mapMutations(['setHelloWorldMsg']),
    ...mapActions({ AsyncSetHelloWorldMsg: 'AsyncSetHelloWorldMsg' })
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters({
      Msg: 'HelloWorldMsg'
    }),
    ...mapState({
      HelloWorldMsgSetTimes: state => state.HelloWorldMsgSetTimes
    })
  }
}
console.log(home)
export default home

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  background-color: #678;
  color: red;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
