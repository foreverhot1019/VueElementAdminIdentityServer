<template>
  <el-row class="tac">
    <el-col :span="24">
      <i class="fa fa-quora"></i>
      <h5>默认颜色</h5>
      <MenuItem />
    </el-col>
  </el-row>
</template>

<script>
import MenuItem from './MenuItem'

export default {
  components: {
    MenuItem
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
