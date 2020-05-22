<template>
  <div>
    <Logo :page="page" :vuex_1="1" :vuex_2="true" :vuex_3="page" />
    <el-button>
      Add
    </el-button>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
// import upload from '@/componets/Upload'
let MyTest = {
  name: 'MyTest',
  computed: {
    ...mapGetters
  },
  components: {
    Logo: () => import('components/Logo')
  },
  data () {
    return {
      ...mapGetters,
      page: 'MyTestVuex'
    }
  },
  methods: {
    ...mapMutations(['setHelloWorldMsg']),
    ...mapActions({ AsyncSetHelloWorldMsg: 'AsyncSetHelloWorldMsg' }),
    a: () => {
      var up = this.$refs.upload1
      console.info(up)
    }
  }
}
export default MyTest
</script>
<style scoped>

</style>
