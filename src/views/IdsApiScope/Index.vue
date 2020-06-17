<template>
    <div id="div_IdsApiScope">
        <AutoCRUD :ControllerName="controllerName" :Fields="Fields" />
    </div>
</template>
<script>
import AutoCRUD from '@/components/AutoCRUD' // AutoCRUD组件

// 枚举类型字段
export default {
  name: 'IdsApiScope', // 页面名称（当组件引用时用到）
  components: { AutoCRUD }, // AutoCRUD组件
  data () {
    // 渲染CRUD字段数据集
    let SetArrField = [
      { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'number', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Name', DisplayName: '名称', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 50, MinLength: 0, ListOrder: 1, SearchOrder: 1, FormOrder: 1, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'DisplayName', DisplayName: '显示名称', Width_List: '200', Width_input: '278', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 200, MinLength: 0, ListOrder: 3, SearchOrder: 3, FormOrder: 3, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Description', DisplayName: '描述', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 4, SearchOrder: 4, FormOrder: 4, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Required', DisplayName: '必须', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Emphasize', DisplayName: '强调范围', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'ShowInDiscoveryDocument', DisplayName: '服务发现', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 2, SearchOrder: 2, FormOrder: 2, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'UserClaims', DisplayName: '用户票根', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 5, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'ApiResourceId', DisplayName: 'Api资源', Width_List: '120', Width_input: '378', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: true, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 6, IsForeignKey: true, ForeignKeyGetListUrl: '/api/ApiResource' }
    ]
    return {
      Fields: SetArrField,
      controllerName: 'ApiScope' // CRUD控制器
    }
  }
}
</script>
