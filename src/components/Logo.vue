<template>
  <div>
    <h1 style="color:red">{{ pageName }} page</h1>
    Vuex1: {{ Vuex1 }}
    Vuex2: {{ Vuex2 }}
    Vuex3: {{ Vuex3 }}
    Vuex4: {{ Vuex4 }}
    <img alt="Vue logo" src="../assets/logo.png">
    <i class="fa fa-quora" aria-hidden="true"></i>
    <el-date-picker type="datetime" placeholder="选择日期时间" v-model="My_Date"></el-date-picker>
    <el-button type="success" icon="el-icon-fa fa-quora">成功按钮</el-button>
  </div>
</template>
<script type="text/javascript">
import { mapState, mapGetters, mapMutations } from 'vuex'

var Logo = {
  name: 'Logo',
  props: {
    page: String,
    Vuex_1: Number,
    Vuex_2: Boolean,
    Vuex_3: String
  },
  data () {
    return {
      My_Date: new Date(),
      pageName: this.page,
      publicPath: `${process.env.BASE_URL}/src/assets`
    }
  },
  mounted () { // mounted：组件渲染完成之后，created：组件渲染完成之前
    this.setVuex1(this.Vuex_1)
    this.setVuex2(this.Vuex_2)
    this.setVuex3(this.Vuex_3)
  },
  methods: {
    ...mapMutations(['setVuex1', 'setVuex2', 'setVuex3'])
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'Vuex1',
      'Vuex2'
    ]),
    ...mapState({
      Vuex3: state => state.Vuex3,
      Vuex4: state => state.Vuex4 === 'undefined' ? '' : state.Vuex4
    })
  }
}
console.log(Logo)
export default Logo
</script>
