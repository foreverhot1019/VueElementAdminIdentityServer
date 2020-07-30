<template>
    <div id="div_IdsApiSecret">
        <AutoCRUD ref="AutoCRUD" :ControllerName="controllerName" :Fields="Fields" :title="title" formlabel_position="top" v-on:ParentgetSubmitData="getSubmitData" />
    </div>
</template>
<script>
import AutoCRUD from '@/components/AutoCRUD' // AutoCRUD组件
import _ from 'lodash'
// 自定义列数据(覆盖BaseArrField-ArrField行值)
// CustomerFields.Currency = {
//   Name: 'Currency', //名称
//   DisplayName:  '授权币制',//显示名称
//   IsKey: true, //主键v-on:-默认：false
//   Editable: true, //可编辑-默认：true
//   Required: true, //必填-默认：false
//   Type: 'string', //'datetime/number/string/boolean';//类型-默认: string
//   inputType: 'text', //'password/datetime/text/tagedit/tabedit';//form中的input类型-默认: text
//   IsForeignKey: true, //外键渲染为Select
//   multiple: true, //select多选
//   ForeignKeyGetListUrl: '/api/GetPagerPARA_CURR_FromCache', //获取外键数据Url
//   isEmail: true, //邮件格式
//   FormOrder: 1, //Form排序
//   FormShow: true, //Form中展示-默认：true
//   ListOrder: 1, //列表排序
//   ListShow: true, //列表展示-默认：true
//   MaxLength:  50, //最大长度
//   MinLength: 10, //最小长度
//   Precision: 2 //小数位位数 //Type为number时，可设置小数位
//   SearchOrder: 1, //搜索排序
//   SearchShow: true, //搜索中展示-默认：false
//   Sortable: true, //是否可排序-默认：false
//   Width_List: '120', //列表-列宽度 <=0 默认*，>0 此宽度为准
//   Width_input: '178', //Form-input宽度 <=0 默认*，>0 此宽度为准
// }

