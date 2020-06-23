<template>
  <div ref="div_AutoCRUDLocal">
    <el-row style="padding: 3px 0px 3px 0px"><!--Table按钮组--><!--上右下左-->
      <el-col>
        <el-button-group>
         <el-button type="primary" icon="el-icon-plus" v-bind:disabled="!$route.meta.Create" v-on:click="handleAddRow">新增</el-button>
         <el-button icon="el-icon-download" v-bind:disabled="!$route.meta.Export" v-on:click="ExportXls(tb_OrdCustomer_data,'导出OrdCustomer')">导出</el-button>
         <el-button icon="el-icon-upload" v-bind:disabled="!$route.meta.Import" v-on:click="ImportXls">导入</el-button>
         <el-button type="danger" v-on:click="handledelSeltRow" v-bind:disabled="($route.meta.Delete ? selctRows.length===0 : true)">批量删除</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <!--Table列表-->
    <el-row>
      <el-col>
        <el-table ref="tb_OrderCuntomer" style="width: 100%" max-height="300" row-key="Id" border stripe
          v-bind:default-sort="{prop:'Id',order:'descending'}"
          v-bind:data="tb_OrdCustomer_data"
          v-loading="tbLoading"
          v-on:row-dblclick="handledblclick"
          v-on:selection-change="handleSelectionChange"
          v-on:sort-change="tbSortChange">
          <el-table-column type="selection" width="41"></el-table-column>
          <template>
            <el-table-column show-overflow-tooltip
              v-for="field in ArrListField"
              v-bind:key="field.Name"
              v-bind:width="field.Width_List"
              v-bind:sortable="field.Sortable?'custom':false"
              v-bind:prop="field.Name"
              v-bind:label="field.DisplayName"
              v-bind:formatter="formatter(field)">
            </el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>
    <!--form编辑弹出框-->
    <el-dialog ref="OrderCuntomerDialog" width="60%" center append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="DialogVisible"
      :fullscreen="dlgfullscreen"
      :before-close="(done)=>{dlgClose(done)}"
      v-loading="dlgLoading">
      <div slot="title" @dblclick="dlgfullscreen = !dlgfullscreen" class="el-dialog__title" style="">
        <el-row>
          <el-col v-bind:span="8" style="cursor:move">&nbsp;</el-col>
          <el-col v-bind:span="8" style="cursor:move">{{dgTitle}}</el-col>
          <el-col v-bind:span="8" style="text-align:right">
            <el-button type="primary" icon="el-icon-check" v-bind:disabled="!$route.meta.Edit" v-on:click="dlgok_func" title="确 定" circle></el-button>
            <el-button type="danger" icon="el-icon-close" v-on:click="dlgClose" title="取 消" circle></el-button>
          </el-col>
        </el-row>
      </div>
      <el-form ref="OrderCuntomerForm" v-bind:model="OrderCuntomer" label-position="right" inline size="small">
        <!--autocomplete-->
        <!-- <el-form-item v-bind:label-width="formLabelWidth" label="中文名" prop="NameChs"
           v-bind:rules="el_FormFieldRules({Name:'NameChs',DisplayName:'中文名',Required:true,Editable:true,MinLength:0,MaxLength:50})">
          <el-autocomplete v-model="OrderCuntomer['NameChs']" style="width:178px"
           popper-class="my-autocomplete"
           value-key="NameChs"
           v-on:select="OrdCuntomerSelt"
           v-bind:fetch-suggestions="OrdCustomerQSearch" >
            <template slot-scope="{ item }">
             <div class="name" style="text-overflow: ellipsis overflow: hidden">{{ item.NameChs }}</div>
             <span class="addr" style="font-size: 12px color: #b4b4b4">{{ item.Sex|Vue_Sexformatter }}-{{ item.Birthday|Vue_dateformatter }}</span>
            </template>
          </el-autocomplete>
        </el-form-item> -->
        <el-form-item v-for="field in ArrFormField"
            v-bind:key="field.Name"
            v-bind:label-width="formLabelWidth"
            v-bind:label="field.DisplayName"
            v-bind:prop="field.Name"
            v-bind:rules="el_FormFieldRules(field)">
          <component v-if="!field.IsForeignKey && field.FormShow && field.inputType !== 'tagedit'"
            v-bind:is="el_inputType(field)"
            v-bind:type="el_inputProtoType(field)"
            v-bind:disabled="field.IsKey || (!field.Editable&&OrderCuntomer.Id>0)"
            v-model="OrderCuntomer[field.Name]"
            v-bind:prop="field.Name"
            v-bind:precision="field.Precision"
            v-bind:clearable="true"
            v-bind:show-word-limit="(field.MaxLength||50)>0"
            v-bind:maxlength="field.MaxLength||50"
            v-bind:minlength="field.MinLength||50"
            v-bind:style="{'width':field.Width_input+'px'}">
            <i slot="suffix" class="el-input__icon fa"
              v-if="field.Name.toLowerCase().indexOf('password')>=0"
              v-show="field.Name.toLowerCase().indexOf('password')>=0"
              v-on:click="pswView(field)"
              v-bind:class="el_inputClass(field)"></i>
          </component>
          <component v-else-if="field.FormShow && field.inputType === 'tagedit'" v-bind:is="el_inputType(field)"
                     v-model="OrderCuntomer[field.Name]"
                     v-bind:style="{'width':field.Width_input+'px'}"
                     v-bind:editable="field.Editable">
          </component>
          <el-select v-else v-model="OrderCuntomer[field.Name]"
            reserve-keyword clearable
            v-bind:remote-method="q=>el_remoteMethod(q,field,'form')"
            v-bind:loading="el_selt.el_selt_loading"
            v-bind:style="{'width':field.Width_input+'px'}">
            <template v-if="el_selt[field.Name+'_form']">
              <el-option v-for="item in el_selt[field.Name+'_form'].ArrOption"
                v-bind:key="item.ID"
                v-bind:label="item.TEXT"
                v-bind:value="item.ID">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" v-bind:disabled="!$route.meta.Edit" v-on:click="dlgok_func">确 定</el-button>
        <el-button type="default" icon="el-icon-close" v-on:click="dlgClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { objIsEmpty } from '@/utils'
