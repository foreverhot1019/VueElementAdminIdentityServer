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
                        v-bind:width="field.Width_List|| '120px'"
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
    <!--弹出框-->
    <el-dialog ref="MyDialog" width="60%" center v-el-drag-dialog
      v-if="curr_rowdata !== null && JSON.stringify(curr_rowdata) !== '{}'"
      :visible.sync="centerDialogVisible"
      :fullscreen="dlgfullscreen"
      v-loading="dlgLoading"
      :show-close="false">
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
      <el-form ref="MyForm" v-bind:model="curr_rowdata" v-bind:label-position="label_position||'right'" inline size="small">
          <el-form-item v-for="field in ArrFormField"
                    v-bind:key="field.Name"
                    v-bind:label-width="formLabelWidth"
                    v-bind:label="field.DisplayName"
                    v-bind:prop="field.Name"
                    v-bind:rules="el_FormFieldRules(field)"
                    v-bind:style="{'width': ((field.Width_input||178)+formLabelWidth)+'px'}">
                <component v-if="!field.IsForeignKey && field.FormShow && field.inputType !== 'tagedit'"
                           v-bind:is="el_inputType(field)"
                           v-bind:disabled="field.IsKey || (!field.Editable&&curr_rowdata.Id>0)"
                           v-model="curr_rowdata[field.Name]"
                           v-bind:prop="field.Name"
                           v-bind:type="el_inputProtoType(field)"
                           v-bind:precision="field.Precision"
                           v-bind:clearable="true"
                           v-bind:show-word-limit="(field.MaxLength||50)>0"
                           v-bind:maxlength="field.MaxLength||50"
                           v-bind:minlength="field.MinLength||50"
                           v-bind:style="{'width': (field.Width_input||178)+'px'}">
                    <i slot="suffix" class="el-input__icon fa"
                       v-if="field.Name.toLowerCase().indexOf('password')>=0"
                       v-show="field.Name.toLowerCase().indexOf('password')>=0"
                       v-on:click="pswView(field)"
                       v-bind:class="el_inputClass(field)"></i>
                </component>
                <component v-else-if="field.FormShow && field.inputType === 'tagedit'"
                           v-bind:is="el_inputType(field)"
                           v-model="curr_rowdata[field.Name]"
                           v-bind:style="{'width':(field.Width_input||178)+'px'}"
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
          <el-tabs v-model="TabActiveName" ref="el_Tab" type="border-card" v-on:tab-click="TabClick">
              <template v-for="tab in ArrTabEditField" >
                <el-tab-pane v-bind:label="tab.DisplayName" v-bind:name="tab.Name" v-bind:key="tab.Name">
                  <AutoCRUDLocal v-bind:ref="tab.Name"
                    v-if="curr_rowdata[tab.Name].dlgVisible"
                    v-bind:refFieldVal="curr_rowdata.Id.toString()"
                    v-bind:refFieldName="Fields[tab.Name+'Fields'].refFieldName"
                    v-model="curr_rowdata[tab.Name]"
                    v-bind:delData="curr_rowdata[tab.Name].delData"
                    v-bind:Fields="Fields[tab.Name+'Fields']"
                    v-on:dlgok_func="dlgOK_Func"></AutoCRUDLocal>
                    <!-- _self 获取vue实例 filters
                    v-bind:Fields="tab.Name+'Fields'|getVueDataByStr"
                    v-bind:Fields="_self[tab.Name+'Fields'}" -->
                  <!--keep-alive 保持上次渲染时的状态
                  include: 字符串或正则表达式。只有匹配的组件会被缓存。
                  exclude: 字符串或正则表达式。任何匹配的组件都不会被缓存。-->
                </el-tab-pane>
              </template>
          </el-tabs><!--Api范围/api密钥-->
      </el-form>
      <span slot="footer" class="dialog-footer"><!--底部按钮组-->
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-bind:disabled="!$route.meta.Edit" @click="dlgSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import BaseApi from '@/axiosAPI/BaseApi'
import { objIsEmpty } from '@/utils'
import elementExt from '@/utils/elementExtention'
// import LazyLoading from '@/components/LazyLoading' // 异步加载

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

