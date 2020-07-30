<template>
    <div id="div_Role">
        <AutoCRUD :ControllerName="controllerName" :Fields="Fields" />
    </div>
</template>
<script>
import AutoCRUD from '@/components/AutoCRUD' // AutoCRUD组件

// 枚举类型字段
export default {
  name: 'UserManage', // 页面名称（当组件引用时用到）
  components: { AutoCRUD }, // AutoCRUD组件
  data () {
    // 渲染CRUD字段数据集
    let SetArrField = [
      { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Name', DisplayName: '权限名', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 20, MinLength: 5, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'NormalizedName', DisplayName: '普通名称', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 20, MinLength: 5, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'ConcurrencyStamp', DisplayName: '安全票根', Width_List: '290', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 64, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null }
    ]
    return {
      Fields: SetArrField,
      controllerName: 'Role' // CRUD控制器
    }
  }
}
</script>
