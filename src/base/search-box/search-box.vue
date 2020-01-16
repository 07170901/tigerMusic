<template>
  <div class="search-box">
     <div class="searchIcon fl ">
         <img class="auto" src="../../assets/search.png" alt="">
       </div>
      <input ref='query' class="box" v-model="query"  :placeholder="placeholder">
    <div  @click="clear" v-show="query" class="searchIcon fr ">
         <img class="auto" src="../../assets/close.png" alt="">
       </div>
  </div>
</template>

<script>
  import {debounce} from '../util/util.js'
  export default{
    props:{
      placeholder:{
        type:String,
        default:'搜索歌曲或歌手'
      }
    },
    data:()=>{
      return{
        query:''
      }
    },
    methods:{
      addsearch(query){
        this.query = query
      },
      clear(){
        this.query=''
      },
      blur(){
        this.$refs.query.blur()
      }
      
     },
      created(){
        // 节流处理
        this.$watch('query',debounce((newWord)=>{
           this.$emit('query',newWord)
        },500))
      }
  }
</script>

<style lang="less" scoped>
  @import  '../../common/less/variable.less';
  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: @color-highlight-background;
    border-radius: 6px;

    .searchIcon{
      width: 14px;
      padding: 8px 12px;
    }
    .box{
      flex:1;
      margin:0 5px;
      line-height: 18px;
      background: @color-highlight-background;
      color: @color-text;
      font-size: @font-size-medium;
      border: none;
      &::placeholder{
        color: @color-text-d;
      }

    }
  }
</style>
