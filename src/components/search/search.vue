<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="inp clearfix">
      <div class="searchIcon fl ">
        <img class="auto" src="../../assets/search.png" alt="">
      </div>
      <input type="text" class="inptext fl" placeholder="搜索歌曲或歌手">
    </div>
    <!-- 热门搜索 -->
    <div class="hotsearch">
      <div>热门搜索</div>
      <ul class="clearfix">
        <li v-for="(item,index) in hots" :key="index">
          {{item.first}}
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default{
    name:'search',
    data(){
      return{
        hots:[]
      }
    },
    created() {
      this._getHotText()
    },
    methods:{
      _getHotText(){
        axios({
          method:'get',
          url:'http://www.arthurdon.top:3000/search/hot'
        }).then((result)=>{
        this.hots =result.data.result.hots
        })
      }
    }

  }
</script>

<style lang="less" scoped>
 @import  '../../common/less/variable.less';
    .search{
      .inp{
        margin: 10px 20px;
        background-color: @color-highlight-background;
        border-radius: 8px;
        .searchIcon{
          width: 14px;
          padding: 8px 12px;
        }
        .inptext{
         padding: 0;
         border: none;
         height: 30px;
         outline: none;
         width: calc(~'100% - 14px - 24px');
         font-size: @font-size-medium;
         background-color: transparent;
         color: @color-text-d;
        }
      }
      .hotsearch{
        margin:20px 28px 20px;
        font-size: @font-size-medium;
        color: @color-text-d;
        ul{
          margin-top: 10px;
          margin-right: 40px;
          li{
              padding: 6px;
              background-color: @color-highlight-background;
              border-radius: 6px;
              margin-right: 14px;
              margin-bottom: 6px;
              float: left;
              font-size: @font-size-small;
              letter-spacing:1px;
          }
        }
      }
    }
</style>
