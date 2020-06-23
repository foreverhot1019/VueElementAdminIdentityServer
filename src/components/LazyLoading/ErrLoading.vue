<template>
    <div ref="errLoading" class="el-row myErr">
        <div style="width:100px; margin:auto;color:red;">{{errMsg}}</div>
    </div>
</template>
<script>
export default {
  name: 'ErrLoading',
  data: function () {
    return {
      errMsg: '加载失败...'
    }
  }
}
</script>
<style lang="scss" scoped>
  $heght: 80px;
  .myErr {
    padding-top: 3px;
    margin-top: 5px;
    height: calc(100vh- #{$heght});
    border: 1px solid #dcdfe6;
  }
</style>
