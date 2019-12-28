<template>
  <div id="app">
   <!--把dom缓存在内存中  -->
   <m-hearder></m-hearder>
   <navtab></navtab>
  <keep-alive>
  <router-view></router-view>
  </keep-alive>
  <player></player>
  </div>
</template>
<script>
    import MHearder from './components/m_header/m_hearder.vue'
    import Navtab from './components/navtab/navtab.vue'
    import Player from './components/player/player.vue'
    export default {
      components:{
        MHearder,
        Navtab,
        Player
      }

    }
</script>

<style lang="less">
  @import './common/less/variable';
  // 全局属性 :去除默认现象产生，但不影响事件触发
  *{
    touch-action: none;
  }
  #app{
   color: @color-theme;
  }
 ul{
    padding: 0;
  }
  .auto{
    display: block;
    width: 100%;
  }
  .clearfix{
  overflow: hidden;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .one-wrap{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;


word-wrap:break-word
  }
</style>
