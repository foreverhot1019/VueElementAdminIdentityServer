<template>
    <div ref="LazyLoading" id="LazyLoading" class="el-row myloading">
      &nbsp;
    </div>
</template>
<script>
export default {
  name: 'LazyLoading',
  mounted: function () {
    // console.log('LazyLoading-mounted', this);
    this.$loading({
      lock: true,
      text: this.LoadMsg,
      target: this.$refs.LazyLoading, // document.querySelector("#LazyLoading"),
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }, // 相当于构造函数，渲染完dom后触发
  data: function () {
    return {
      LoadMsg: '加载中...'
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  $heght: 80px;
  @mixin calc-width($w){
    width: $w / 750 * 100;
  }
  @mixin calc-height($h){
    height: $h / 750 * 100;
  }
  .myloading {
    height: calc(100vh - #{$heght});
  }
</style>