// 渲染CRUD字段数据集
let _ArrField = [
  { Name: 'Id', DisplayName: 'Id', Type: 'number', IsKey: true },
  { Name: 'ClientId', DisplayName: '客户端ID', Required: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'ClientName', DisplayName: '名称', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'Enabled', DisplayName: '启用', Type: 'boolean', Required: true, Width_List: '50', Editable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'Description', DisplayName: '描述', Editable: true, FormShow: true, ListShow: true, MaxLength: 1000 },
  // select选择框
  // { Name: 'AllowedGrantTypes', DisplayName: '允许发放类型', Editable: true, FormShow: true, IsForeignKey: true, multiple: true, ForeignKeyGetListUrl: '/api/ClientManage/GetAllowedGrantTypes' },
  { Name: 'AllowedScopes', DisplayName: '允许范围', Editable: true, FormShow: true, IsForeignKey: true, multiple: true, ForeignKeyGetListUrl: '/api/ClientManage/GetAllowedScopes' },
  { Name: 'AccessTokenType', DisplayName: '访问令牌类型', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'ClientUri', DisplayName: 'Uri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'LogoLUri', DisplayName: 'LogoLUri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'Created', DisplayName: '创建时间', Type: 'datetime', inputType: 'datetime', Editable: false, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'Updated', DisplayName: '更新时间', Type: 'datetime', inputType: 'datetime', Editable: false, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'LastAccessed', DisplayName: '最后访问时间', Type: 'datetime', inputType: 'datetime', Editable: false, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'IdentityTokenLifetime', DisplayName: '身份令牌寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'AccessTokenLifetime', DisplayName: '访问令牌寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'UpdateAccessTokenClaimsOnRefresh', DisplayName: '刷新时更新访问令牌票据', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'UserSsoLifetime', DisplayName: '用户SSO寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'UserCodeType', DisplayName: '用户码类型', Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowOfflineAccess', DisplayName: '允许离线登录', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'RequireConsent', DisplayName: '需要同意', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowRememberConsent', DisplayName: '允许记住同意', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AuthorizationCodeLifetime', DisplayName: '授权码寿命', Type: 'number', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'ConsentLifetime', DisplayName: '同意寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'AbsoluteRefreshTokenLifetime', DisplayName: '绝对刷新令牌的寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'SlidingRefreshTokenLifetime', DisplayName: '滑动刷新令牌的寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'RefreshTokenUsage', DisplayName: '刷新令牌用法', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'RefreshTokenExpiration', DisplayName: '刷新令牌过期时间', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'EnableLocalLogin', DisplayName: '启用本地登录', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'DeviceCodeLifetime', DisplayName: '设备代码寿命', Type: 'number', Editable: true, FormShow: true, ListShow: true },
  { Name: 'IncludeJwtId', DisplayName: '加入JwtId', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AlwaysSendClientClaims', DisplayName: '总是发送客户端票据', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'ClientClaimsPrefix', DisplayName: '票根前缀', Editable: true, FormShow: true, ListShow: true },
  { Name: 'PairWiseSubjectSalt', DisplayName: '配对主题盐', Editable: true, FormShow: true, ListShow: true, MaxLength: 1000 },
  { Name: 'ProtocolType', DisplayName: '协议类型', Editable: true, FormShow: true, ListShow: true },
  { Name: 'RequireClientSecret', DisplayName: '需要客户端密码', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AlwaysIncludeUserClaimsInIdToken', DisplayName: 'IdToken总是加入用户票据', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'RequirePkce', DisplayName: '需要Pkce', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowPlainTextPkce', DisplayName: '允许纯文本Pkce', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'AllowAccessTokensViaBrowser', DisplayName: '允许通过浏览器获取成功令牌', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'FrontChannelLogoutUri', DisplayName: '前通道注销Uri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'FrontChannelLogoutSessionRequired', DisplayName: '需要前通道注销会话', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'BackChannelLogoutUri', DisplayName: '反向通道注销Uri', Editable: true, FormShow: true, ListShow: true, MaxLength: 100 },
  { Name: 'BackChannelLogoutSessionRequired', DisplayName: '需要反向通道注销会话', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'NonEditable', DisplayName: '不可编辑', Type: 'boolean', Required: true, Editable: true, FormShow: true, ListShow: true },
  // tagEdit字段
  { Name: 'IdentityProviderRestrictions', DisplayName: '允许客户端身份提供者', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  { Name: 'AllowedCorsOrigins', DisplayName: '允许跨域地址', Width_input: '378', MaxLength: 100, inputType: 'tagedit', Editable: true, FormShow: true },
  { Name: 'RedirectUris', DisplayName: '跳转Uri', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  { Name: 'PostLogoutRedirectUris', DisplayName: '登出跳转Uri', Width_input: '378', inputType: 'tagedit', Editable: true, FormShow: true },
  // tab页面
  { Name: 'AllowedGrantTypes', DisplayName: '允许发放类型', Width_input: '378', inputType: 'tabedit', Editable: true },
  { Name: 'Properties', DisplayName: '属性', Width_input: '378', inputType: 'tabedit', Editable: true },
  { Name: 'Claims', DisplayName: '票根', Width_input: '378', inputType: 'tabedit', Editable: true },
  { Name: 'ClientSecrets', DisplayName: '密钥', Width_input: '378', inputType: 'tabedit', Editable: true }
]
_ArrField.AllowedGrantTypesFields = [
  { Name: 'Id', DisplayName: 'Id', Type: 'number', IsKey: true },
  { Name: 'GrantType', DisplayName: '发放类型', Required: true, Sortable: true, Editable: true, FormShow: true, ListShow: true, IsForeignKey: true, ForeignKeyGetListUrl: '/api/ClientManage/GetAllowedGrantTypes' },
  { Name: 'ClientId', DisplayName: '客户端', Type: 'number', Required: true, Editable: false }
]
_ArrField.AllowedGrantTypesFields.refFieldName = 'ClientId' // 与主表关联字段名称
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
  { Name: 'Type', DisplayName: '类型', Required: true, Sortable: true, Editable: false, FormShow: true, ListShow: true, MaxLength: 50 },
  { Name: 'Value', DisplayName: '值', Required: true, Sortable: true, Editable: true, FormShow: true, ListShow: true, MaxLength: 101 },
  { Name: 'Expiration', DisplayName: '过期时间', Type: 'datetime', inputType: 'datetime', Sortable: true, Editable: true, FormShow: true, ListShow: true },
  { Name: 'Created', DisplayName: '创建时间', Type: 'datetime', inputType: 'datetime', Sortable: true, SearchShow: true, FormShow: true, ListShow: true },
  { Name: 'Description', DisplayName: '描述', Editable: true, FormShow: true, ListShow: true, MaxLength: 1000 },
  { Name: 'ClientId', DisplayName: '客户端', Type: 'number', Required: true }
]
_ArrField.ClientSecretsFields.refFieldName = 'ClientId' // 与主表关联字段名称

// 枚举类型字段
export default {
  name: 'IdsClient', // 页面名称（当组件引用时用到）
  components: { AutoCRUD }, // AutoCRUD组件
  data () {
    return {
      title: '客户端',
      Fields: _ArrField,
      controllerName: 'ClientManage' // CRUD控制器
    }
  },
  methods: {
    getSubmitData (callback) { // 获取提交数据
      let thisVue = this.$refs['AutoCRUD'] // 转换为子组件
      let MyForm = thisVue.$refs['MyForm']
      var batchSaveData = { // 批量操作数据
        inserted: [],
        deleted: [],
        updated: []
      }
      // MyForm.resetFields()// 清除验证
      MyForm.clearValidate()// 清除验证
      MyForm.validate(function (valid) {
        if (valid) {
          let postData = _.defaultsDeep({}, thisVue.curr_rowdata)
          let AllowedGrantTypes = []
          postData.AllowedGrantTypes.forEach((i, idx) => {
            AllowedGrantTypes.push(i.GrantType)
            // AllowedGrantTypes[idx] = i.GrantType
          })
          postData.AllowedGrantTypes = AllowedGrantTypes
          let Properties = {}
          postData.Properties.forEach(element => {
            Properties[element.Key] = element.Value
          })
          postData.Properties = Properties
          console.log('dlgSubmit', postData)
          if (postData.Id <= 0) {
            batchSaveData.inserted.push(postData)
          } else {
            batchSaveData.updated.push(postData)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      if (callback) {
        callback(batchSaveData)
      } else {
        return batchSaveData
      }
    }
  }
}
</script>
