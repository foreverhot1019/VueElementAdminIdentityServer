<template>
  <div v-bind:class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div v-bind:class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!--修复fixed-header 滚动条被挡住 backToTop无效
      <div :style="{'padding-top': paddingTop+'px'}">
        123
      </div>-->
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
    <!-- you can add element-ui's tooltip-->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top />
    </el-tooltip>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, createNamespacedHelpers } from 'vuex'
import BackToTop from '@/components/BackToTop'
// 直接通过createNamespacedHelpers从指定module 导出 mapState mapGetters mapMutations mapActions
const app = createNamespacedHelpers('app')
const settings = createNamespacedHelpers('settings')

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    BackToTop
  },
  mixins: [ResizeMixin],
  computed: {
    ...app.mapGetters(['sidebar', 'device']),
    ...settings.mapGetters(['showSettings', 'fixedHeader']),
    ...settings.mapGetters({ needTagsView: 'tagsView' }),
    ...settings.mapState({
      paddingTop: state => (state.fixedHeader ? (50 + (state.tagsView ? 34 : 0)) : 0)
    }),
    // ...mapState({
    //  sidebar: state => state.app.sidebar,
    //  device: state => state.app.device,
    //  showSettings: state => state.settings.showSettings,
    //  needTagsView: state => state.settings.tagsView,
    //  fixedHeader: state => state.settings.fixedHeader,
    //  paddingTop: state => (state.settings.fixedHeader ? (50 + (state.settings.tagsView ? 34 : 0)) : 0)
    // }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar
    {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
