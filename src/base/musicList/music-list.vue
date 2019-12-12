<template>
  <div class="music-list">
    <!-- 头部 -->
    <div class="title clearfix" ref='title'>
     <div class="back fl" @click="back">
       <img class="auto" src="../../assets/back.png" alt="">
      </div>
        <div class="singerName one-wrap" v-html="singer.name"></div>
    </div>

   <div class="songerImg" ref='bg'>
      <img :src="singer.img1v1Url" alt="" class="auto">
       <div class="mask" ref='mask'></div>
    </div>
    <div class="bg-layer" ref='layer'></div>
    <scroll :data="songs" @scroll='scroll' :listenScroll="listenScroll" class="listview" :probeType="probeType" ref='list'>
    <div class="musiclists">
      <ul>
        <li v-for="(item,index) in songs" :key='index' >
          <div>
             <div class="songName one-wrap" v-if="item.name" v-html="item.name"></div>
           <div class="text one-wrap"  v-if="item.al" >收藏于专辑:《{{item.al.name}}》</div>
          </div>
        </li>
      </ul>
    </div>
    </scroll>
   <!-- 加载中动画 -->
   <div class="loading-container" v-show="isFlag">
     <loading></loading>
   </div>
  </div>
</template>

<script>
  import scroll from '../scroll/scroll.vue'
  import loading from '../loading/loading.vue'
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
        songs:null,
        isFlag:{
          type:Boolean,
          default:false
        },
        scrollY:0
      }
    },
    mounted(){
    this.maskHeight = this.$refs.mask.clientHeight
    this.titleHeight =  this.$refs.title.offsetHeight
    this.bgHeight =  this.$refs.bg.offsetHeight
    this.minMaskHeight = -this.maskHeight+this.titleHeight
    this.$refs.list.$el.style.top = `${this.maskHeight}px`
    },
    methods:{
      back(){
        this.$router.back()
      },
      scroll(pos){
        this.scrollY = pos.y
      }

    },
    created(){
       this.probeType = 3
       this.listenScroll = true
       this.isFlag = true
      setTimeout(()=>{
       this.songs = this.$store.state.hotsongs
       this.singer = this.$store.state.singer
        console.log(this.songs)
        console.log(this.singer)
         this.isFlag = false
      },2500)
    },
    components:{
      loading,
      scroll
    },
    watch:{
      scrollY(newVal){
        let zIndex = 0
        let scale = 1
        let aph = 1
        const percent = Math.abs(newVal/this.bgHeight)
        this.translateY = Math.max(this.minMaskHeight,newVal)
        if(newVal>0){
          scale = 1+ percent
          zIndex = 10
          aph = 1-(newVal/this.bgHeight)
        }else{
             scale = 1
             aph = 1
        }

        this.$refs.layer.style.transform = `translate3d(0,${this.translateY}px,0)`
        if(newVal<this.minMaskHeight){
          // 改变图片层级
          zIndex = 10
          // 改变图片的高度
          this.$refs.bg.style.height=`${this.titleHeight}px`
         // console.log(this.$refs.bg.style)
        }else{
          // 还原高度
          this.$refs.bg.style.height=`${this.bgHeight}px`
        }
        this.$refs.bg.style.opacity = aph
        // console.log(this.$refs.layer.style.opacity)
        this.$refs.bg.style.transform = `scale(${scale})`
        this.$refs.bg.style.zIndex =  zIndex
      //  console.log(this.$refs.bg.style.zIndex)
        // console.log(this.$refs.layer.style['transform'])
      }
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
      z-index: 101;
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
    padding: 20px 30px 0;
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
  .listview{
    width: 100%;
    position: fixed;
    top: 0;
    bottom: 20px;
}
  .bg-layer{
      position: relative;
      height: 100%;
      background: @color-background;
    }
  }

</style>
