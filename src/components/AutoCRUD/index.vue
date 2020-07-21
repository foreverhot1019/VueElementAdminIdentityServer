<template>
  <div id="div_AutoCRUD">
    <el-row style="background-color: #eee; padding:10px 0px 0px 10px"><!--搜索条件工具条-->
        <el-col>
            <el-form v-bind:inline="true" v-bind:model="filters.filterRules" ref="tb_search">
                <el-form-item v-for="field in ArrSearchField"
                    v-bind:key="field.Name"
                    v-bind:label-width="formLabelWidth"
                    v-bind:label="field.DisplayName"
                    v-bind:prop="field.Name"
                    v-bind:rules="el_FormFieldRules(field,true)">
                    <component v-if="!field.IsForeignKey" v-model="filters.filterRules[field.Name]"
                               v-bind:is="el_inputType(field)"
                               v-bind:prop="field.Name"
                               v-bind:type="el_inputProtoType(field,true)"
                               v-bind:precision="field.Precision"
                               value-format="yyyy-MM-dd"
                               range-separator="至"
                               start-placeholder="日期起"
                               end-placeholder="日期讫">
                        <i slot="suffix" class="el-input__icon fa"
                           v-show="field.Name.toLowerCase().indexOf('password')>=0"
                           v-on:click="pswView(field)"
                           v-bind:class="el_inputClass(field)"></i>
                    </component>
                    <el-select v-else v-model="filters.filterRules[field.Name]"
                               reserve-keyword clearable
                               v-bind:remote-method="q=>el_remoteMethod(q,field,'search')"
                               v-bind:loading="el_selt.el_selt_loading"
                               v-bind:multiple="field.multiple">
                        <template v-if="el_selt[field.Name+'_search']">
                            <el-option v-for="item in el_selt[field.Name+'_search'].ArrOption"
                                       v-bind:key="item.ID"
                                       v-bind:label="item.TEXT"
                                       v-bind:value="item.ID">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item style="margin-bottom: 8px;">
                    <el-button type="primary" icon="el-icon-search" v-on:click="search" v-bind:loading="tbLoading">查询</el-button>
                </el-form-item>
                <el-form-item style="margin-bottom: 8px;">
                    <el-button icon="el-icon-refresh" v-on:click="resetFilter('tb_search')" v-bind:disabled="tbLoading">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-row style="padding: 3px 10px 3px 10px;"><!--按钮组--><!--padding:上右下左-->
        <el-col>
            <el-button-group>
                <el-button type="primary" icon="el-icon-plus" v-bind:disabled="!$route.meta.Create" v-on:click="handleAddRow">新增</el-button>
                <el-button icon="el-icon-download" v-bind:disabled="!$route.meta.Export" v-on:click="ExportXls(tableData,'Excel导入配置')">导出</el-button>
                <el-button icon="el-icon-upload" v-bind:disabled="!$route.meta.Import" v-on:click="ImportXls">导入</el-button>
            </el-button-group>
        </el-col>
    </el-row>
    <el-row><!--table列表-->
        <el-col>
            <el-table ref="Mytb" style="width: 100%" max-height="500" row-key="Id" border stripe
                      v-bind:default-sort="{prop:'Id',order:'descending'}"
                      v-bind:data="tableData"
                      v-loading="tbLoading"
                      v-on:row-dblclick="handledblclick"
                      v-on:selection-change="handleSelectionChange"
                      v-on:sort-change="tbSortChange">
                <el-table-column type="selection" width="41"></el-table-column>
                <template>
                    <el-table-column show-overflow-tooltip
                        v-for="field in ArrListField"
                        v-bind:key="field.Name"
                        v-bind:width="field.Width_List||120"
                        v-bind:sortable="field.Sortable?'custom':false"
                        v-bind:prop="field.Name"
                        v-bind:label="field.DisplayName"
                        v-bind:formatter="formatter(field)">
                    </el-table-column>
                </template>
                <el-table-column fixed="right" label="操作" width="51" v-if="$route.meta.Delete"><!--table列工具条-->
                    <template slot-scope="sp">
                        <el-tooltip content="删除" placement="top" effect="light">
                            <el-button type="danger" icon="el-icon-delete" circle v-bind:disabled="!$route.meta.Delete" v-on:click.native.prevent="deleteRow(sp.$index, sp.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="padding-top: 10px;"><!--分页工具条&批量删除-->
                <el-col v-bind:span="8">
                    <el-button type="danger" v-on:click="handledelSeltRow" v-bind:disabled="($route.meta.Delete ? selctRows.length===0 : true)">批量删除</el-button>
                </el-col>
                <el-col v-bind:span="16">
                    <el-pagination v-model="pagiNation" style="float:right;"
                                   v-on:size-change="pageSizeChange"
                                   v-on:current-change="pageCurrentChange"
                                   v-on:prev-click="PrevPage"
                                   v-on:next-click="NextPage"
                                   v-bind:current-page="pagiNation.currentPage"
                                   v-bind:page-sizes="pagiNation.pageSizes"
                                   v-bind:page-size="pagiNation.pageSize"
                                   v-bind:layout="pagiNation.layout"
                                   v-bind:total="pagiNation.total">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <!--弹出框v-el-drag-dialog-->
    <el-dialog ref="MyDialog" width="67%" center
      v-if="curr_rowdata !== null && JSON.stringify(curr_rowdata) !== '{}'"
      v-loading="dlgLoading"
      v-bind:visible.sync="centerDialogVisible"
      v-bind:show-close="false"
      :before-close="(done)=>{dlgClose(done)}"
      v-bind:fullscreen="dlgfullscreen">
      <div slot="title" @dblclick="dlgfullscreen = !dlgfullscreen" class="el-dialog__title" style="">
        <el-row>
          <el-col v-bind:span="8" style="cursor:move">&nbsp;</el-col>
          <el-col v-bind:span="8" style="cursor:move">{{dgTitle}}</el-col>
          <el-col v-bind:span="8" style="text-align:right">
            <el-button type="primary" icon="el-icon-check" v-bind:disabled="!$route.meta.Edit" @click="dlgSubmit" title="确 定" circle></el-button>
            <el-button type="danger" icon="el-icon-close" v-on:click="dlgClose" title="取 消" circle></el-button>
          </el-col>
        </el-row>
      </div>
      <el-form ref="MyForm" v-bind:model="curr_rowdata" v-bind:label-position="label_position" inline>
          <el-form-item v-for="field in ArrFormField"
                  v-bind:key="field.Name"
                  v-bind:label-width="formLabelWidth"
                  v-bind:label="field.DisplayName"
                  v-bind:prop="field.Name"
                  v-bind:rules="el_FormFieldRules(field)">
              <component v-if="!field.IsForeignKey && field.FormShow && field.inputType !== 'tagedit'" v-bind:is="el_inputType(field)"
                         v-bind:disabled="field.IsKey || (!field.Editable&&curr_rowdata.Id>0)"
                         v-model="curr_rowdata[field.Name]"
                         v-bind:prop="field.Name"
                         v-bind:type="el_inputProtoType(field)"
                         v-bind:precision="field.Precision"
                         v-bind:clearable="true"
                         v-bind:show-word-limit="(field.MaxLength||50)>0"
                         v-bind:maxlength="field.MaxLength||50"
                         v-bind:minlength="field.MinLength||50"
                         v-bind:style="{'width':(field.Width_input||178)+'px'}">
                  <i slot="suffix" class="el-input__icon fa"
                     v-if="field.Name.toLowerCase().indexOf('password')>=0"
                     v-show="field.Name.toLowerCase().indexOf('password')>=0"
                     v-on:click="pswView(field)"
                     v-bind:class="el_inputClass(field)"></i>
              </component>
              <component v-else-if="field.FormShow && field.inputType === 'tagedit'" v-bind:is="el_inputType(field)"
                         v-model="curr_rowdata[field.Name]"
                         v-bind:style="{'width':(field.Width_input||378)+'px'}"
                         v-bind:maxlength="field.MaxLength||20"
                         v-bind:editable="field.Editable">
              </component>
              <el-select v-else v-model="curr_rowdata[field.Name]"
                         reserve-keyword clearable
                         v-bind:remote-method="q=>el_remoteMethod(q,field,'form')"
                         v-bind:loading="el_selt.el_selt_loading"
                         v-bind:style="{'width':(field.Width_input||178)+'px'}"
                         v-bind:multiple="field.multiple">
                  <template v-if="el_selt[field.Name+'_form']">
                      <el-option v-for="item in el_selt[field.Name+'_form'].ArrOption"
                                 v-bind:key="item.ID"
                                 v-bind:label="item.TEXT"
                                 v-bind:value="item.ID">
                      </el-option>
                  </template>
              </el-select>
          </el-form-item>
          <el-tabs v-if="ArrTabEditField&&ArrTabEditField.length>0" v-model="TabActiveName" ref="el_Tab" type="border-card" v-on:tab-click="TabClick">
              <template v-for="tab in ArrTabEditField" >
                <el-tab-pane v-bind:label="tab.DisplayName" v-bind:name="tab.Name" v-bind:key="tab.Name">
                  <AutoCRUDLocal v-bind:ref="tab.Name"
                    v-if="curr_rowdata[tab.Name+'_config'].dlgVisible"
                    v-bind:refFieldVal="curr_rowdata.Id"
                    v-bind:refFieldName="Fields[tab.Name+'Fields'].refFieldName"
                    v-model="curr_rowdata[tab.Name]"
                    v-bind:delData="curr_rowdata[tab.Name+'_config'].delData"
                    v-bind:Fields="Fields[tab.Name+'Fields']"
                    v-on:dlgok_func="dlgOK_Func"
                    v-on:updateData="curr_rowdataChange"></AutoCRUDLocal>
                    <!-- _self 获取vue实例 filters
                    v-bind:Fields="tab.Name+'Fields'|getVueDataByStr"
                    v-bind:Fields="$data[tab.Name+'Fields']"
                    v-bind:Fields="_self[tab.Name+'Fields']" -->
                  <!--keep-alive 保持上次渲染时的状态
                  include: 字符串或正则表达式。只有匹配的组件会被缓存。
                  exclude: 字符串或正则表达式。任何匹配的组件都不会被缓存。-->
                </el-tab-pane>
              </template>
          </el-tabs><!--Api范围/api密钥-->
      </el-form>
      <span slot="footer" class="dialog-footer"><!--底部按钮组-->
          <el-button v-on:click="dlgClose">取 消</el-button>
          <el-button type="primary" v-bind:disabled="!$route.meta.Edit" v-on:click="dlgSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BaseApi from '@/axiosAPI/BaseApi'
