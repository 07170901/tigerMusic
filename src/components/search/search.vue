<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="inp clearfix">
    <!--  <div class="searchIcon fl ">
        <img class="auto" src="../../assets/search.png" alt="">
      </div> -->
    <!--  <input type="text" class="inptext fl" placeholder="搜索歌曲或歌手"> -->
    <search-box ref='searchbox' @query='OnQueryChange'></search-box>
    </div>
    <!-- 热门搜索 -->
    <div class="hotsearch">
      <div>热门搜索</div>
      <ul class="clearfix">
        <li @click="addWord(item.first)" v-for="(item,index) in hots" :key="index">
          {{item.first}}
        </li>
      </ul>
    </div>
    <div class="search-history" v-show="searchHistory.length">
      <h1 class="title">
        <span class="text">搜索历史</span>
        <span class="clear">
          <i class="icon-clear"></i>
        </span>
      </h1>

    </div>
    <div class="search-result" v-show="query">
      <suggest @select='saveSeach' @listScroll='blurInput' :query='query'></suggest>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import SearchBox from '../../base/search-box/search-box.vue'
  import Suggest from '../../components/suggest/suggest.vue'
  import {mapActions,mapGetters} from 'vuex'
  export default{
    name:'search',
    data(){
      return{
        hots:[],
        query:''
      }
    },
    created() {
      this._getHotText()
    },
    methods:{
      addWord(query){
        this.$refs.searchbox.addsearch(query)
      },
      OnQueryChange(query){
        this.query = query
      },
      blurInput(){
          this.$refs.searchbox.blur()
      },
      saveSeach(){
         this.saveSearchHistory()
      },
      _getHotText(){
        axios({
          method:'get',
          url:'http://www.arthurdon.top:3000/search/hot'
        }).then((result)=>{
          this.hots =result.data.result.hots
        })
      },
      ...mapActions([
        'saveSearchHistory'
      ])
    },
    computed:{
      ...mapGetters([
        'searchHistory'
      ])
    },
    components:{
       SearchBox,
       Suggest
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
        outline: none;
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
       .search-history{
          position: relative;
          margin: 0 20px;
           .title{
              display: flex;
              align-items: center;
              height: 40px;
              font-size: @font-size-medium;
              color: @color-text-l;
           }
           .text{
             flex: 1
           }
           .clear{
             .icon-clear{
                font-size: @font-size-medium;
                color: @color-text-d;
             }
          }
      }
      .search-result{
        position: fixed;
        width: 100%;
        top: 158px;
        bottom:0;
      }
    }
</style>
