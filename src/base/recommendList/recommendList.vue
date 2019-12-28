<template>
  <div class="music-list" v-if="songRecommend&&songs">
  <!-- 头部 -->
   <div class="title clearfix"  ref='title'>
    <div class="back fl" @click="back">
      <img class="auto" src="../../assets/back.png" alt="">
     </div>
       <div class="singerName one-wrap" v-html="songRecommend.name"></div>
   </div>

  <div class="songerImg" ref='bg'>
     <img :src="songRecommend.bgurl" alt="" class="auto">
      <div class="mask" ref='mask'></div>
   </div>
   <div class="bg-layer" ref='layer'></div>
  <scroll :data="songs" @scroll='scroll' :listenScroll="listenScroll" class="listview" :probeType="probeType" ref='list'>
   <div class="musiclists" v-if="songs">
     <ul>
       <li v-for="(item,index) in songs" :key='index' :data-id='item.id' @click="selectItem(item,index)">
         <div>
            <div class="songName one-wrap">{{item.name}}</div>
            <div class="text one-wrap">{{item.ar[0].name}}</div>
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
  import axios from 'axios'
  import {mapActions} from 'vuex'
  export default{
    name:'recommendList',
    data(){
      return{
        songRecommend:{},
        songs:[],
        scrollY:0,
        isFlag:false
      }
    },

    components:{
     loading,
      scroll
    },
    created() {
      this.listenScroll = true
      this.probeType = 3
      this.recommendId = this.$route.params.id
      this.isFlag = true
      //console.log(this.recommendId)
      this._getsinger(this.recommendId)
      setTimeout(()=>{
         this.songRecommend = this.$store.state.songRecommend
         this.songs =  this.$store.state.songs
         this.isFlag = false

      },1000)

    },
      mounted(){
          // console.log(this.maskHeight)
          this.titleHeight = this.$refs.title.offsetHeight
          this.bgHeight =  this.$refs.bg.offsetHeight
          this.minMaskHeight = -this.bgHeight +this.titleHeight
          this.$refs.list.$el.style.top = `${this.bgHeight}px`
      },
    methods:{
    selectItem(item,index){
      this.selectPlay({
        list:this.songs,
        index:index
      })
     // console.log(item)
     //音乐

    },
     scroll(pos){
       this.scrollY = pos.y
     },

      back(){
          this.$store.state.songRecommend={}
          this.$store.state.songs=[]
          this.$router.back()
      },
      _getmusic(id){
        axios({
          url:'http://www.arthurdon.top:3000/song/url?id='+id,
          method:'GET'
        })
        .then((result)=>{
          this.$store.state.songs.Aurl=result.data[0].url
        })
        .catch((error) => {
        })

      },
      _getsinger(recommendId) {
        if(!recommendId){
          this.$router.push('/recommend')
          return
        }
        axios({
          // /song/url?id=33894312
          url:'http://www.arthurdon.top:3000/playlist/detail?id='+recommendId,
          method:'GET'
        })
        .then((result)=>{
          this.$store.state.songRecommend.bgurl = result.data.playlist.coverImgUrl
          this.$store.state.songRecommend.name = result.data.playlist.name.substring(0,9)+'...'
          this.$store.state.songs = result.data.playlist.tracks
          //console.log(result.data.playlist.tracks)
        })
        .catch((error) => {
         // console.log('歌手详情获取错误(可能网络出错)')
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY(newVal){
          //console.log(newVal)
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
          //console.log( this.$refs.layer.style.transform )
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
        // console.log(this.$refs.bg.style.zIndex)
          //console.log(this.$refs.layer.style['transform'])
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';
  @import '../../common/less/musiclist.less';
</style>
