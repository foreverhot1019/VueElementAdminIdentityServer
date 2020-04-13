<template>
  <div ref="LazyLoading" id="LazyLoading" class="el-row" style="height:100px;">&nbsp;</div>
</template>
<script>
// import { Loading } from 'element-ui'

export default {
  name: 'RouteLoading',
  data () {
    // console.log('RouteLoading-----', this)
    return {
      loading: null,
      opts: {
        lock: true,
        text: '加载中...',
        target: this.$refs.LazyLoading,
        background: 'rgba(0, 0, 0, 0.7)'
      }
    }
  },
  mounted () {
    this.loading = this.$loading(this.opts)
    setTimeout(() => {
      this.loading.close()
    }, this.$store.state.LoadingComponentTimeOut)
    this.$store.commit('setLoadingComponent', this.loading)
    // console.log('mounted', this.$store)
    window.LoadingComponent = this.loading
  }
}
</script>
