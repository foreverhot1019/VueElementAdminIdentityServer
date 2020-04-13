<template>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo"
           @open="handleOpen" @close="handleClose"
           unique-opened
           router
           background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <template v-for="(menu,i) in ArrMenu">
      <el-submenu v-if="(menu.sub.length>0 || menu.group.length>0)" :index="menu.id" :key="'sub'+i">
        <template slot="title">
          <i class="el-icon-fa fa-android"></i>
          <span>{{menu.name}}</span>
        </template>
        <template v-for="(gpitem, ii) in menu.group">
          <el-menu-item-group :key="'gpsubitem'+ii" :index="gpitem.id">
            <template slot="title">
              <i class="el-icon-fa fa-cog"></i>
              <span slot="title" :key="'gpsub'+ii">{{gpitem.name}}</span>
            </template>
            <el-menu-item v-for="(item, iii) in gpitem.sub" :index="'/'+item.id" :key="'gpitem'+iii">
              <i class="el-icon-fa fa-cab"></i>
              {{item.name}}
            </el-menu-item>
          </el-menu-item-group>
        </template>
        <template v-for="(subitem, idx) in menu.sub">
          <el-menu-item v-if="subitem.sub==null || subitem.sub==='undefined' || subitem.sub.length<=0" :index="'/'+subitem.id" :key="'subitem'+idx">
            <i class="el-icon-fa fa-bus"></i>
            <span slot="title">{{subitem.name}}</span>
          </el-menu-item>
          <el-submenu v-else :index="subitem.id" :key="'Msubitem'+idx">
            <template slot="title">
              <el-button icon="fa fa-compass">取消</el-button>
              {{subitem.name}}
            </template>
            <el-menu-item v-for="(itemsub,y) in subitem.sub" :index="'/'+itemsub.id" :key="'subitem'+y">
              <i class="el-icon-fa fa-icon-angellist"></i>
              <span slot="title">{{itemsub.name}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-submenu>
      <el-menu-item v-else :index="'/'+menu.componentName" :key="'mitem'+i">
        <i class="el-icon-fa fa-address-card-o"></i>
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
import MenuConfig from '@/router/config'
export default {
  data () {
    return {
      ArrMenu: MenuConfig
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
