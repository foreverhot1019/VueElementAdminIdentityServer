<template>
  <div id="div_CRUD">
    <!--搜索条件-->
    <!--工具条-->
    <el-row style="background-color: #eee; padding:10px 0px 0px 10px">
        <el-col>
            <el-form v-bind:inline="true" v-bind:model="filters.filterRules" size="mini" ref="tb_search">
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
    <!--按钮组-->
    <el-row style="padding: 3px 10px 3px 10px;">
        <el-col>
            <el-button-group>
                <el-button type="primary" icon="el-icon-plus" size="small" v-bind:disabled="!UserRoles.Create" v-on:click="handleAddRow">新增</el-button>
                <el-button icon="el-icon-download" size="small" v-bind:disabled="!UserRoles.Export" v-on:click="ExportXls(tableData,'Excel导入配置')">导出</el-button>
                <el-button icon="el-icon-upload" size="small" v-bind:disabled="!UserRoles.Import" v-on:click="ImportXls">导入</el-button>
            </el-button-group>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <el-table ref="Mytb" size="mini" style="width: 100%" max-height="500" row-key="Id" border stripe
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
                <el-table-column fixed="right" label="操作" width="51" v-if="UserRoles.Delete">
                    <template slot-scope="sp">
                        <el-tooltip content="删除" placement="top" effect="light">
                            <el-button type="danger" size="mini" icon="el-icon-delete" circle v-bind:disabled="!UserRoles.Delete" v-on:click.native.prevent="deleteRow(sp.$index, sp.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-row style="padding-top: 10px;">
                <el-col v-bind:span="8">
                    <el-button type="danger" size="small" v-on:click="handledelSeltRow" v-bind:disabled="(UserRoles.Delete ? selctRows.length===0 : true)">批量删除</el-button>
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
                           v-bind:show-word-limit="(field.MaxLength||0)>0"
                           v-bind:maxlength="field.MaxLength||50"
                           v-bind:minlength="field.MinLength||50"
                           v-bind:style="{'width':field.Width_input+'px'}">
                    <i slot="suffix" class="el-input__icon fa"
                       v-show="field.Name.toLowerCase().indexOf('password')>=0"
                       v-on:click="pswView(field)"
                       v-bind:class="el_inputClass(field)"></i>
                </component>
                <component v-else-if="field.inputType === 'tagedit'" v-bind:is="el_inputType(field)"
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-on:click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" v-bind:disabled="!UserRoles.Edit" v-on:click="dlgSubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import BaseApi from '@/axiosAPI/BaseApi'
import MycRUDMixin from '@/Mixins/CRUDMixin'
import { objIsEmpty } from '@/utils'
import TagEdit from '@/components/TagEdit' // 标签编辑展示

let { cRUDMixin, BaseArrField, CustomerFields } = MycRUDMixin
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
// 初始化渲染字段数据
// BaseArrField.IsFormOrder = false
// BaseArrField.IsListOrder = false
// BaseArrField.IsSearchOrder = false
// BaseArrField.SetArrField = [
//   { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null }
// ]
// 设置控制器
// BaseApi.SetController('AccountManage')
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
    Fields: {
      type: Array,
      required: true
    }
  },
  components: {
    TagEdit // 标签编辑展示
  },
  created: function () {
    let { CustomerFields: propCustomerFields, Fields, ControllerName } = this
    // 设置自定义数据
    if (!objIsEmpty(propCustomerFields)) {
      propCustomerFields.entries().foreach((key, value) => {
        CustomerFields[key] = value
      })
    }
    // 初始化渲染CRUD字段数据
    BaseArrField.SetArrField = Fields
    // 设置控制器
    BaseApi.SetController(ControllerName)
  }, // 渲染dom前触发
  mixins: [cRUDMixin] // 混入
}
</script>
