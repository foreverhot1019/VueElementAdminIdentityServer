import { objIsEmpty } from '@/utils'
import BaseApi from '@/axiosAPI/BaseApi'
import moment from 'moment'
import elementExt from '@/utils/elementExtention'
import _ from 'lodash'

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
    console.log('CrudMixin---------')
    this.fieldsUpdate()
    // 为了filters能使用this指向vue实例
    this._f = function (id) {
      return this.$options.filters[id].bind(this._self)
    }
    // let thisVue = this
    // thisVue.$set(thisVue, 'ArrEnumField', [])
    // thisVue.$set(thisVue, 'ArrFormField', [])
    // thisVue.$set(thisVue, 'ArrListField', [])
    // thisVue.$set(thisVue, 'ArrSearchField', [])
    // thisVue.$set(thisVue, 'ArrTagEditField', [])
    // let ArrEnumField = thisVue.ArrEnumField // 所有外键select字段
    // let ArrFormField = thisVue.ArrFormField // 添加/编辑字段 通过此配置渲染
    // let ArrListField = thisVue.ArrListField // table展示列 通过此配置渲染
    // let ArrSearchField = thisVue.ArrSearchField // 搜索字段数据通过此配置渲染
    // let ArrTagEditField = thisVue.ArrTagEditField // 所有数组编辑字段

    // if (!objIsEmpty(thisVue.Fields)) {
    //   // 列表/编辑/搜索 字段集合
    //   thisVue.Fields.forEach((item, idx) => {
    //     if (item.FormShow && !item.IsKey) {
    //       ArrFormField.push(item)
    //     }
    //     if (item.FormOrder > 0) {
    //       this.IsListOrder = true
    //     }
    //     if (item.ListShow && !item.IsKey) {
    //       ArrListField.push(item)
    //     }
    //     if (item.IsListOrder > 0) {
    //       this.IsListOrder = true
    //     }
    //     if (item.SearchShow && !item.IsKey) {
    //       ArrSearchField.push(item)
    //     }
    //     if (item.SearchOrder > 0) {
    //       this.IsSearchOrder = true
    //     }
    //     if (item.inputType === 'tagedit') {
    //       ArrTagEditField.push(item)
    //     }
    //     if (item.IsForeignKey) {
    //       ArrEnumField.push(item)
    //     }
    //   })
    // }
    // // thisVue.ArrEnumField = thisVue.Fields.filter(function (val) {
    // //   return val.IsForeignKey
    // // })// 所有select/枚举
    // thisVue.ArrEnumField.forEach(function (item) { // 所有select枚举
    //   thisVue.el_remoteMethod('', item, 'search', true)
    //   thisVue.el_remoteMethod('', item, 'form', true)
    // })
    // // thisVue.ArrTagEditField = thisVue.Fields.filter(function (field) {
    // //   return field.inputType === 'tagedit' && field.Editable
    // // })// 所有数组编辑字段
  }, // 数据初始化，还未渲染dom,在此处设置的数据 不受响应
  mounted: function () {
    // document.querySelector('#div_Loading').hidden = true // 必须得有，不然一直显示加载中。。。
    this.tb_GetData() // table数据初始化
    this.$set(this.el_selt, 'el_selt_loading', false) // 选择框loding状态
    // /* 设置属性不能修改 相当于const  {value:{}}等价于 {value : {},writable : false,configurable : false,enumerable : false} */
    // Object.defineProperty(this, 'UserRoles', { value: {} })
    // var setterFunc = function (newVal) {
    //   var err = '不允许修改值'
    //   if (typeof (console) === 'undefined') {
    //     alert(err)
    //   } else {
    //     console.log(err)
    //   }
    // }
    // const {
    //   Edit, // 修改
    //   Create, // 创建
    //   Delete, // 删除
    //   Audit, // 审核
    //   Import, // 导入
    //   Export // 导出
    // } = this.$route.meta
    // Object.defineProperty(this.UserRoles, 'Edit', { configurable: false, get: function () { return Edit }, set: setterFunc })
    // Object.defineProperty(this.UserRoles, 'Create', { configurable: false, get: function () { return Create }, set: setterFunc })
    // Object.defineProperty(this.UserRoles, 'Delete', { configurable: false, get: function () { return Delete }, set: setterFunc })
    // Object.defineProperty(this.UserRoles, 'Audit', { configurable: false, get: function () { return Audit }, set: setterFunc })
    // Object.defineProperty(this.UserRoles, 'Import', { configurable: false, get: function () { return Import }, set: setterFunc })
    // Object.defineProperty(this.UserRoles, 'Export', { configurable: false, get: function () { return Export }, set: setterFunc })
  }, // 相当于构造函数，渲染完dom后触发
  filters: { // v-bind可以使用，v-model 无效
    getVueDataByStr: function (dataNameStr) {
      return this[dataNameStr]
    } // 通过string获取Vue数据(Created中修改this._f方法)
  }, // 数据过滤器
  data: function () {
    var tb = {
      // tbUrl: {
      //   controller: 'a',
      //   exportExcel: 'ExportExcel', // 导出Excel action
      //   importExcel: 'Upload' // 导入Excel action
      // },
      Title: this.title || '', // 页面名称
      TabActiveName: '', // 选中tab名称
      AddNum: 0, // 新增序号
      method: 'post', // HTTP请求方法
      tbLoading: true, // 加载中
      addRows: [], // 新增的行
      selctRows: [], // 选中行
      curr_rowdata: {}, // 当前选择的行
      curr_rowdata_Original: {}, // 当前行原始数据
      centerDialogVisible: false, // 弹出框是否打开
      dlgLoading: false, // 弹出框加载状态
      dlgfullscreen: false, // 弹出框全屏
      formLabelWidth: this.formlabel_width || '120px', // Label宽度
      label_position: this.formlabel_position || 'right', // Label排列位置
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
    tb.ArrEnumField = [] // 所有外键select字段
    tb.ArrFormField = [] // ArrFormField // 添加/编辑字段 通过此配置渲染
    tb.ArrListField = [] // ArrListField // table展示列 通过此配置渲染
    tb.ArrSearchField = [] // ArrSearchField // 搜索字段数据通过此配置渲染
    tb.ArrTagEditField = [] // ArrTagEditField // 数组字段数据通过此配置渲染
    tb.ArrTabEditField = [] // ArrTabEditField // Tab展示字段数据通过此配置渲染
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
      let dgTitle = this.Title || ''
      // debugger
      // this.UserRoles.Edit = false// 修改不了 writable 为 false 属性const化
      // Object.defineProperty(this.UserRoles,'Edit',{configurable:true,writable:true})
      // Object.defineProperty(this.UserRoles,'Edit',{value:false})
      // var tCurrRowData = typeof (this.curr_rowdata)
      // if (tCurrRowData === 'undefined' || this.curr_rowdata === null || JSON.stringify(this.curr_rowdata) === '{}') {
      if (objIsEmpty(this.curr_rowdata)) {
        return '未知'
      }
      if (this.curr_rowdata.Id <= 0) {
        return `${dgTitle}新增`
      } else {
        if (this.$route.meta.Edit) {
          return `${dgTitle}编辑`
        } else {
          return `${dgTitle}查看`
        }
      }
    }
  }, // 计算属性
  watch: { // 监听属性变化
    // pagiNation:{ // 深度监听，可监听到对象、数组的变化
    //   handler(val, oldVal){
    //       console.log('b.c: '+val.c, oldVal.c)// 但是这两个值打印出来却都是一样的
    //   },
    //   // true:在 wacth 里声明了之后，就会立即先去执行里面的handler方法
    //   // false:不会在绑定的时候就执行。
    //   immediate: true, // 将立即以表达式的当前值触发回调
    //   deep:true
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
    fieldsUpdate: elementExt.fieldsUpdate, // 赋值渲染然字段
    el_FormFieldRules: elementExt.el_FormFieldRules, // 输出input验证规则
    el_inputType: elementExt.el_inputType, // 判断input输出格式
    el_inputProtoType: elementExt.el_inputProtoType, // el_input-Type属性
    el_inputClass: elementExt.el_inputClass, // password 显示/隐藏 class
    pswView: elementExt.pswView, // 密码框 显示隐藏
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
          let resType = typeof res
          if (resType === 'string') {
            res = JSON.parse(res)
          }
          let { rows, total } = res
          // console.log(res)
          thisVue.tableData = rows
          thisVue.pagiNation.total = total
        } catch (e) {
          thisVue.$message({
            duration: 0, // 不自动关闭
            showClose: true,
            message: `数据处理，出现错误${e}`,
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
      this.curr_rowdata_Original = row // 原始行数据
      if (row[this.TabActiveName]) {
        row[this.TabActiveName].dlgVisible = true
      }
      let _currRowData = this.curr_rowdata_Original
      let ArrEnumField = this.ArrEnumField // 所有select/枚举
      let thisVue = this
      Object.keys(_currRowData).forEach(function (item, index) {
        let val = _currRowData[item] + ''
        if (!objIsEmpty(val)) {
          if (val.indexOf('/Date(') >= 0) {
            // eslint-disable-next-line new-cap
            var d = new moment(val)
            if (d.isValid()) {
              _currRowData[item] = d.toDate()
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
        }
        // } else {
        //   // 数据为空时判断是不是
        //   var qArrTagEdit = thisVue.ArrTagEditField.filter(function (field) { return field.Name === item })
        //   if (qArrTagEdit.length > 0) {
        //     currRowData[item] = []
        //   }
        // }
      })
      // 赋值删除&添加序号字段
      thisVue.ArrTagEditField.forEach(item => {
        let tagVal = _currRowData[item.Name]
        if (objIsEmpty(tagVal)) {
          _currRowData[item.Name] = []
        }
      })
      // 赋值删除&添加序号字段
      thisVue.ArrTabEditField.forEach(item => {
        let tagVal = _currRowData[item.Name]
        if (objIsEmpty(tagVal)) {
          _currRowData[item.Name] = []
        }
        let conf = `${item.Name}_config`
        if (objIsEmpty(_currRowData[conf])) {
          _currRowData[conf] = {}
          _currRowData[conf].delData = [] // 记录删除数据
          _currRowData[conf].dlgVisible = false // 弹出状态
          _currRowData[conf].addNum = -1 // 记录新增序号
          // _currRowData[conf] = {
          //   delData: [], // 记录删除数据
          //   dlgVisible: false, // 弹出状态
          //   addNum: -1 // 记录新增序号
          // }
        }
      })
      if (this.TabActiveName) {
        let TabActive = _currRowData[`${this.TabActiveName}_config`]
        TabActive.dlgVisible = true
      }
      this.curr_rowdata = _.defaultsDeep({}, _currRowData)
      // console.log('row-dblclick',row)
    }, // 双击行
    handleAddRow: function (e) {
      let thisVue = this
      // console.log('handleAddRow',e)
      let newRow = { Id: --this.AddNum }
      // 赋值数据编辑新值
      thisVue.ArrTagEditField.forEach(field => {
        if (field.inputType === 'tagedit') {
          newRow[field.Name] = []
        }
      })
      // 赋值删除&添加序号字段
      thisVue.ArrTabEditField.forEach(tab => {
        newRow[tab.Name] = []
        let conf = `${tab.Name}_config`
        newRow[conf] = {}
        newRow[conf].delData = [] // 记录删除数据
        newRow[conf].dlgVisible = false // 弹出状态
        newRow[conf].addNum = -1 // 记录新增序号
        // newRow[tab.Name].delData = [] // 记录删除数据
        // newRow[tab.Name].dlgVisible = false // 弹出状态
        // newRow[tab.Name].addNum = -1 // 记录新增序号
      })
      if (this.TabActiveName) {
        let TabActive = newRow[`${this.TabActiveName}_config`]
        TabActive.dlgVisible = true
      }
      thisVue.curr_rowdata = newRow
      thisVue.centerDialogVisible = true
      thisVue.dlgLoading = false
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
          if (!objIsEmpty(item.Id) && item.Id > 0) {
            let DelFunc = BaseApi.Delete(item.Id)
            ArrDelPromiseFunc.push(DelFunc)
          }
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
          let ErrMsg = Array.isArray(ArrErr) ? ArrErr.map(x => { return x.ErrMsg }).join(',') : ArrErr.ErrMsg
          thisVue.tbLoading = false // 加载完毕
          thisVue.$message({
            duration: 0, // 不自动关闭
            showClose: true,
            message: `删除数据，出现错误:${ErrMsg}`,
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
    dlgClose: function (doneFunc) { // 弹出框关闭时触发
      if (typeof (doneFunc) === 'function') {
        doneFunc()
      } else {
        this.centerDialogVisible = false
      }
      let currRowdata = this.curr_rowdata
      this.ArrTabEditField.forEach(tab => {
        currRowdata[tab.Name] = []
        let conf = `${tab.Name}_config`
        currRowdata[conf].dlgVisible = false // 弹出状态
      })
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
          thisVue.$refs.el_Tab.each(tab => {
            postData[tab.Name].delData = tab.DelData
            postData[tab.Name].addNum = tab.addNum
          })
          console.log(postData)
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
                // 刷新数据
                thisVue.tb_GetData()
                // 更新原始数据，以便触发界面更新数据
                // Object.assign(thisVue.curr_rowdata_Original, thisVue.curr_rowdata)
              }
            }
          }).catch(ArrErr => { // 获取所有错误请求的结果
            let ErrMsg = Array.isArray(ArrErr) ? ArrErr.map(x => { return x.ErrMsg }).join(',') : ArrErr.ErrMsg
            thisVue.dlgLoading = false // 弹出框加载完毕
            thisVue.$message({
              duration: 0, // 不自动关闭
              showClose: true,
              message: `提交错误:${ErrMsg}`,
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
    ExportXls: elementExt.ExportXls, // 导出数据
    ImportXls: function () {
      // console.log('ImportXls')
    }, // 导入数据
    formatter: elementExt.formatter, // el-table-column 数据显示转换
    el_remoteMethod: elementExt.el_remoteMethod, // 外键触发搜索
    dlgOK_Func: function () {
      console.log('dlgOK_Func')
    }, // 子组件触发父组件
    TabClick: function (tab, event) {
      // console.log('TabClick', tab)
      this.TabActiveName = tab.name
      let conf = `${this.TabActiveName}_config`
      var tabObjComponent = this.curr_rowdata[conf]
      tabObjComponent.dlgVisible = true // 设置异步组件显示
    }, // tab点击事件
    curr_rowdataChange: function (newdata) {
      // this.curr_rowdata = newdata
      console.log(this.curr_rowdata, newdata)
    }
  }
}
export default { cRUDMixin, BaseArrField, CustomerFields }
