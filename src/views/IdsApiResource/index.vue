<template>
  <div id="div_IdsApiResource">
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
                               v-bind:loading="el_selt.el_selt_loading">
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
                <el-button type="primary" icon="el-icon-plus" v-bind:disabled="!UserRoles.Create" v-on:click="handleAddRow">新增</el-button>
                <el-button icon="el-icon-download" v-bind:disabled="!UserRoles.Export" v-on:click="ExportXls(tableData,'Excel导入配置')">导出</el-button>
                <el-button icon="el-icon-upload" v-bind:disabled="!UserRoles.Import" v-on:click="ImportXls">导入</el-button>
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
                        v-bind:width="field.Width_List"
                        v-bind:sortable="field.Sortable?'custom':false"
                        v-bind:prop="field.Name"
                        v-bind:label="field.DisplayName"
                        v-bind:formatter="formatter(field)">
                    </el-table-column>
                </template>
                <el-table-column fixed="right" label="操作" width="51" v-if="UserRoles.Delete"><!--table列工具条-->
                    <template slot-scope="sp">
                        <el-tooltip content="删除" placement="top" effect="light">
                            <el-button type="danger" icon="el-icon-delete" circle v-bind:disabled="!UserRoles.Delete" v-on:click.native.prevent="deleteRow(sp.$index, sp.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="padding-top: 10px;"><!--分页工具条&批量删除-->
                <el-col v-bind:span="8">
                    <el-button type="danger" v-on:click="handledelSeltRow" v-bind:disabled="(UserRoles.Delete ? selctRows.length===0 : true)">批量删除</el-button>
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
    <!--弹出框-->
    <el-dialog v-bind:title="dgTitle" ref="MyDialog" width="60%" center v-el-drag-dialog
      v-if="curr_rowdata !== null && JSON.stringify(curr_rowdata) !== '{}'"
      v-bind:visible.sync="centerDialogVisible"
      v-loading="dlgLoading"
      v-on:close="dlgClose">
      <el-form ref="MyForm" v-bind:model="curr_rowdata" label-position="right" inline size="small">
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
                           v-bind:style="{'width':field.Width_input+'px'}">
                    <i slot="suffix" class="el-input__icon fa"
                       v-if="field.Name.toLowerCase().indexOf('password')>=0"
                       v-show="field.Name.toLowerCase().indexOf('password')>=0"
                       v-on:click="pswView(field)"
                       v-bind:class="el_inputClass(field)"></i>
                </component>
                <component v-else-if="field.FormShow && field.inputType === 'tagedit'" v-bind:is="el_inputType(field)"
                           v-model="curr_rowdata[field.Name]"
                           v-bind:style="{'width':field.Width_input+'px'}"
                           v-bind:editable="field.Editable">
                </component>
                <el-select v-else v-model="curr_rowdata[field.Name]"
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
          <el-tabs v-model="TabActiveName" ref="el_Tab" type="border-card" v-on:tab-click="TabClick">
              <el-tab-pane label="Api范围" name="Scopes">
                <AutoCRUDLocal ref="Scopes"
                  v-if="curr_rowdata['Scopes'].dlgVisible"
                  :refFieldVal="curr_rowdata.Id.toString()"
                  refFieldName="ApiResourceId"
                  v-model="curr_rowdata['Scopes']"
                  :delData="curr_rowdata['Scopes'].delData"
                  :Fields="ApiScopeFields"
                  v-on:dlgok_func="dlgOK_Func"></AutoCRUDLocal>
                <!--keep-alive 保持上次渲染时的状态
                include: 字符串或正则表达式。只有匹配的组件会被缓存。
                exclude: 字符串或正则表达式。任何匹配的组件都不会被缓存。-->
              </el-tab-pane>
              <el-tab-pane label="Api密钥" name="Secrets">
                <AutoCRUDLocal ref="Secrets"
                  v-if="curr_rowdata['Secrets'].dlgVisible"
                  :refFieldVal="curr_rowdata.Id.toString()"
                  refFieldName="ApiResourceId"
                  v-model="curr_rowdata['Secrets']"
                  :delData="curr_rowdata['Secrets'].delData"
                  :Fields="ApiSecretFields"
                  v-on:dlgok_func="dlgOK_Func"></AutoCRUDLocal>
              </el-tab-pane>
          </el-tabs><!--Api范围/api密钥-->
      </el-form>
      <span slot="footer" class="dialog-footer"><!--底部按钮组-->
        <el-button v-on:click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-bind:disabled="!UserRoles.Edit" v-on:click="dlgSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import BaseApi from '@/axiosAPI/BaseApi'
import { objIsEmpty } from '@/utils'
import TagEdit from '@/components/TagEdit' // 标签编辑展示
import elementExt from '@/utils/elementExtention'
import AutoCRUDLocal from '@/components/AutoCRUDLocal' // AutoCRUD组件

