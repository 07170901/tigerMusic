<template>
    <div class="m_hearder">
      <div class="icon"></div>
      <h1 class="text">Tiger Music</h1>
    </div>
</template>

<script>
</script>

<style lang="less" scoped>
  @import  "../../common/less/variable.less";
  .m_hearder{
    position: relative;
    height: 44px;
    text-align: center;
    color: @color-theme;
    .icon{
      display: inline-block;
      vertical-align: top;
      margin-top:6px ;
      width: 32px;
      height: 32px;
      margin-right: 4px;
      background: url(tiger.jpg) no-repeat center center;
      background-size: 32px 32px;
    }
    .text{
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
       font-size: @font-size-large
        
    }
    .mine{
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine{
        display: block;
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
      }
       
    }
     
  }
</style>
