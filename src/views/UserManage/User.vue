<template>
    <div id="div_UserManage">
        <AutoCRUD ref="AutoCRUD" :ControllerName="controllerName" :Fields="Fields" v-on:ParentgetSubmitData="getSubmitData"/>
        <el-drawer ref="drawer" title="权限选择" direction="btt" :show-close="false" size="50%" :visible.sync="showDrawer" :before-close="closeDrawer" >
          <el-container>
            <el-main>
              <el-select v-model="seltRole" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in roleOptions"
                  :key="item.ID"
                  :label="item.TEXT"
                  :value="item.TEXT">
                </el-option>
              </el-select>
              <el-button type="primary" @click="saveRole">主要按钮</el-button>
              <el-table :data="crrrentUserRole">
                <el-table-column property="UserName" label="用户名" width="150"></el-table-column>
                <el-table-column property="Role" label="权限" width="200"></el-table-column>
              </el-table>
            </el-main>
            <el-footer>
              <el-button @click="closeDrawer">取 消</el-button>
              <el-button type="primary" @click="closeDrawer">确定</el-button>
            </el-footer>
          </el-container>
        </el-drawer>
    </div>
</template>
<script>
import AutoCRUD from '@/components/AutoCRUD' // AutoCRUD组件
import _ from 'lodash'
import { getAllRoles, getRolesByUserId } from '@/axiosAPI/role'
import * as utils from '@/utils'
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

// 枚举类型字段
export default {
  name: 'UserManage', // 页面名称（当组件引用时用到）
  components: { AutoCRUD }, // AutoCRUD组件
  data () {
    // 渲染CRUD字段数据集
    let SetArrField = [
      { Name: 'Id', DisplayName: 'Id', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: true, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'UserName', DisplayName: '登录名', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: true, FormShow: true, ListShow: true, MaxLength: 20, MinLength: 5, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'SecurityStamp', DisplayName: '安全票根', Width_List: '290', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 64, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Email', DisplayName: '邮箱', Width_List: '180', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: true, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'PhoneNumber', DisplayName: '电话', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Password', DisplayName: '密码', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'password', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'ConfirmPassword', DisplayName: '确认密码', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'password', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Resource', DisplayName: '资源', Width_List: '120', Width_input: '178', Type: 'string', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'LockoutEnabled', DisplayName: '锁定', Width_List: '120', Width_input: '178', Type: 'boolean', Precision: null, inputType: 'text', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'AccessFailedCount', DisplayName: '登录失败', Width_List: '120', Width_input: '178', Type: 'number', Precision: 0, inputType: null, IsKey: false, Required: true, Sortable: false, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'LockoutEndDateUtc', DisplayName: '锁定结束', Width_List: '*', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'datetime', IsKey: false, Required: false, Sortable: false, Editable: true, SearchShow: false, FormShow: true, ListShow: false, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'LockoutEnd', DisplayName: '锁定结束', Width_List: '*', Width_input: '178', Type: 'datetime', Precision: null, inputType: 'datetime', IsKey: false, Required: false, Sortable: true, Editable: false, SearchShow: false, FormShow: false, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'Tags', DisplayName: '标签', Width_List: '*', Width_input: '178', Type: 'string', Precision: null, inputType: 'tagedit', IsKey: false, Required: false, Sortable: true, Editable: true, SearchShow: false, FormShow: true, ListShow: true, MaxLength: 0, MinLength: 0, ListOrder: 0, SearchOrder: 0, FormOrder: 0, IsForeignKey: false, ForeignKeyGetListUrl: null },
      { Name: 'ArrUserRole', DisplayName: '权限', Editable: false, FormShow: false, ListShow: false }
    ]
    return {
      seltRole: '', // 选择的权限
      roleOptions: [], // 权限数据集合
      crrrentUserId: '', // 当前编辑数据
      crrrentUserName: '', // 当前编辑数据
      crrrentUserRole: [], // 当前权限数据
      showDrawer: false, // 打开抽屉
      Fields: SetArrField,
      controllerName: 'AccountManage' // CRUD控制器
    }
  },
  created () {
    let thisVue = this
    getAllRoles().then(res => {
      thisVue.roleOptions = res
    }).catch(error => {
      thisVue.$message({
        duration: 10, // 不自动关闭
        showClose: true,
        message: `获取用户权限错误:${error.message}`,
        type: 'error'
      })
    })
  }, // 数据初始化，还未渲染dom,在此处设置的数据 不受影响
  methods: {
    getSubmitData (callback) { // 获取提交数据
      let thisVue = this
      if (!thisVue.showDrawer) {
        let childVue = this.$refs['AutoCRUD'] // 转换为子组件
        thisVue.crrrentUserId = childVue.curr_rowdata.Id
        thisVue.crrrentUserName = childVue.curr_rowdata.UserName
        thisVue.getUserRole() // 获取用户权限数据
        thisVue.showDrawer = true // 打开抽屉
        if (callback) {
          callback({ Success: true }) // 不执行callback 让子组件停止往下执行
        } else {
          return { Success: true }
        }
      } else {
        return { Success: true }
      }
    }, // 提交数据前触发抽屉选择
    getUserRole () {
      var that = this
      let childVue = this.$refs['AutoCRUD']
      if (utils.objIsEmpty(that.crrrentUserId)) {
        that.$message({
          duration: 10, // 不自动关闭
          showClose: true,
          message: '获取用户权限错误:用户Id不能为空',
          type: 'error'
        })
      } else {
        getRolesByUserId(that.crrrentUserId).then(res => {
          that.crrrentUserRole = res.map(item => {
            return { UserName: that.crrrentUserName, Role: item }
          })
          childVue.curr_rowdata.ArrUserRole = _.defaultsDeep([], res) // 深度拷贝数据Object.assign只能深度拷贝一层
        }).catch(error => {
          let ErrMsg = error.ErrMsg || '意外错误'
          that.$message({
            duration: 10, // 不自动关闭
            showClose: true,
            message: `获取用户权限错误: ${ErrMsg}`,
            type: 'error'
          })
        })
      }
    }, // 获取用户权限
    closeDrawer (closeFunc) {
      let thisVue = this // 转换为子组件
      let childVue = this.$refs['AutoCRUD'] // 转换为子组件
      // 赋值权限数据到当前编辑数据集
      childVue.curr_rowdata.ArrUserRole = this.crrrentUserRole.map(item => {
        return item.Role
      })
      if (typeof closeFunc === 'function') {
        closeFunc()
      }
      childVue.dlgSubmit() // 触发子组件保存事件
      thisVue.showDrawer = false // 打开抽屉
    }, // 关闭抽屉时触发子组件保存
    saveRole (e) {
      let thisVue = this // 转换为子组件
      if (!utils.objIsEmpty(thisVue.seltRole)) {
        this.crrrentUserRole.push({ UserName: thisVue.crrrentUserName, Role: thisVue.seltRole })
        thisVue.seltRole = '' // 清空选择的权限
      }
    } // 保存权限数据
  }
}
</script>
