<template>
  <div class="music-list">
    <!-- 头部 -->
    <div class="title clearfix">
     <div class="back fl" @click="back">
       <img class="auto" src="../../assets/back.png" alt="">
      </div>
        <div class="singerName " v-html="singer.name"></div>
    </div>

   <div class="songerImg">
      <img :src="singer.img1v1Url" alt="" class="auto">
       <div class="mask"></div>
    </div>
    <div class="musiclists">
      <ul>
        <li v-for="(item,index) in songs" :key='index' >
          <div>
             <div class="songName" v-if="item.name" v-html="item.name"></div>
           <div class="text"  v-if="item.al" >收藏于专辑:《{{item.al.name}}》</div>
          </div>

        </li>
      </ul>

    </div>
 <!-- 加载中动画 -->
  </div>
</template>

<script>
  export default {
    name:'musicList',
    props:{

    },
    data(){
      return{
        singer:{
          type:Object,
          default:{}
        },
        songs:{
          type:Array,
          default:[]
        }
      }
    },

    methods:{
      back(){
        this.$router.back()
      }
    },
    created(){
      setTimeout(()=>{
       this.songs = this.$store.state.hotsongs
       this.singer = this.$store.state.singer
        console.log(this.songs)
        console.log(this.singer)
      },2500)
    }
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';
  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;
     .title{
      width: 100%;
      position: absolute;
      padding-top: 10px;
      z-index: 100;
    .back{
      width: 24px;
      height: 24px;
      top: 10px;
      left: 10px;
      padding-left: 20px;
    }
     .singerName{
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%) ;
      color: #fff;
      font-size:@font-size-large-x;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
    .songerImg{
      height: 240px;
      overflow: hidden;
      position: relative;
    .mask{
     position: absolute;
     top: 0;
     left: 0;
     height: 100%;
     width: 100%;
     background: @color-background-d;
    }
  }
  .musiclists{
    ul{
    padding: 30px 30px 0;
    li{
      margin-bottom: 30px;
       .songName{
      font-size: @font-size-small;
      color: @color-text;
      margin-bottom: 8px;
    }
    .text{
       font-size: @font-size-small;
      color:@color-text-l;

    }
    }
   }
  }
  .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
 }

</style>
