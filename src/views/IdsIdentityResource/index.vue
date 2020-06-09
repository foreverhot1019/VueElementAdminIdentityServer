<template>
    <div id="div_IdsIdentityResource">
        <AutoCRUD :ControllerName="controllerName" :Fields="Fields" />
    </div>
</template>
<script>
import AutoCRUD from '@/components/AutoCRUD' // AutoCRUD组件

// 枚举类型字段
export default {
  name: 'IdsIdentityResource', // 页面名称（当组件引用时用到）
  components: { AutoCRUD }, // AutoCRUD组件
  data () {
    // 渲染CRUD字段数据集
    let SetArrField = [
      { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'number', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Enabled', DisplayName: 'Enabled', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Name', DisplayName: 'Name', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 2000, MinLength: 0, ListOrder: 1, SearchOrder: 1, FormOrder: 1, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'DisplayName', DisplayName: 'DisplayName', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 200, MinLength: 0, ListOrder: 3, SearchOrder: 3, FormOrder: 3, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Description', DisplayName: 'Description', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 4, SearchOrder: 4, FormOrder: 4, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'UserClaims', DisplayName: 'UserClaims', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'TagEdit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Properties', DisplayName: 'Properties', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'TagEdit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 6, IsForeignKey: false, ForeignKeyGetListUrl: null }
    ]
    return {
      Fields: SetArrField,
      controllerName: 'IdentityResource' // CRUD控制器
    }
  }
}
</script>