import TagEdit from '@/components/TagEdit' // 标签编辑展示
import elementExt from '@/utils/elementExtention'

// 自定义列数据(覆盖BaseArrField-ArrField行值)
// CustomerFields.Currency = {
//   DisplayName: "授权币制",//显示名称
//   Editable: true, //可编辑
//   ForeignKeyGetListUrl: '/PARA_CURRs/GetPagerPARA_CURR_FromCache', //获取外键数据Url
//   FormOrder: 0, //Form排序
//   FormShow: true, //Form中展示
//   IsForeignKey: true, //外键
//   IsKey: false, //主键
//   ListOrder: 0, //列表排序
//   ListShow: true, //列表展示
//   MaxLength: 50, //最大长度
//   MinLength: 0, //最小长度
//   Name: "Currency", //名称
//   //Type为number时，可设置小数位
//   Required: false, //必填
//   SearchOrder: 0, //搜索排序
//   SearchShow: true, //搜索中展示
//   Sortable: true, //是否可排序
//   Type: "string", //"datetime/number/string/boolean";//类型
//   Width_List: "120", //列表-列宽度 <=0 默认*，>0 此宽度为准
//   Width_input: "178", //Form-input宽度 <=0 默认*，>0 此宽度为准
//   inputType: "text", //"password/datetime/text/tagedit";//form中的input类型
// }