// 渲染CRUD字段数据集
let _ArrField = [
  { Name: 'Id', DisplayName: 'Id', Type: 'number', IsKey: true },
  { Name: 'AuthorizationCodeLifetime', DisplayName: '授权码寿命', Type: 'number', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'ConsentLifetime', DisplayName: '同意寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'AbsoluteRefreshTokenLifetime', DisplayName: '绝对刷新令牌的寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'SlidingRefreshTokenLifetime', DisplayName: '滑动刷新令牌的寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'RefreshTokenUsage', DisplayName: '刷新令牌用法', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'UpdateAccessTokenClaimsOnRefresh', DisplayName: '刷新时更新访问令牌票据', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'RefreshTokenExpiration', DisplayName: '刷新令牌过期时间', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'AccessTokenType', DisplayName: '访问令牌类型', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'EnableLocalLogin', DisplayName: '启用本地登录', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AccessTokenLifetime', DisplayName: '访问令牌寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'IncludeJwtId', DisplayName: '加入JwtId', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AlwaysSendClientClaims', DisplayName: '总是发送客户端票据', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'ClientClaimsPrefix', DisplayName: '票根前缀', Editable: true, FormShow: true, ListShow: true },
  { Name: 'PairWiseSubjectSalt', DisplayName: '配对主题盐', Editable: true, FormShow: true, ListShow: true, MaxLength: 1000 },
  { Name: 'Created', DisplayName: '创建时间', Type: 'datetime', inputType: 'datetime', Editable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'Updated', DisplayName: '更新时间', Type: 'datetime', inputType: 'datetime', Editable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'LastAccessed', DisplayName: '最后访问时间', Type: 'datetime', inputType: 'datetime', Editable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'UserSsoLifetime', DisplayName: '用户SSO寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'UserCodeType', DisplayName: '用户码类型', Editable: true, FormShow: true, ListShow: true },
  { Name: 'IdentityTokenLifetime', DisplayName: '身份令牌寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowOfflineAccess', DisplayName: '允许离线登录', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'Enabled', DisplayName: '启用', Type: 'boolean', Required: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'ClientId', DisplayName: '客户端ID', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'ProtocolType', DisplayName: '协议类型', Editable: true, FormShow: true, ListShow: true },
  { Name: 'RequireClientSecret', DisplayName: '需要客户端密码', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'ClientName', DisplayName: '名称', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'Description', DisplayName: '描述', Editable: true, FormShow: true, ListShow: true, MaxLength: 1000 },
  { Name: 'ClientUri', DisplayName: 'Uri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'LogoLUri', DisplayName: 'LogoLUri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'RequireConsent', DisplayName: '需要同意', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowRememberConsent', DisplayName: '允许记住同意', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AlwaysIncludeUserClaimsInIdToken', DisplayName: 'IdToken总是加入用户票据', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'RequirePkce', DisplayName: '需要Pkce', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowPlainTextPkce', DisplayName: '允许纯文本Pkce', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowAccessTokensViaBrowser', DisplayName: '允许通过浏览器获取成功令牌', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'FrontChannelLogoutUri', DisplayName: '前通道注销Uri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'FrontChannelLogoutSessionRequired', DisplayName: '需要前通道注销会话', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'BackChannelLogoutUri', DisplayName: '反向通道注销Uri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'BackChannelLogoutSessionRequired', DisplayName: '需要反向通道注销会话', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'DeviceCodeLifetime', DisplayName: '设备代码寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'NonEditable', DisplayName: '不可编辑', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  // select选择框
  { Name: 'AllowedScopes', DisplayName: '允许范围', Editable: true, FormShow: true, IsForeignKey: true, multiple: true, ForeignKeyGetListUrl: '/api/ClinetManage/GetAllowedScopes' },
  { Name: 'AllowedGrantTypes', DisplayName: '允许发放类型', Editable: true, FormShow: true, IsForeignKey: true, ForeignKeyGetListUrl: '/api/ClinetManage/GetAllowedGrantTypes' },
  // tagEdit字段
  { Name: 'IdentityProviderRestrictions', DisplayName: '允许客户端身份提供者', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  { Name: 'AllowedCorsOrigins', DisplayName: '允许跨域地址', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  { Name: 'RedirectUris', DisplayName: '跳转Uri', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  { Name: 'PostLogoutRedirectUris', DisplayName: '登出跳转Uri', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  // tab页面
  { Name: 'Properties', DisplayName: '属性', Width_input: '378', inputType: 'tabedit', Editable: true },
  { Name: 'Claims', DisplayName: '票根', Width_input: '378', inputType: 'tabedit', Editable: true },
  { Name: 'ClientSecrets', DisplayName: '密钥', Width_input: '378', inputType: 'tabedit', Editable: true }
]
// 必须是 字段名+Fields
_ArrField.PropertiesFields = [
  { Name: 'Id', DisplayName: 'Id', Type: 'number', IsKey: true },
  { Name: 'Key', DisplayName: '键', Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 50 },
  { Name: 'Value', DisplayName: '值', Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'ClientId', DisplayName: '客户端', Type: 'number', Required: true, Editable: false }
]
_ArrField.PropertiesFields.refFieldName = 'ClientId' // 与主表关联字段名称
// 必须是 字段名+Fields
_ArrField.ClaimsFields = [
  { Name: 'Id', DisplayName: 'Id', Type: 'number', IsKey: true },
  { Name: 'Type', DisplayName: '类型', Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 50 },
  { Name: 'Value', DisplayName: '值', Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'ClientId', DisplayName: '客户端', Type: 'number', Required: true, Editable: false }
]
_ArrField.ClaimsFields.refFieldName = 'ClientId' // 与主表关联字段名称
// 必须是 字段名+Fields
_ArrField.ClientSecretsFields = [
  { Name: 'Id', DisplayName: 'Id', Type: 'number', IsKey: true },
  { Name: 'Type', DisplayName: '类型', Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 50 },
  { Name: 'Value', DisplayName: '值', Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'Expiration', DisplayName: '过期时间', Type: 'datetime', inputType: 'datetime', Sortable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'Created', DisplayName: '创建时间', Type: 'datetime', inputType: 'datetime', Sortable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'Description', DisplayName: '描述', Editable: true, FormShow: true, ListShow: true, MaxLength: 1000 },
  { Name: 'ClientId', DisplayName: '客户端', Type: 'number', Required: true }
]
_ArrField.ClientSecretsFields.refFieldName = 'ClientId' // 与主表关联字段名称
// 枚举类型字段
export default {
  name: 'IdsClient', // 页面名称（当组件引用时用到）
  components: {
    TagEdit: () => import('components/TagEdit'), // 标签编辑展示
    AutoCRUDLocal: () => import('components/AutoCRUDLocal') // 本地数据CRUD
  },
  directives: {}, // 注册局部指令
  created: function () {
    // 设置控制器
    BaseApi.SetController('ClientManage')
    this.fieldsUpdate()
    // 为了filters能使用this指向vue实例
    this._f = function (id) {
      return this.$options.filters[id].bind(this._self)
    }
  }, // 数据初始化，还未渲染dom,在此处设置的数据 不受响应
  mounted: function () {
    this.tb_GetData() // table数据初始化
    this.$set(this.el_selt, 'el_selt_loading', false) // 选择框loding状态
  }, // 相当于构造函数，渲染完dom后触发
  filters: { // v-bind可以使用，v-model 无效
    getVueDataByStr: function (dataNameStr) {
      return this[dataNameStr]
    } // 通过string获取Vue数据
  }, // 数据过滤器
  data: function () {
    var tb = {
      title: 'Ids客户端', // 页面名称
      TabActiveName: '', // 选中tab名称
      AddNum: 0, // 新增序号
      method: 'post', // HTTP请求方法
      tbLoading: true, // 加载中
      addRows: [], // 新增的行
      selctRows: [], // 选中行
      curr_rowdata: {}, // 当前选择的行
      curr_rowdata_Original: {}, // 当前行原始数据
      centerDialogVisible: false, // 弹出框是否打开
      dlgfullscreen: false, // 弹出框全屏
      dlgLoading: false, // 弹出框加载状态
      formLabelWidth: this.formlabel_width || '100px',
      label_position: 'top', // Label排列位置
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
    tb.Fields = _ArrField // 所有需要渲染的字段集合
    tb.ArrEnumField = [] // 所有外键select字段
    tb.ArrFormField = [] // ArrFormField // 添加/编辑字段 通过此配置渲染
    tb.ArrListField = [] // ArrListField // table展示列 通过此配置渲染
    tb.ArrSearchField = [] // ArrSearchField // 搜索字段数据通过此配置渲染
    tb.ArrTagEditField = [] // ArrTagEditField // 数组字段数据通过此配置渲染
    tb.ArrTabEditField = [] // ArrTabEditField // Tab展示字段数据通过此配置渲染
    // tb.valid_rules = valid_rules
    // el-select 搜索框数据
    // tb.PropertiesFields = _PropertiesFields // 属性
    // tb.ClaimsFields = _ClaimsFields // 票根
    // tb.ClientSecretsFields = _ClientSecretsFields // 密钥
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
      thisVue.$set(thisVue, 'ArrTabEditField', [])
      let ArrEnumField = thisVue.ArrEnumField // 所有外键select字段
      let ArrFormField = thisVue.ArrFormField // 添加/编辑字段 通过此配置渲染
      let ArrListField = thisVue.ArrListField // table展示列 通过此配置渲染
      let ArrSearchField = thisVue.ArrSearchField // 搜索字段数据通过此配置渲染
      let ArrTagEditField = thisVue.ArrTagEditField // 所有数组编辑字段
      let ArrTabEditField = thisVue.ArrTabEditField // Tab编辑字段
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
          if (item.inputType === 'tabedit') {
            ArrTabEditField.push(item)
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
          // // 赋值删除&添加序号字段
          // rows.forEach(item => {
          //   thisVue.ArrTabEditField.forEach(tab => {
          //     item[tab.Name] = {
          //       delData: [], // 记录删除数据
          //       dlgVisible: false, // 弹出状态
          //       addNum: -1 // 记录新增序号
          //     }
          //   })
          //   // item.Properties.delData = []
          //   // item.Properties.dlgVisible = false // 弹出状态
          //   // item.Properties.addNum = -1
          //   // item.Claims.delData = []
          //   // item.Claims.dlgVisible = false // 弹出状态
          //   // item.Claims.addNum = -1
          //   // item.ClientSecrets.delData = []
          //   // item.ClientSecrets.dlgVisible = false // 弹出状态
          //   // item.ClientSecrets.addNum = -1
          // })
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
        }
        // } else {
        //   var qArrTagEdit = thisVue.ArrTagEditField.filter(function (field) { return field.Name === item })
        //   if (qArrTagEdit.length > 0) {
        //     currRowData[item] = []
        //   }
        // }
      })
      // 赋值删除&添加序号字段
      thisVue.ArrTagEditField.forEach(item => {
        let tagVal = thisVue.curr_rowdata[item.Name]
        if (objIsEmpty(tagVal)) {
          thisVue.curr_rowdata[item.Name] = []
        }
      })
      // 赋值删除&添加序号字段
      thisVue.ArrTabEditField.forEach(item => {
        let tagVal = thisVue.curr_rowdata[item.Name]
        if (objIsEmpty(tagVal)) {
          thisVue.curr_rowdata[item.Name] = []
          thisVue.curr_rowdata[item.Name].delData = [] // 记录删除数据
          thisVue.curr_rowdata[item.Name].dlgVisible = false // 弹出状态
          thisVue.curr_rowdata[item.Name].addNum = -1 // 记录新增序号
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
        }
      })
      // 赋值删除&添加序号字段
      thisVue.ArrTabEditField.forEach(tab => {
        newRow[tab.Name] = []
        newRow[tab.Name].delData = [] // 记录删除数据
        newRow[tab.Name].dlgVisible = false // 弹出状态
        newRow[tab.Name].addNum = -1 // 记录新增序号
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
    dlgClose: function () { // 弹出框关闭时触发
      this.centerDialogVisible = false
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
      // console.log('TabClick', tab)
      this.TabActiveName = tab.name
      var tabObjComponent = this.curr_rowdata[tab.name]
      tabObjComponent.dlgVisible = true // 设置异步组件显示
    } // tab点击事件
  }
}
</script>
