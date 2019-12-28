<template>
  <div class="music-list">
    <!-- 头部 -->
    <div class="title clearfix" ref='title'>
     <div class="back fl" @click="back">
       <img class="auto" src="../../assets/back.png" alt="">
      </div>
        <div class="singerName one-wrap" v-html="singerName"></div>
    </div>

   <div class="songerImg" ref='bg'>
      <img :src="singer.img1v1Url" alt="" class="auto">
       <div class="mask" ref='mask'></div>
    </div>
    <div class="bg-layer" ref='layer'></div>
    <scroll :data="songs" @scroll='scroll' :listenScroll="listenScroll" class="listview" :probeType="probeType" ref='list'>
    <div class="musiclists">
      <ul>
        <li v-for="(item,index) in songs" :key='index' @click="selectItem(item,index)" :data-id='item.id' >
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
  import {mapActions,mapGetters,} from 'vuex'
  import axios from 'axios'
  import {playlistMixin} from '../../common/js/mixin.js'
  export default {
    mixins:[playlistMixin],
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
        singerName:null,
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
    computed:{
      ...mapGetters([
        'playlist',
      ])
    },
    methods:{
      handlePlaylist(playlist){
        const bottom = playlist.length>0 ?'70px':''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      back(){
        this.$router.back()
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      selectItem(item,index){
        //console.log(this.playlist)
       // console.log(item)
        axios({
          url:'http://www.arthurdon.top:3000/song/url?id='+item.id,
          method:'GET'
        })
        .then((result)=>{
          item.url = result.data.data[0].url

         // console.log(result.data.data[0].url)
         // console.log(item)
        })
        .catch((error) => {
          //console.log('歌手详情获取错误(可能网络出错)')
        })
        // console.log(item,index)
        // this.$emit('select',item,index)

        this.selectPlay({
          list:this.$store.state.hotsongs,
          index:index
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    created(){
       this.probeType = 3
       this.listenScroll = true
      setTimeout(()=>{
       this.songs = this.$store.state.hotsongs
       this.singer = this.$store.state.singer
       this.singerName =this.singer.name.length>9?this.singer.name.substr(0,9)+'...':this.singer.name
        //console.log(this.songs)
        //console.log(this.singer)
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
  @import '../../common/less/musiclist.less';
</style>