import MycRUDMixin from '@/Mixins/CRUDMixin'
import { objIsEmpty } from '@/utils'
import LazyLoading from 'components/LazyLoading' // 异步加载

let { cRUDMixin, CustomerFields } = MycRUDMixin

// 自定义列数据(覆盖BaseArrField-ArrField行值)
// CustomerFields.Currency = {
//   Name: 'Currency', //名称
//   DisplayName: '授权币制',//显示名称
//   IsKey: true, //主键
//   Editable: true, //可编辑
//   Required: true, //必填
//   Type: 'string', //'datetime/number/string/boolean';//类型-默认string
//   inputType: 'text', //'password/datetime/text/tagedit/tabedit';//form中的input类型-默认text
//   IsForeignKey: true, //外键渲染为Select
//   multiple: true, //select多选
//   ForeignKeyGetListUrl: '/api/GetPagerPARA_CURR_FromCache', //获取外键数据Url
//   isEmail: true, //邮件格式
//   FormOrder: 1, //Form排序
//   FormShow: true, //Form中展示
//   ListOrder: 1, //列表排序
//   ListShow: true, //列表展示
//   MaxLength: 50, //最大长度
//   MinLength: 10, //最小长度
//   Precision: 2 //小数位位数 //Type为number时，可设置小数位
//   SearchOrder: 1, //搜索排序
//   SearchShow: true, //搜索中展示
//   Sortable: true, //是否可排序
//   Width_List: '120', //列表-列宽度 <=0 默认*，>0 此宽度为准
//   Width_input: '178', //Form-input宽度 <=0 默认*，>0 此宽度为准
// }
// 枚举类型字段
export default {
  name: 'AutoCRUD', // 页面名称（当组件引用时用到）
  props: {
    ControllerName: { // 控制器名称
      type: String,
      required: true
    },
    CustomerFields: { // 自定义列数据(覆盖BaseArrField-ArrField行值)
      type: Object,
      required: false
    },
    Fields: { // 所有要渲染的字段
      type: Array,
      required: true
    },
    formlabel_width: {
      type: String,
      default: '120px'
    },
    formlabel_position: {
      type: String,
      default: 'right'
    },
    title: { // 标题
      type: String,
      default: ''
    }
  },
  components: {
    TagEdit: () => LazyLoading(import('components/TagEdit')), // 标签编辑展示
    AutoCRUDLocal: () => LazyLoading(import('components/AutoCRUDLocal')) // 本地数据CRUD
  },
  created: function () {
    console.log('AutoCrud---------')
    // 赋值渲染然字段
    // ArrEnumField/ArrFormField/ArrListField/ArrSearchField/ArrTagEditField/ArrTabEditField
    // this.fieldsUpdate()
    let { CustomerFields: propCustomerFields, ControllerName } = this
    // 设置自定义数据
    if (!objIsEmpty(propCustomerFields)) {
      propCustomerFields.entries().foreach((key, value) => {
        CustomerFields[key] = value
      })
    }
    // 为了filters能使用this指向vue实例
    this._f = function (id) {
      return this.$options.filters[id].bind(this._self)
    }
    // // 初始化渲染CRUD字段数据
    // BaseArrField.SetArrField = Fields
    // 设置控制器
    BaseApi.SetController(ControllerName)
  }, // 渲染dom前触发
  mixins: [cRUDMixin] // 混入
}
</script>