// 渲染CRUD字段数据集
let ArrField = [
  { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'number', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Name', DisplayName: '名称', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 50, MinLength: 0, ListOrder: 1, SearchOrder: 1, FormOrder: 1, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'DisplayName', DisplayName: '显示名称', Width_List: '200', Width_input: '278', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 200, MinLength: 0, ListOrder: 3, SearchOrder: 3, FormOrder: 3, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Description', DisplayName: '描述', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 4, SearchOrder: 4, FormOrder: 4, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Enabled', DisplayName: '启用', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'NonEditable', DisplayName: '空编辑', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Created', DisplayName: '创建时间', Width_List: '137', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 5, SearchOrder: 2, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Updated', DisplayName: '更新时间', Width_List: '137', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 5, SearchOrder: 2, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'LastAccessed', DisplayName: '最后登录时间', Width_List: '137', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 5, SearchOrder: 2, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'UserClaims', DisplayName: 'Api票根', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Scopes', DisplayName: 'Api范围', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 6, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Secrets', DisplayName: 'Api密钥', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 6, IsForeignKey: false, ForeignKeyGetListUrl: null }
]
let ApiScopeFields = [
  { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'number', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Name', DisplayName: '名称', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 50, MinLength: 0, ListOrder: 1, SearchOrder: 1, FormOrder: 1, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'DisplayName', DisplayName: '显示名称', Width_List: '200', Width_input: '278', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 200, MinLength: 0, ListOrder: 3, SearchOrder: 3, FormOrder: 3, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Description', DisplayName: '描述', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 4, SearchOrder: 4, FormOrder: 4, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Required', DisplayName: '必须', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Emphasize', DisplayName: '强调范围', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'ShowInDiscoveryDocument', DisplayName: '服务发现', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'UserClaims', DisplayName: '用户票根', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'ApiResourceId', DisplayName: 'Api资源', Width_List: '120', Width_input: '378', Type: 'number', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 6, IsForeignKey: false, ForeignKeyGetListUrl: null }
]
let ApiSecretFields = [
  { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'number', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Description', DisplayName: '描述', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 1000, MinLength: 0, ListOrder: 4, SearchOrder: 4, FormOrder: 4, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Value', DisplayName: '值', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 2000, MinLength: 0, ListOrder: 1, SearchOrder: 1, FormOrder: 1, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Expiration', DisplayName: '过期时间', Width_List: '120', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 5, SearchOrder: 2, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Type', DisplayName: '类型', Width_List: '200', Width_input: '278', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 200, MinLength: 0, ListOrder: 3, SearchOrder: 3, FormOrder: 3, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'Created', DisplayName: '创建时间', Width_List: '120', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 5, SearchOrder: 2, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
  { Name: 'ApiResourceId', DisplayName: 'Api资源', Width_List: '120', Width_input: '378', Type: 'number', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 6, IsForeignKey: false, ForeignKeyGetListUrl: null }
]

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
// 枚举类型字段
export default {
  name: 'IdsApiResource', // 页面名称（当组件引用时用到）
  components: {
    TagEdit, // 标签编辑展示
    AutoCRUDLocal // 本地数据CRUD
  },
  directives: {}, // 注册局部指令
  created: function () {
    // 设置控制器
    BaseApi.SetController('ApiResource')
    this.fieldsUpdate()
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
    const {
      Edit, // 修改
      Create, // 创建
      Delete, // 删除
      Audit, // 审核
      Import, // 导入
      Export // 导出
    } = this.$route.meta
    // const Edit = this.$route.meta.Edit || false // 修改
    // const Create = this.$route.meta.Create || false // 创建
    // const Delete = this.$route.meta.Delete || false // 删除
    // const Audit = this.$route.meta.Edit || false // 审核
    // const Import = this.$route.meta.Import || false // 导入
    // const Export = this.$route.meta.Export || false // 导出
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
      formLabelWidth: this.formlabel_width || '120px',
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
    tb.Fields = ArrField // 所有需要渲染的字段集合
    tb.ArrEnumField = [] // 所有外键select字段
    tb.ArrFormField = [] // ArrFormField // 添加/编辑字段 通过此配置渲染
    tb.ArrListField = [] // ArrListField // table展示列 通过此配置渲染
    tb.ArrSearchField = [] // ArrSearchField // 搜索字段数据通过此配置渲染
    tb.ArrTagEditField = [] // ArrTagEditField // 搜索字段数据通过此配置渲染
    // tb.valid_rules = valid_rules
    // el-select 搜索框数据
    tb.ApiScopeFields = ApiScopeFields
    tb.ApiSecretFields = ApiSecretFields
    tb.el_selt = {
      // el_selt_loading : false, // 选择框 搜索状态
      // 'CompanyId_form':{ArrOption : []}, // 选择框 数据
    }
    return tb
  }, // 数据集
  computed: { // 计算属性
    dgTitle: function () {
      let dgTitle = this.title || ''
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
        if (this.UserRoles.Edit) {
          return `${dgTitle}编辑`
        } else {
          return `${dgTitle}查看`
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
          // 赋值删除&添加序号字段
          rows.forEach(item => {
            item.Scopes.delData = []
            item.Scopes.dlgVisible = false // 弹出状态
            item.Scopes.addNum = -1
            item.Secrets.delData = []
            item.Secrets.dlgVisible = false // 弹出状态
            item.Secrets.addNum = -1
          })
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
          thisVue.curr_rowdata[item.Name].delData = []
        } else {
          thisVue.curr_rowdata[item.Name].delData = []
        }
      })
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
          newRow[field.Name].delData = []
          newRow[field.Name].addNum = -1
          newRow[field.Name].dlgVisible = false // 弹出状态
        }
      })
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
      return elementExt.ExportXls.call(this, JsonData, fileName)
    }, // 导出数据
    ImportXls: function () {
      // console.log('ImportXls')
    }, // 导入数据
    formatter: elementExt.formatter, // el-table-column 数据显示转换
    el_remoteMethod: elementExt.el_remoteMethod, // 外键触发搜索
    dlgOK_Func: function () {
      console.log('dlgOK_Func')
    }, // 子组件触发父组件
    TabClick: function (tab, event) {
      // console.log('TabClick',tab);
      this.TabActiveName = tab.name
      var tabObjComponent = this.curr_rowdata[tab.name]
      tabObjComponent.dlgVisible = true // 设置异步组件显示
    } // tab点击事件
  }
}
</script>
