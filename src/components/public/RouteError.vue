<template>
  <div class="el-row" style="padding-top:3px;margin-top:5px;height:50px; border:1px solid #dcdfe6;">
    <div style="width:100px; margin:auto;color:red;">加载失败...</div>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'RouteError',
  data () {
    // console.log('RouteError-----')
    return {
      ErrMsg: '加载路由失败',
      opts: {
        message: '加载路由失败',
        type: 'error',
        duration: 5000,
        showClose: true
      }
    }
  },
  mounted () {
    this.opts.message = this.ErrMsg
    Message(this.opts)
  }
}
</script>
