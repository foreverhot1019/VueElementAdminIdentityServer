<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      NavWidth: '200px'
    }
  }
}
</script>

<!-- Element-UI支持font-awesome图标 less模式 -->
<style lang="less">
  [class^="el-icon-fa"], [class*=" el-icon-fa"] {
    font-family: "FontAwesome" !important;
    display: inline-block;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  @fa-css-prefix: el-icon-fa;
</style>
