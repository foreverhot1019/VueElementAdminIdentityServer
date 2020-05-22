<template>
    <div id="div_UserManage">
        <AutoCRUD :ControllerName="controllerName" :Fields="Fields" />
    </div>
</template>
<script>
import AutoCRUD from '@/components/AutoCRUD'

// 枚举类型字段
export default {
  name: 'UserManage',
  components: { AutoCRUD },
  data () {
    // 渲染CRUD字段数据集
    let SetArrField = [
      { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'UserName', DisplayName: '登录名', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 20, MinLength: 5, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'SecurityStamp', DisplayName: '安全票根', Width_List: '290', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 64, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Email', DisplayName: '邮箱', Width_List: '180', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'PhoneNumber', DisplayName: '电话', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Password', DisplayName: '密码', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'password', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'ConfirmPassword', DisplayName: '确认密码', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'password', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Resource', DisplayName: '资源', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'LockoutEnabled', DisplayName: '锁定', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'AccessFailedCount', DisplayName: '登录失败', Width_List: '120', Width_input: '178', Type: 'number', Precision: 0, inputType: null, IsKey: false, Required: true, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'LockoutEndDateUtc', DisplayName: '锁定结束', Width_List: '*', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'datetime', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'LockoutEnd', DisplayName: '锁定结束', Width_List: '*', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'datetime', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null }
    ]
    return {
      Fields: SetArrField,
      controllerName: 'AccountManage' // CRUD 控制器
    }
  }
}
</script>
