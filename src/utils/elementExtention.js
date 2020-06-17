import { objIsEmpty } from '@/utils'
import BaseApi from '@/axiosAPI/BaseApi'

export default {
  el_FormFieldRules: function (rowConfig, isSearchForm) {
    // 是否搜索form
    var tIsSearchForm = typeof (isSearchForm)
    if (tIsSearchForm === 'undefined' || isSearchForm === null || tIsSearchForm !== 'boolean') {
      isSearchForm = false
    }
    var ArrRules = []
    if (!rowConfig.Editable && !isSearchForm) {
      return ArrRules
    }
    if (rowConfig.Required && !isSearchForm && rowConfig.Type !== 'boolean') {
      ArrRules.push({ required: true, message: '请输入' + rowConfig.DisplayName || rowConfig.Name, trigger: ['blur', 'change'] })
    }
    var name = rowConfig.Name.toLowerCase()
    if (name === 'email' || rowConfig.isEmail) {
      ArrRules.push({ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] })
    }
    if (name.indexOf('password') === 0) {
      ArrRules.push({ validator: this.$Validtors.PasswordValidator, trigger: ['blur', 'change'] })
    }
    if (name.indexOf('idcard') === 0 && rowConfig.inputType === 'text') {
      ArrRules.push({ validator: this.$Validtors.IdCardValidator, trigger: 'blur' })
    }
    if (rowConfig.MinLength || rowConfig.MaxLength) {
      var rule = { trigger: ['blur', 'change'] }
      if (rowConfig.MinLength) {
        rule.min = rowConfig.MinLength
        if (rowConfig.MaxLength) {
          rule.message = '字符长度必须介于 ' + rowConfig.MinLength + ' 到 ' + rowConfig.MaxLength + ' 之间'
        } else {
          rule.message = '字符长度 必须大于 ' + rowConfig.MinLength
        }
      }
      if (rowConfig.MaxLength) {
        rule.max = rowConfig.MaxLength
        if (rowConfig.MinLength) {
          rule.message = '字符长度 必须介于 ' + rowConfig.MinLength + ' 到 ' + rowConfig.MaxLength + ' 之间'
        } else {
          rule.message = '字符长度 必须小于 ' + rowConfig.MaxLength
        }
      }
      ArrRules.push(rule)
    }
    return ArrRules
  }, // 输出input验证规则
  el_inputType: function (rowConfig) {
    var elInputType = 'input'
    if (rowConfig.Type === 'number') {
      elInputType = 'input-number'
    }
    if (rowConfig.Type === 'boolean') {
      elInputType = 'checkbox'
    }
    if (rowConfig.Type === 'datetime') {
      elInputType = 'date-picker'
    }
    if (rowConfig.inputType === 'tagedit') {
      return 'TagEdit'
    }
    // ES5 模板替换
    return `el-${elInputType}`// 'el-'+elInputType
  }, // 判断input输出格式
  el_inputProtoType: function (field, isSearchForm) { // el_input-Type属性
    // 是否搜索form
    var tisSearchForm = typeof (isSearchForm)
    if (tisSearchForm === 'undefined' || isSearchForm === null || tisSearchForm !== 'boolean') {
      isSearchForm = false
    }
    let filterData = isSearchForm ? this.filters.filterRules : this.curr_rowdata
    // 设置零时变量，记录$inputType
    if (filterData['$' + field.Name + 'inputType'] === undefined || filterData['$' + field.Name + 'inputType'] === null) {
      if (field.inputType === 'datetime' && isSearchForm) {
        return 'daterange'
      } else {
        return field.inputType
      }
    } else {
      return filterData['$' + field.Name + 'inputType']
    }
  }, // el_input-Type属性
  el_inputClass: function (field) {
    if (field.Name.toLowerCase().indexOf('password') >= 0) {
      let currRowData = this.curr_rowdata
      let name = '$' + field.Name + 'pswView'
      let inputClass = { 'fa-eye-slash': false, 'fa-eye': currRowData[name] }
      if (currRowData[name] === undefined || currRowData[name] === null) {
        inputClass['fa-eye-slash'] = true
      } else {
        inputClass['fa-eye-slash'] = !currRowData[name]
        inputClass['fa-eye'] = currRowData[name]
      }
      return inputClass
    } else {
      return { 'el-icon-edit': true }
    }
  }, // password 显示/隐藏 class
  pswView: function (field) { // 密码框 显示隐藏
    var pswView = '$' + field.Name + 'pswView'
    var inputType = '$' + field.Name + 'inputType'
    if (this.curr_rowdata[pswView] === undefined || this.curr_rowdata[pswView] === null) {
      this.$set(this.curr_rowdata, pswView, true)
      this.$set(this.curr_rowdata, inputType, 'text')
    } else if (!this.curr_rowdata[pswView]) {
      this.curr_rowdata[pswView] = true
      this.curr_rowdata[inputType] = 'text'
    } else {
      this.curr_rowdata[pswView] = false
      this.curr_rowdata[inputType] = 'password'
    }
  }, // 密码框 显示隐藏
  keydown: function (e) { // dom原生控件keydown事件 v-on:keydown.native='keydown'
    return true
    // var event = e || window.event // 事件
    // var keycode = event.keycode || event.which // 键码
    // // 取消事件冒泡(W3C)
    // if (event && event.stopPropagation)
    //   event.stopPropagation()
    // else
    //   // IE中取消事件冒泡
    //   window.event.cancelBubble = true
    // // 阻止默认浏览器动作(W3C)
    // if (event && event.preventDefault)
    //   event.preventDefault()
    // else // IE中阻止函数器默认动作的方式
    //   window.event.returnValue = false
    // console.log('keydown', event, this)
    // event.returnValue = false
    // // window.event.returnValue = false
    // return false
  }, // dom原生控件keydown事件 v-on:keydown.native='keydown'
  keydownInt: function (e) {
    // var input =$(e.target);
    // var startPos = input.selectionStart;
    // var endPos = input.selectionEnd;
    // console.log('keydownInt',e,input,startPos,endPos);
    // e.stopPropagation();//停止冒泡
    // var value = e.target.value
    var key = e.key
    if (key === '.') {
      e.preventDefault()// 阻止原生事件
      return false
    }
  }, // 数字类型keydown
  keydownFloat: function (e, precision) {
    // console.log('keydownFloat',e);
    // e.stopPropagation();//停止冒泡
    var value = e.target.value
    var key = e.key
    if (objIsEmpty(precision)) {
      if (key === '.') {
        e.preventDefault() // 阻止原生事件
        return false
      }
    } else {
      precision = parseInt(precision)
      if (isNaN(precision)) {
        if (key === '.') {
          e.preventDefault() // 阻止原生事件
          return false
        }
      } else {
        var idx = value.indexOf('.')
        if (idx > 0) {
          var pointStr = value.slice(idx)
          if (pointStr.length >= precision + 1) {
            e.preventDefault() // 阻止原生事件
            return false
          }
        }
      }
    }
  }, // 浮点数字类型keydown
  // 导出 导入 Excel
  ExportXls: function (JsonData, fileName) {
    // console.log('ExportXls')
    let title = this.title
    require(['xlsx', 'file-saver'], function (XLSX, FileSaver) {
      let sheetName = title
      let wb = XLSX.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
      let ws = XLSX.utils.json_to_sheet(JsonData)
      wb.SheetNames.push(sheetName)
      wb.Sheets[sheetName] = ws
      const defaultCellStyle = { font: { name: 'Verdana', sz: 13, color: 'FF00FF88' }, fill: { fgColor: { rgb: 'FFFFAA00' } } }// 设置表格的样式
      let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } // 配置参数和样式
      // let wb = XLSX.utils.table_to_book(thisVue.$refs['Mytb'])
      /* get binary string as output */
      let wbout = XLSX.write(wb, wopts)
      try {
        const s2ab = function (s) { // 字符串转字符流
          if (typeof ArrayBuffer !== 'undefined') {
            var buf = new ArrayBuffer(s.length)
            var view = new Uint8Array(buf)
            for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
            return buf
          } else {
            var buff = new Array(s.length)
            for (var x = 0; x !== s.length; ++x) buff[x] = s.charCodeAt(x) & 0xFF
            return buff
          }
        }
        FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName + '.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    })
  }, // 导出数据
  ImportXls: function () {
    // console.log('ImportXls')
  }, // 导入数据
  formatter: function (field) { // el-table-column 数据显示转换
    var formatter = null
    switch (field.Type) {
      case 'boolean':
        formatter = this.$formatter.boolformatter
        break
      case 'date':
        formatter = this.$formatter.dateformatter
        break
      case 'datetime':
        formatter = this.$formatter.datetimeformatter
        break
      default:
        formatter = null
        break
    }
    var lowerName = field.Name.toLowerCase()
    if (lowerName.indexOf('sex') === 0) {
      formatter = this.$formatter.Sexformatter
    }
    if (!objIsEmpty(field.ForeignKeyGetListUrl)) {
      formatter = this.$formatter.joinformatter
    }
    // if (lower_Name.indexOf('photo') >= 0){
    //    formatter = this.$formatter.photoformatter
    // }
    return formatter
  }, // el-table-column 数据显示转换
  el_remoteMethod: function (query, field, profx, forceload) {
    let thisVue = this
    let ArrOptionName = field.Name + '_' + profx
    if (!objIsEmpty(query) || !objIsEmpty(forceload)) {
      thisVue.el_selt.el_selt_loading = true
      var paramData = { Searhfilter: JSON.stringify([{ field: 'q', op: 'equals', value: query }]) }
      let url = field.ForeignKeyGetListUrl// '/MenuItems/GetData'
      BaseApi.Get(paramData, url).then(res => {
        let { rows } = res
        try {
          if (typeof thisVue.el_selt[ArrOptionName] === 'undefined') {
            thisVue.$set(thisVue.el_selt, ArrOptionName, {})
          }
          if (objIsEmpty(rows)) {
            thisVue.$set(thisVue.el_selt[ArrOptionName], 'ArrOption', res)
          } else {
            thisVue.$set(thisVue.el_selt[ArrOptionName], 'ArrOption', rows)
          }
        } catch (e) {
          thisVue.$message({
            duration: 0, // 不自动关闭
            showClose: true,
            message: '数据处理，出现错误',
            type: 'error'
          })
        }
        thisVue.el_selt.el_selt_loading = false// 加载完毕
      }).catch(err => {
        thisVue.el_selt.el_selt_loading = false// 加载完毕
        thisVue.$message({
          duration: 0, // 不自动关闭
          showClose: true,
          message: `获取数据出现错误:${err}`,
          type: 'error'
        })
      })
    } else {
      if (typeof thisVue.el_selt[ArrOptionName] === 'undefined') {
        thisVue.el_selt[ArrOptionName] = {}
      }
      thisVue.el_selt[ArrOptionName]['ArrOption'] = []
    }
  } // 外键触发搜索
}
