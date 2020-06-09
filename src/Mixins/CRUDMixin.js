import { objIsEmpty } from '@/utils'
import BaseApi from '@/axiosAPI/BaseApi'
import moment from 'moment'

// 自定义列数据(覆盖BaseArrField-ArrField行值)
let CustomerFields = {
  // "Currency":{
  //    DisplayName: "授权币制",//显示名称
  //    Editable: true, //可编辑
  //    ForeignKeyGetListUrl: '/PARA_CURRs/GetPagerPARA_CURR_FromCache', //获取外键数据Url
  //    FormOrder: 0, //Form排序
  //    FormShow: true, //Form中展示
  //    IsForeignKey: true, //外键
  //    IsKey: false, //主键
  //    ListOrder: 0, //列表排序
  //    ListShow: true, //列表展示
  //    MaxLength: 50, //最大长度
  //    MinLength: 0, //最小长度
  //    Name: "Currency", //名称
  //    //Type为number时，可设置小数位
  //    Required: false, //必填
  //    SearchOrder: 0, //搜索排序
  //    SearchShow: true, //搜索中展示
  //    Sortable: true, //是否可排序
  //    Type: "string", //"datetime/number/string/boolean";//类型
  //    Width_List: "120", //列表-列宽度 <=0 默认*，>0 此宽度为准
  //    Width_input: "178", //Form-input宽度 <=0 默认*，>0 此宽度为准
  //    inputType: "text", //"password/datetime/text";//form中的input类型
  // }
}
let ArrFormField = [] // 记录所有编辑字段
let ArrListField = [] // 记录所有字段
let ArrSearchField = [] // 记录所有搜索字段
let ArrTagEditField = [] // 记录所有数组字段
// 枚举类型字段
let BaseArrField = {
  IsFormOrder: false, // 添加/编辑字段 排序
  IsListOrder: false, // 列表字段 排序
  IsSearchOrder: false, // 搜索字段 排序
  ArrField: [], // 所有字段
  get GetArrField () {}, // 获取值 处理
  set SetArrField (value) { // 设置值 处理
    ArrFormField.splice(0, ArrFormField.length) // 记录所有编辑字段
    ArrListField.splice(0, ArrListField.length) // 记录所有字段
    ArrSearchField.splice(0, ArrSearchField.length) // 记录所有搜索字段
    ArrTagEditField.splice(0, ArrTagEditField.length) // 记录所有数组字段
    BaseArrField.ArrField = value
    if (!objIsEmpty(value)) {
      // 列表/编辑/搜索 字段集合
      value.forEach((item, idx) => {
        if (item.FormShow && !item.IsKey) {
          ArrFormField.push(item)
        }
        if (item.FormOrder > 0) {
          this.IsListOrder = true
        }
        if (item.ListShow && !item.IsKey) {
          ArrListField.push(item)
        }
        if (item.IsListOrder > 0) {
          this.IsListOrder = true
        }
        if (item.SearchShow && !item.IsKey) {
          ArrSearchField.push(item)
        }
        if (item.SearchOrder > 0) {
          this.IsSearchOrder = true
        }
        if (item.inputType === 'tagedit') {
          ArrTagEditField.push(item)
        }
      })
    }
    if (BaseArrField.IsFormOrder) {
      ArrFormField = ArrFormField.sort((a, b) => {
        if (a.FormOrder === b.FormOrder) {
          return a.Name - b.Name
        } else {
          return a.FormOrder - b.FormOrder
        }
      })
    }
    if (BaseArrField.IsListOrder) {
      ArrListField = ArrListField.sort((a, b) => {
        if (a.ListOrder === b.ListOrder) {
          return a.Name - b.Name
        } else {
          return a.ListOrder - b.ListOrder
        }
      })
    }
    if (BaseArrField.IsSearchOrder) {
      ArrSearchField = ArrSearchField.sort((a, b) => {
        if (a.SearchOrder === b.SearchOrder) {
          return a.Name - b.Name
        } else {
          return a.SearchOrder - b.SearchOrder
        }
      })
    }
    // 设置自定义列
    Object.entries(CustomerFields).forEach(([item, value]) => {
    // Object.keys(CustomerFields).forEach((item, index) => {
      let OField = BaseArrField.ArrField.filter(val => {
        return val.Name === item
      })
      if (OField.length > 0) {
        // OField = OField[0]
        // let CusField = CustomerFields[item]
        Object.assign(OField[0], value)
      }
    })
  }
}
// 返回Vue 混入
var cRUDMixin = {
  directives: {}, // 注册局部指令
  created: function () {
    let thisVue = this
    thisVue.$set(thisVue, 'ArrFormField', [])
    thisVue.$set(thisVue, 'ArrListField', [])
    thisVue.$set(thisVue, 'ArrSearchField', [])
    thisVue.$set(thisVue, 'ArrTagEditField', [])
    let ArrFormField = thisVue.ArrFormField // 添加/编辑字段 通过此配置渲染
    let ArrListField = thisVue.ArrListField // table展示列 通过此配置渲染
    let ArrSearchField = thisVue.ArrSearchField // 搜索字段数据通过此配置渲染
    let ArrTagEditField = thisVue.ArrTagEditField // 所有数组编辑字段

    if (!objIsEmpty(thisVue.Fields)) {
      // 列表/编辑/搜索 字段集合
      thisVue.Fields.forEach((item, idx) => {
        if (item.FormShow && !item.IsKey) {
          ArrFormField.push(item)
        }
        if (item.FormOrder > 0) {
          this.IsListOrder = true
        }
        if (item.ListShow && !item.IsKey) {
          ArrListField.push(item)
        }
        if (item.IsListOrder > 0) {
          this.IsListOrder = true
        }
        if (item.SearchShow && !item.IsKey) {
          ArrSearchField.push(item)
        }
        if (item.SearchOrder > 0) {
          this.IsSearchOrder = true
        }
        if (item.inputType === 'tagedit') {
          ArrTagEditField.push(item)
        }
      })
    }
    thisVue.ArrEnumField = thisVue.Fields.filter(function (val) {
      return val.IsForeignKey
    })// 所有select/枚举
    thisVue.ArrEnumField.forEach(function (item) { // 所有select枚举
      thisVue.el_remoteMethod('', item, 'search', true)
      thisVue.el_remoteMethod('', item, 'form', true)
    })
    // thisVue.ArrTagEditField = thisVue.Fields.filter(function (field) {
    //   return field.inputType === 'tagedit' && field.Editable
    // })// 所有数组编辑字段
  }, // 数据初始化，还未渲染dom,在此处设置的数据 不受响应
  mounted: function () {
    // document.querySelector('#div_Loading').hidden = true // 必须得有，不然一直显示加载中。。。
    this.tb_GetData() // table数据初始化
    this.$set(this.el_selt, 'el_selt_loading', false) // 选择框loding状态
    /* 设置属性不能修改 相当于const  {value:{}}等价于 {value : {},writable : false,configurable : false,enumerable : false} */
    Object.defineProperty(this, 'UserRoles', { value: {} })
    var setterFunc = function (newVal) {
      var err = '不允许修改值'
      if (typeof (console) === 'undefined') {
        alert(err)
      } else {
        console.log(err)
      }
    }
    const Edit = this.$route.meta.Edit || false // 修改
    const Create = this.$route.meta.Create || false // 创建
    const Delete = this.$route.meta.Delete || false // 删除
    const Audit = this.$route.meta.Edit || false // 审核
    const Import = this.$route.meta.Import || false // 导入
    const Export = this.$route.meta.Export || false // 导出
    Object.defineProperty(this.UserRoles, 'Edit', { configurable: false, get: function () { return Edit }, set: setterFunc })
    Object.defineProperty(this.UserRoles, 'Create', { configurable: false, get: function () { return Create }, set: setterFunc })
    Object.defineProperty(this.UserRoles, 'Delete', { configurable: false, get: function () { return Delete }, set: setterFunc })
    Object.defineProperty(this.UserRoles, 'Audit', { configurable: false, get: function () { return Audit }, set: setterFunc })
    Object.defineProperty(this.UserRoles, 'Import', { configurable: false, get: function () { return Import }, set: setterFunc })
    Object.defineProperty(this.UserRoles, 'Export', { configurable: false, get: function () { return Export }, set: setterFunc })
  }, // 相当于构造函数，渲染完dom后触发
  filters: { // v-bind可以使用，v-model 无效
  }, // 数据过滤器
  data: function () {
    var tb = {
      tbUrl: {
        controller: 'a',
        exportExcel: 'ExportExcel', // 导出Excel action
        importExcel: 'Upload' // 导入Excel action
      },
      AddNum: 0, // 新增序号
      method: 'post', // HTTP请求方法
      tbLoading: true, // 加载中
      addRows: [], // 新增的行
      selctRows: [], // 选中行
      curr_rowdata: {}, // 当前选择的行
      curr_rowdata_Original: {}, // 当前行原始数据
      centerDialogVisible: false, // 弹出框是否打开
      dlgLoading: false, // 弹出框加载状态
      formLabelWidth: '120px',
      tableData: [],
      UserRoles: {} // 权限
    }
    var pagiNation = { // 翻页控件数据
      pageSizes: [1, 10, 20, 50, 100, 200, 300, 500],
      pageSize: 10,
      currentPage: 1,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0
    }
    var filters = { // 搜索数据
      page: pagiNation.currentPage,
      rows: pagiNation.pageSize,
      sort: 'Id',
      order: 'desc',
      filterRules: {}// 查询条件
    }
    tb.pagiNation = pagiNation
    tb.filters = filters
    tb.ArrFormField = [] // ArrFormField // 添加/编辑字段 通过此配置渲染
    tb.ArrListField = [] // ArrListField // table展示列 通过此配置渲染
    tb.ArrSearchField = [] // ArrSearchField // 搜索字段数据通过此配置渲染
    tb.ArrTagEditField = [] // ArrTagEditField // 搜索字段数据通过此配置渲染
    // tb.valid_rules = valid_rules
    // el-select 搜索框数据
    tb.el_selt = {
      // el_selt_loading : false, // 选择框 搜索状态
      // 'CompanyId_form':{ArrOption : []}, // 选择框 数据
    }
    return tb
  }, // 数据集
  computed: { // 计算属性
    dgTitle: function () {
      // debugger
      this.UserRoles.Edit = false// 修改不了 writable 为 false 属性const化
      // Object.defineProperty(this.UserRoles,'Edit',{configurable:true,writable:true})
      // Object.defineProperty(this.UserRoles,'Edit',{value:false})
      // var tCurrRowData = typeof (this.curr_rowdata)
      // if (tCurrRowData === 'undefined' || this.curr_rowdata === null || JSON.stringify(this.curr_rowdata) === '{}') {
      if (objIsEmpty(this.curr_rowdata)) {
        return '未知'
      }
      if (this.curr_rowdata.Id <= 0) {
        return '新增'
      } else {
        if (this.UserRoles.Edit) {
          return '编辑/查看'
        } else {
          return '查看'
        }
      }
    }
  }, // 计算属性
  watch: { // 监听属性变化
    // pagiNation:{ // 深度监听，可监听到对象、数组的变化
    //     handler(val, oldVal){
    //         console.log('b.c: '+val.c, oldVal.c)// 但是这两个值打印出来却都是一样的
    //     },
    //     immediate: true, // 将立即以表达式的当前值触发回调
    //     deep:true
    // },
    'pagiNation.currentPage': {
      handler: function (newValue, oldValue) {
        this.filters.page = newValue
        this.tb_GetData()// 重新获取数据
      }
    },
    'pagiNation.pageSize': {
      handler: function (newValue, oldValue) {
        this.filters.rows = newValue
        if (this.pagiNation.currentPage === 1) {
          this.tb_GetData()// 重新获取数据
        } else {
          this.pagiNation.currentPage = 1
        }
      }
    }
  }, // 监听属性变化
  methods: {
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
      if (rowConfig.Required && !isSearchForm) {
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
    tb_GetData: function (e) { // 获取数据
      let thisVue = this
      thisVue.tbLoading = true// 加载中
      var filterData = this.filters// 获取搜索条件值
      // console.log('tb_GetData', filterData, e)
      // let url = this.tbUrl.controller + this.tbUrl.getdata
      var paramData = Object.assign({}, filterData)
      var SearchFilter = thisVue.getSearchFilter()// 搜索{}转换为[]
      paramData.Searhfilter = JSON.stringify(SearchFilter)
      BaseApi.Get(paramData).then(function (res) { // 成功
        try {
          let { rows, total } = res
          console.log(res)
          thisVue.tableData = rows
          thisVue.pagiNation.total = total
        } catch (e) {
          thisVue.$message({
            duration: 0, // 不自动关闭
            showClose: true,
            message: '数据处理，出现错误',
            type: 'error'
          })
        }
        thisVue.tbLoading = false// 加载完毕
      }).catch(function (error) { // 错误
        thisVue.tbLoading = false // 加载完毕
        thisVue.$message({
          duration: 0, // 不自动关闭
          showClose: true,
          message: `获取数据出现错误:${error}`,
          type: 'error'
        })
      })
    }, // 获取数据
    getSearchFilter: function () { // 搜索条件{}转换为[]
      var ArrFilter = []
      var filterRules = Object.assign({}, this.filters.filterRules)
      if (!(typeof (filterRules) === 'undefined' || filterRules === null || filterRules === JSON.parse('{}'))) {
        var ArrKey = Object.keys(filterRules)
        for (var i in ArrKey) {
          var key = ArrKey[i]
          var value = filterRules[key]
          if (Array.isArray(value)) {
            ArrFilter.push({ field: '_' + key, op: 'equals', value: value[0] })
            ArrFilter.push({ field: key + '_', op: 'equals', value: value[1] })
          } else {
            ArrFilter.push({ field: key, op: 'equals', value: value })
          }
        }
      }
      return ArrFilter
    }, // 搜索条件{}转换为[]
    search: function () {
      var thisVue = this
      this.$refs['tb_search'].validate(function (valid) {
        if (valid) {
          thisVue.pagiNation.currentPage === 1 ? thisVue.tb_GetData() : thisVue.pageCurrentChange(1)
        }
      })
    }, // 搜索
    resetFilter: function (searchForm) {
      this.$refs[searchForm].resetFields()
      if (this.pagiNation.currentPage === 1) {
        this.tb_GetData()
      } else {
        this.pageCurrentChange(1)// 重新获取数据
      }
    }, // 重设搜索条件
    handleViewClick: function (row) {
      // console.log('row',row)
    }, // 行查看按钮
    handledblclick: function (row) {
      this.centerDialogVisible = true
      this.curr_rowdata_Original = row// 原始行数据
      this.curr_rowdata = Object.assign({}, row)
      let currRowData = this.curr_rowdata
      let ArrEnumField = this.ArrEnumField// 所有select/枚举
      let thisVue = this
      Object.keys(this.curr_rowdata).forEach(function (item, index) {
        let val = currRowData[item] + ''
        if (!objIsEmpty(val)) {
          if (val.indexOf('/Date(') >= 0) {
            // eslint-disable-next-line new-cap
            var d = new moment(val)
            if (d.isValid()) {
              currRowData[item] = d.toDate()
            }
          }
          var ArrFilter = ArrEnumField.filter(function (field) { return field.Name === item })
          if (ArrFilter.length > 0) {
            let OFilter = ArrFilter[0]
            let url = OFilter.ForeignKeyGetListUrl// '/MenuItems/GetData'
            if (!objIsEmpty(url) && url.indexOf('GetPagerEnum') < 0) {
              thisVue.el_remoteMethod(val, OFilter, 'form', false)
            }
          }
        } else {
          var qArrTagEdit = thisVue.ArrTagEditField.filter(function (field) { return field.Name === item })
          if (qArrTagEdit.length > 0) {
            currRowData[item] = []
          }
        }
      })
      thisVue.ArrTagEditField.forEach(item => {
        let tagVal = thisVue.curr_rowdata[item.Name]
        if (objIsEmpty(tagVal)) {
          thisVue.curr_rowdata[item.Name] = []
        }
      })
      // console.log('row-dblclick',row)
    }, // 双击行
    handleAddRow: function (e) {
      let thisVue = this
      // console.log('handleAddRow',e)
      thisVue.centerDialogVisible = true
      thisVue.curr_rowdata = { Id: --this.AddNum }
      thisVue.dlgLoading = false
      // 赋值数据编辑新值
      thisVue.ArrTagEditField.forEach(field => {
        if (field.inputType === 'tagedit') {
          thisVue.curr_rowdata[field.Name] = []
        }
      })
    }, // 增加行数据 弹出框添加
    deleteRow: function (index, row) {
      // this.tableData.splice(index, 1)
      // var batchSaveData = {} // 批量操作数据
      var thisVue = this
      // batchSaveData.deleted = [row]
      // var url = thisVue.tbUrl.controller + thisVue.tbUrl.batchSave // 批量保存url
      thisVue.tbLoading = true // 加载中
      // 提交数据
      BaseApi.Delete(row.Id).then(res => {
        thisVue.tbLoading = false // 加载完毕
        if (res.Success) {
          thisVue.tb_GetData() // 删除数据后，重新获取数据
        } else {
          thisVue.$message({
            duration: 0, // 不自动关闭
            showClose: true,
            message: '删除错误:' + res.ErrMsg,
            type: 'error'
          })
        }
      }).catch(err => {
        thisVue.tbLoading = false // 加载完毕
        thisVue.$message({
          duration: 0, // 不自动关闭
          showClose: true,
          message: `删除数据，出现错误${err.ErrMsg}`,
          type: 'error'
        })
      })
    }, // 行删除按钮-删除行搜索条件
    handledelSeltRow: function (e) {
      // console.log('handledelSeltRow', e, this.selctRows)
      if (this.selctRows.length <= 0) {
        this.$message({
          duration: 0, // 不自动关闭
          showClose: true,
          message: '错误:未选择需要删除的数据',
          type: 'error'
        })
      } else {
        var thisVue = this
        thisVue.tbLoading = true // 加载中
        let ArrDelPromiseFunc = [] // 记录删除数据方法
        thisVue.selctRows.forEach(item => {
          let DelFunc = BaseApi.Delete(item.Id)
          ArrDelPromiseFunc.push(DelFunc)
        })
        Promise.all(ArrDelPromiseFunc).then(ArrRes => {
          thisVue.tbLoading = false // 加载完毕
          let errSome = ArrRes.filter(val => {
            return !val.Success
          }).map(val => {
            return val.ErrMsg
          })
          if (errSome.length > 0) {
            thisVue.$message({
              duration: 0, // 不自动关闭
              showClose: true,
              message: '删除错误:' + errSome.join(';'),
              type: 'error'
            })
          } else {
            thisVue.tb_GetData() // 删除数据后，重新获取数据
          }
        }).catch(ArrErr => {
          thisVue.tbLoading = false // 加载完毕
          thisVue.$message({
            duration: 0, // 不自动关闭
            showClose: true,
            message: `删除数据，出现错误:${ArrErr.map(x => { return x.ErrMsg }).join(',')}`,
            type: 'error'
          })
        })
      }
      // rows.splice(index, 1)
    }, // 删除选中行数据
    handleSelectionChange: function (selections) {
      this.selctRows = selections
      // console.log('handleSelectionChange',selections)
    }, // 选择数据变更
    tbSortChange: function (sortObj) { // {column:列,prop:字段,sort:排序}
      // console.log('tbSortChange', sortObj)
      var IsReload = false
      if (!(typeof (sortObj) === 'undefined' || sortObj === null || JSON.stringify(sortObj) === '{}')) {
        var sort = sortObj.prop
        if (!(typeof (sortObj.prop) === 'undefined' || sortObj.prop === null || sortObj.prop === '')) {
          sort = sortObj.prop
        } else {
          sort = 'Id'
        }
        var order = sortObj.order
        if (!(typeof (order) === 'undefined' || order === null || order === '')) {
          order = sortObj.order.replace('ending', '')
        } else {
          order = 'desc'
        }
        if (this.filters.sort !== sort || this.filters.order !== order) {
          IsReload = true
          this.filters.sort = sort
          this.filters.order = order
        }
      } else {
        if (this.filters.sort !== 'Id' || this.filters.order !== 'descending') {
          IsReload = true
        }
        this.filters.sort = 'Id'
        this.filters.order = 'desc'
      }
      if (IsReload) {
        if (this.pagiNation.currentPage === 1) {
          this.tb_GetData()
        } else {
          this.pageCurrentChange(1)// 重新获取数据
          // this.tb_GetData()
        }
      }
    }, // table排序变更
    dlgClose: function () { // 弹出框关闭时触发
      Object.assign(this.curr_rowdata, this.curr_rowdata_Original)
    }, // 弹出框关闭时触发
    dlgSubmit: function (e) {
      let thisVue = this
      let MyForm = this.$refs['MyForm']
      // MyForm.resetFields()// 清除验证
      MyForm.clearValidate()// 清除验证
      MyForm.validate(function (valid) {
        if (valid) {
          thisVue.dlgLoading = true// 弹出框加载中
          var batchSaveData = { // 批量操作数据
            inserted: [],
            deleted: [],
            updated: []
          }
          let postData = thisVue.curr_rowdata
          if (postData.Id <= 0) {
            batchSaveData.inserted.push(postData)
          } else {
            batchSaveData.updated.push(postData)
          }
          let ArrPromiseFunc = [] // 记录异步方法
          batchSaveData.inserted.forEach((item, index) => {
            item.Id = item.Id + ''
            let AddFunc = BaseApi.Add(item)
            ArrPromiseFunc.push(AddFunc)
          })
          batchSaveData.updated.forEach((item, index) => {
            let EditFunc = BaseApi.Edit(item.Id, item)
            ArrPromiseFunc.push(EditFunc)
          })
          Promise.all(ArrPromiseFunc).then(ArrRes => {
            thisVue.dlgLoading = false // 弹出框加载完毕
            let errSome = ArrRes.filter(val => {
              return !val.Success
            }).map(val => {
              return val.ErrMsg
            })
            if (errSome.length > 0) {
              thisVue.$message({
                duration: 0, // 不自动关闭
                showClose: true,
                message: '提交错误:' + errSome.join(';'),
                type: 'error'
              })
            } else {
              thisVue.centerDialogVisible = false // 显示/关闭弹出框
              // 新增数据时，重新获取数据
              if (thisVue.curr_rowdata.Id <= 0) {
                if (thisVue.pagiNation.currentPage === 1) {
                  thisVue.tb_GetData()
                } else {
                  thisVue.pageCurrentChange(1)
                }
              } else {
                // 更新原始数据，以便触发界面更新数据
                Object.assign(thisVue.curr_rowdata_Original, thisVue.curr_rowdata)
              }
            }
          }).catch(err => { // 获取所有错误请求的结果
            thisVue.dlgLoading = false // 弹出框加载完毕
            thisVue.$message({
              duration: 0, // 不自动关闭
              showClose: true,
              message: '提交错误:' + err.map(x => { return x.ErrMsg }).join(';'),
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, // 弹出框提交数据
    // ----翻页控件事件
    pageSizeChange: function (pageSize) {
      this.pagiNation.pageSize = pageSize
      // this.pageCurrentChange(1)// 重新获取数据
      // console.log('handleSizeChange', this.pagiNation, this.filters)
    }, // 改变显示条数触发事件
    pageCurrentChange: function (currentPage) {
      this.pagiNation.currentPage = currentPage
      // this.tb_GetData()// 重新获取数据
      // console.log('handleCurrentChange',currentPage)
    }, // 改变当前页触发事件
    PrevPage: function (currentPage) {
      // console.log('handlePrevPage',currentPage)
    }, // 点击上一页触发事件
    NextPage: function (currentPage) {
      // console.log('handleNextPage',currentPage)
    }, // 点击下一页触发事件
    // 翻页控件事件----
    // 导出 导入 Excel
    ExportXls: function (JsonData, fileName) {
      // console.log('ExportXls')
      require(['xlsx', 'file-saver'], function (XLSX, FileSaver) {
        var sheetName = '帐户'
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
            if (typeof this.el_selt[ArrOptionName] === 'undefined') {
              thisVue.$set(this.el_selt, ArrOptionName, {})
            }
            if (objIsEmpty(rows)) {
              thisVue.$set(this.el_selt[ArrOptionName], 'ArrOption', res)
            } else {
              thisVue.$set(this.el_selt[ArrOptionName], 'ArrOption', rows)
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
        // thisVue.$http.get(url, {
        //   params: paramData,
        //   headers: { // 指示为 ajax请求
        //     'X-Requested-With': 'XMLHttpRequest'
        //   }
        // }).then(function (success) { // 成功
        //   try {
        //     if (typeof this.el_selt[ArrOptionName] === 'undefined') {
        //       thisVue.$set(this.el_selt, ArrOptionName, {})
        //     }
        //     if (objIsEmpty(success.body.rows)) {
        //       thisVue.$set(this.el_selt[ArrOptionName], 'ArrOption', success.body)
        //     } else {
        //       thisVue.$set(this.el_selt[ArrOptionName], 'ArrOption', success.body.rows)
        //     }
        //   } catch (e) {
        //     thisVue.$message({
        //       duration: 0, // 不自动关闭
        //       showClose: true,
        //       message: '数据处理，出现错误',
        //       type: 'error'
        //     })
        //   }
        //   thisVue.el_selt.el_selt_loading = false// 加载完毕
        // }, function (error) { // 错误
        //   thisVue.el_selt.el_selt_loading = false// 加载完毕
        //   thisVue.$message({
        //     duration: 0, // 不自动关闭
        //     showClose: true,
        //     message: `获取数据出现错误:${error}`,
        //     type: 'error'
        //   })
        // })
      } else {
        if (typeof thisVue.el_selt[ArrOptionName] === 'undefined') {
          thisVue.el_selt[ArrOptionName] = {}
        }
        thisVue.el_selt[ArrOptionName]['ArrOption'] = []
      }
    } // 外键触发搜索
  }
}
export default { cRUDMixin, BaseArrField, CustomerFields }