export default {
  name: 'AutoCRUDLocal',
  props: {
    refFieldName: { // 关联字段名称
      type: String,
      required: true
    },
    refFieldVal: { // 关联字段值
      type: String,
      default: 'Number',
      required: false
    },
    tbData: { // 数据集合
      type: Array,
      required: true
    },
    delData: { // 记录删除数据
      type: Array,
      required: true
    },
    formlabel_width: {
      type: String,
      default: '120px'
    },
    CustomerFields: { // 自定义列数据(覆盖BaseArrField-ArrField行值)
      type: Object,
      required: false
    },
    Fields: { // 所有要渲染的字段
      type: Array,
      required: true
    }
  },
  model: {
    prop: 'tbData',
    event: 'change'
  },
  components: {
    TagEdit // 标签编辑展示
  },
  created: function () {
    this.fieldsUpdate()
  }, // 数据初始化，还未渲染dom,在此处设置的数据 不受响应
  mounted: function () {
    if (!objIsEmpty(this.tb_OrdCustomer_data)) {
      var addNum = parseInt(this.tb_OrdCustomer_data.addNum)
      this.addNum = isNaN(addNum) ? 0 : addNum
    }// 记录上次渲染时，新增数据Num
    var thisVue = this
    this.ArrEnumField.forEach(function (item) {
      thisVue.el_remoteMethod('', item, 'form', true)
    }) // 外键触发搜索初始化
    // const {
    //   Edit, // 修改
    //   Create, // 创建
    //   Delete, // 删除
    //   Audit, // 审核
    //   Import, // 导入
    //   Export // 导出
    // } = this.$route.meta
    // Object.defineProperty(this, 'UserRoles', {
    //   value: {
    //     Edit, // 修改
    //     Create, // 创建
    //     Delete, // 删除
    //     Audit, // 审核
    //     Import, // 导入
    //     Export // 导出
    //   }
    // })
    // this.$forceUpdate() // 强制刷新组件
    /* 设置属性不能修改 相当于const  {value:{}}等价于 {value : {},writable : false,configurable : false,enumerable : false} */
    // Object.defineProperty(this, 'UserRoles', { value: {} })
    // var setterFunc = function (newVal) {
    //   var err = '不允许修改值'
    //   if (typeof (console) === 'undefined') {
    //     alert(err)
    //   } else {
    //     console.log(err)
    //   }
    // }
    // const Edit = this.$route.meta.Edit || false // 修改
    // const Create = this.$route.meta.Create || false // 创建
    // const Delete = this.$route.meta.Delete || false // 删除
    // const Audit = this.$route.meta.Audit || false // 审核
    // const Import = this.$route.meta.Import || false // 导入
    // const Export = this.$route.meta.Export || false // 导出
    // Object.defineProperty(this.UserRoles, 'Edit', { configurable: false, get: function () { return Edit } })
    // Object.defineProperty(this.UserRoles, 'Create', { configurable: false, get: function () { return Create } })
    // Object.defineProperty(this.UserRoles, 'Delete', { configurable: false, get: function () { return Delete } })
    // Object.defineProperty(this.UserRoles, 'Audit', { configurable: false, get: function () { return Audit } })
    // Object.defineProperty(this.UserRoles, 'Import', { configurable: false, get: function () { return Import } })
    // Object.defineProperty(this.UserRoles, 'Export', { configurable: false, get: function () { return Export } })
    console.log('mounted', this.UserRoles)
  }, // 相当于构造函数，渲染完dom后触发
  computed: { // 计算属性
    dgTitle: function () {
      let dgTitle = this.title || ''
      // debugger
      // this.UserRoles.Edit = false// 修改不了 writable 为 false 属性const化
      // Object.defineProperty(this.UserRoles,'Edit',{configurable:true,writable:true})
      // Object.defineProperty(this.UserRoles,'Edit',{value:false})
      // var tCurrRowData = typeof (this.OrderCuntomer)
      // if (tCurrRowData === 'undefined' || this.OrderCuntomer === null || JSON.stringify(this.OrderCuntomer) === '{}') {
      if (objIsEmpty(this.OrderCuntomer)) {
        return '未知'
      }
      if (this.OrderCuntomer.Id <= 0) {
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
  watch: {
    // tbData: {
    //   handler: (newval, oldval) => {
    //     // console.log('watch-tbData', newval, oldval)
    //     this.tb_OrdCustomer_data = objIsEmpty(newval) ? [] : newval
    //   }
    //   // true:在 wacth 里声明了之后，就会立即先去执行里面的handler方法
    //   // false:不会在绑定的时候就执行。
    //   // immediate: true
    //   // deep: true
    // },
    delData: {
      handler: (newval, oldval) => {
        // console.log('watch-delData', newval, oldval)
        this.DelData = objIsEmpty(newval) ? [] : newval
      }
      // true:在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      // false:不会在绑定的时候就执行。
      // immediate: true
      // deep: true
    },
    formlabel_width: {
      handler: (newval, oldval) => {
        this.formLabelWidth = objIsEmpty(newval) ? '120' : newval
      }
      // true:在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      // false:不会在绑定的时候就执行。
      // immediate: true
      // deep: true
    },
    Fields: {
      handler: (newval, oldval) => {
        this.fieldsUpdate()
      }
      // true:在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      // false:不会在绑定的时候就执行。
      // immediate: true
      // deep: true
    }
  }, // 监听属性变化
  data: function () {
    var data = {
      addNum: 0, // 新增序号
      OrderId: this.refFieldVal, // 订单Id
      tb_OrdCustomer_data: this.tbData, // 当前列表数据集合
      OrderCuntomer: {}, // 当前编辑数据
      formLabelWidth: this.formlabel_width, // Label宽度
      DelData: this.delData, // 记录删除的数据
      UserRoles: {}, // 权限
      DialogVisible: false, // 弹出框显示
      dlgfullscreen: false, // 弹出框全屏
      dlgLoading: false, // 编辑弹出框加载中
      tbLoading: false, // 数据列表加载中
      selctRows: [], // 选择的数据
      el_selt: {
        el_selt_loading: false // 选择框 搜索状态
      }, // select数据
      ArrEnumField: [], // 所有外键select字段
      ArrFormField: [], // 添加/编辑字段 通过此配置渲染
      ArrListField: [], // table展示列 通过此配置渲染
      ArrSearchField: [], // 搜索字段数据通过此配置渲染
      ArrTagEditField: [] // [string]字段数据通过此配置渲染
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
    data.pagiNation = pagiNation
    data.filters = filters
    console.log('data', data, this)
    return data
  },
  methods: {
    fieldsUpdate: function () {
      let thisVue = this
      thisVue.$set(thisVue, 'ArrEnumField', [])
      thisVue.$set(thisVue, 'ArrFormField', [])
      thisVue.$set(thisVue, 'ArrListField', [])
      thisVue.$set(thisVue, 'ArrSearchField', [])
      thisVue.$set(thisVue, 'ArrTagEditField', [])
      let ArrEnumField = thisVue.ArrEnumField // 所有外键select字段
      let ArrFormField = thisVue.ArrFormField // 添加/编辑字段 通过此配置渲染
      let ArrListField = thisVue.ArrListField // table展示列 通过此配置渲染
      let ArrSearchField = thisVue.ArrSearchField // 搜索字段数据通过此配置渲染
      let ArrTagEditField = thisVue.ArrTagEditField // 所有数组编辑字段
      // 设置自定义列 覆盖Fields
      if (!objIsEmpty(thisVue.CustomerFields)) {
        Object.entries(thisVue.CustomerFields).forEach(([key, value]) => {
          let OField = thisVue.Fields.filter(val => {
            return val.Name === key
          })
          if (OField.length > 0) {
            Object.assign(OField[0], value)
          }
        })
      }
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
          if (item.IsForeignKey) {
            ArrEnumField.push(item)
          }
        })
      }
      thisVue.ArrEnumField.forEach(function (item) { // 所有select枚举
        thisVue.el_remoteMethod('', item, 'search', true)
        thisVue.el_remoteMethod('', item, 'form', true)
      })
    }, // 赋值渲染然字段
    el_FormFieldRules: elementExt.el_FormFieldRules, //  输出input验证规则// 赋值渲染然字段
    el_inputType: elementExt.el_inputType, // 判断input输出格式
    el_inputProtoType: elementExt.el_inputProtoType, // el_input-Type属性
    el_inputClass: elementExt.el_inputClass, // password 显示/隐藏 class
    pswView: elementExt.pswView, // 密码框 显示隐藏
    handleAddRow: function (e) {
      console.log('handleAddRow', e)
      var newRow = { Id: --this.addNum } // 主键字段赋值
      newRow[this.refFieldName] = this.refFieldVal // 关联字段赋值
      // 赋值数据编辑新值
      this.ArrTagEditField.forEach(field => {
        if (field.inputType === 'tagedit') {
          newRow[field.Name] = []
          // newRow[field.Name].delData = []
          // newRow[field.Name].addNum = -1
          // newRow[field.Name].dlgVisible = false // 弹出状态
        }
      })
      this.DialogVisible = true
      this.OrderCuntomer = newRow
      this.dlgLoading = false// 编辑弹出框加载中
      this.tb_OrdCustomer_data.push(newRow)
      this.tb_OrdCustomer_data.addNum = this.addNum// 记录上次添加数-<keep-alive>
    }, // 增加行数据 弹出框添加
    handledblclick: function (row) {
      this.DialogVisible = true
      this.OrderCuntomer = row
      let currRowdata = this.OrderCuntomer
      let thisVue = this
      Object.keys(currRowdata).forEach(function (item, index) {
        let val = currRowdata[item] + ''
        if (!objIsEmpty(val)) {
          // json-date时间戳 转 date
          if (val.indexOf('/Date(') >= 0) {
            // eslint-disable-next-line new-cap
            var MDate = new moment(val)
            if (MDate.isValid()) {
              currRowdata[item] = MDate.toDate()
            }
          }
          // select 字段获取最新显示数据
          var ArrFilter = thisVue.ArrEnumField.filter(function (field) { return field.Name === item })
          if (ArrFilter.length > 0) {
            let OFilter = ArrFilter[0]
            let url = OFilter.ForeignKeyGetListUrl// '/MenuItems/GetData'
            if (!objIsEmpty(url) & url.indexOf('GetPagerEnum') < 0) {
              thisVue.el_remoteMethod('', OFilter, 'form', true)
            }
          }
        }
        // } else {
        //   var qArrTagEdit = thisVue.ArrTagEditField.filter(function (field) { return field.Name === item })
        //   if (qArrTagEdit.length > 0) {
        //     currRowdata[item] = []
        //   }
        // }
      })
      // 编辑数据-子数据集为空时，赋值[]
      thisVue.ArrTagEditField.forEach(item => {
        let tagVal = currRowdata[item.Name]
        if (objIsEmpty(tagVal)) {
          currRowdata[item.Name] = []
          // currRowdata[item.Name].delData = []
          // currRowdata[item.Name].addNum = -1
          // currRowdata[item.Name].dlgVisible = false // 弹出状态
        }
      })
      console.log('row-dblclick', row)
    }, // 双击行
    handleSelectionChange: function (selections) {
      this.selctRows = selections
      console.log('handleSelectionChange', selections)
    }, // 选择数据变更
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
        thisVue.tbLoading = true// 加载中
        var deltRowIndex = this.tb_OrdCustomer_data.map(function (item, i) {
          var hasEl = thisVue.selctRows.some(function (el, x) { return el.Id === item.Id })
          if (hasEl) {
            return i
          } else {
            return null
          }
        })
        deltRowIndex = deltRowIndex.filter(function (item) { return item != null })
        deltRowIndex = deltRowIndex.reverse()
        if (deltRowIndex.length >= 0) {
          deltRowIndex.forEach(function (ArrIdx) {
            let KeyId = thisVue.tb_OrdCustomer_data[ArrIdx].Id
            thisVue.tb_OrdCustomer_data.splice(ArrIdx, 1)
            thisVue.DelData.push(KeyId)// 记录删除数据
            thisVue.tb_OrdCustomer_data.delData.push(KeyId)// 记录删除数据
          })
          thisVue.$emit('chang', thisVue.tb_OrdCustomer_data)// 触发 v-model 修改
        }
        thisVue.tbLoading = false// 加载中
      }
      // rows.splice(index, 1)
    }, // 批量删除选中行数据
    dlgok_func: function () {
      let thisVue = this
      let MyForm = this.$refs['OrderCuntomerForm']
      // MyForm.resetFields()// 重置验证
      MyForm.clearValidate()// 清除验证
      MyForm.validate(function (valid) {
        if (valid) {
          thisVue.$emit('chang', thisVue.tb_OrdCustomer_data)// 触发 v-model 修改
          // 关闭弹出框
          thisVue.DialogVisible = false
          thisVue.$emit('dlgok_func')// 回调父组件自定义方法
        } else {
        }
      })
    },
    // 导出 导入 Excel
    ExportXls: elementExt.ExportXls, // 导出数据
    ImportXls: function () {
      // console.log('ImportXls')
    }, // 导入数据
    formatter: elementExt.formatter, // el-table-column 数据显示转换
    el_remoteMethod: elementExt.el_remoteMethod, // 外键触发搜索
    dlgClose: function (doneFunc) {
      let thisVue = this
      let MyForm = this.$refs['OrderCuntomerForm']
      // MyForm.resetFields()// 重置验证
      MyForm.clearValidate()// 清除验证
      MyForm.validate(function (valid) {
        if (valid) {
          thisVue.DialogVisible = false
          thisVue.$emit('dlgok_func')// 触发父组件事件
        } else {
          thisVue.$confirm(`${thisVue.dgTitle}验证错误, 强制新增?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function () {
            if (typeof (doneFunc) === 'function') {
              doneFunc()
            } else {
              thisVue.DialogVisible = false
              thisVue.$emit('dlgok_func') // 触发父组件事件
            }
          }).catch(function () {
            if (typeof (doneFunc) === 'function') {
              doneFunc()
            } else {
              thisVue.DialogVisible = false
            }
            var OrderCuntomer = thisVue.OrderCuntomer
            var delIndex = null
            thisVue.tb_OrdCustomer_data.forEach(function (item, idx) {
              if (item.Id === OrderCuntomer.Id) {
                delIndex = idx
                return false
              }
            })
            if (delIndex != null) {
              thisVue.tb_OrdCustomer_data.splice(delIndex, 1)
            }
          })
        }
      })
    }, // 弹出框关闭
    tbSortChange: function (sortObj) { // {column:列,prop:字段,sort:排序}
      // console.log('tbSortChange', sortObj)
      var IsReload = false
      let sort, order
      if (!(typeof (sortObj) === 'undefined' || sortObj === null || JSON.stringify(sortObj) === '{}')) {
        sort = sortObj.prop
        if (!(typeof (sortObj.prop) === 'undefined' || sortObj.prop === null || sortObj.prop === '')) {
          sort = sortObj.prop
        } else {
          sort = 'Id'
        }
        order = sortObj.order
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
        this.tb_OrdCustomer_data = this.tb_OrdCustomer_data.sort((a, b) => {
          if (order === 'desc') {
            return a[sort] > b[sort]
          } else {
            return a[sort] < b[sort]
          }
        })
        // if (this.pagiNation.currentPage === 1) {
        //   this.tb_GetData()
        // } else {
        //   this.pageCurrentChange(1)// 重新获取数据
        // }
      }
    } // table排序变更
  }
}
</script>
