<template>
  <div id="div_TagEdit">
    <template v-for="(tag,index) in ArrTag">
      <el-tag :closable="Editable" :key="tag"
        :disable-transitions="Editable" style="margin-right:3px;"
        @close="handleClose(index)">
        {{tag}}
      </el-tag>
    </template>
    <el-input v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
      :maxlength="MaxLength" :show-word-limit="true" style="width: 50%"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"></el-input>
    <el-button v-else @click="showInput" :disabled="!Editable"><i class="fa fa-tags">New</i> </el-button>
  </div>
</template>
<script>
export default {
  props: {
    Tags: { // tag标签集合
      type: Array,
      required: false
    },
    editable: { // 可编辑
      type: Boolean,
      Default: false
    },
    inputwidth: { // 编辑框宽度
      type: Number,
      Default: 100
    },
    maxlength: {
      type: Number,
      Default: 20
    }
  },
  model: {
    prop: 'Tags',
    event: 'change'
  },
  created: function () {
    console.log(this.maxlength)
    // this.$set(this, 'ArrTag', this.Tags)
    // let thisVue = this
    // thisVue.set(thisVue, 'ArrTag', thisVue.Tags)
    // this.ArrTag = this.Tags
  },
  data () {
    console.log('maxlength', this.maxlength)
    return {
      ArrTag: [],
      inputVisible: false,
      inputValue: '',
      Editable: this.editable,
      Width: this.inputwidth,
      MaxLength: this.maxlength
    }
  },
  watch: {
    Tags: { // 防止第二次修改prop时数据未及时传递过来
      handler: function (newval, oldval) {
        this.ArrTag = newval
      },
      immediate: true
    }
    // ArrTag: {
    //   handler: function (newval, oldval) {
    //     this.Tags = newval
    //   },
    //   immediate: true,
    //   deep: true
    // }
  }, // 监听属性变化
  methods: {
    handleClose (tagIdx) {
      this.ArrTag.splice(tagIdx, 1)
      this.$emit('change', this.ArrTag) // 触发 v-model 修改
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () { // 判断是否重复
      let inputValue = this.inputValue
      if (inputValue) {
        // 判断重复
        let hasTag = this.ArrTag.filter(x => {
          return x === inputValue
        })
        if (hasTag.length <= 0) {
          this.ArrTag.push(inputValue)
          this.$emit('change', this.ArrTag) // 触发 v-model 修改
        } else {
          return false
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
