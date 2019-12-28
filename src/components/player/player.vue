<template>
  <div class="player" v-show="playlist.length>0">
    <!-- 全屏 -->
    <transition name="normal"
    @enter="enter"
    @after-enter="afterEnter"
>
    <div class="normal-player" v-show="fullScreen">
      <!-- 背景图  start-->
      <div class="background" v-if="currentSong.al">
        <img :src="currentSong.al.picUrl" alt="" width="100%" height="100%" >
      </div>
      <!-- 背景图  end-->

      <!-- 头部 start -->
      <div class="top" v-if="currentSong.ar">
        <div class="back" @click="back">
          <img src="../../assets/back.png" class=" icon-back auto" alt="">
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.ar[0].name"></h2>
      </div>
      <!-- 头部 end -->

      <!-- 中间体 start -->
      <div class="middle"
      @touchstart='middleTouchStart'
      @touchmove='middleTouchMove'
      @touchend='middleTouchEnd'>
        <!-- cd -->
        <div class="middle-l" ref='middleL'>
          <div class="cd-wrapper" ref='cdWrapper'>
            <div class="cd" v-if="currentSong.al" :class="cdCls">
              <img :src="currentSong.al.picUrl" alt=""  class="image auto">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLysic}}</div>
          </div>
        </div>
        <!-- 右侧歌词 -->
        <scroll class="middle-r" ref='lyricList' :data='currentLyric && currentLyric.lines '>

            <div class="lyric-wrapper">
              <div v-if="currentLyric">

                <p ref='lyricLine'
                class="text"
                :class="{'current':currentNum===index}"
                v-for="(line,index) in currentLyric.lines"
                :key='index'>
                  {{line.txt}}
                </p>
              </div>
            </div>
        </scroll>
      </div>
      <!-- 中间体 end -->
      <!-- 下部 start -->
      <div class="bottom clearfix">
        <!-- 小圆点 -->
       <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow=='cd'}"></span>
          <span class="dot"  :class="{'active':currentShow=='lyric'}"></span>
        </div>
        <!-- 进度条 -->
         <div class="progress-wrapper">
          <span class="time time-l">{{formatCurrent(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent='percent' @percentChange='onProgressBarChange'></progress-bar>
          </div>
          <span class="time time-l">{{formatTotal(currentSong.dt)}}</span>
        </div>
           <div class="operators">
          <div class="icon i-left ">
            <img :src="iconMode" alt="" class="iconMode auto" @click="changeMode" >
          </div>
          <div class="icon i-left" :class="disableCls">
            <img @click="prev" src="../../common/image/pre.png" alt="" class="icon-prev auto">
          </div>
          <div class="icon i-center"  :class="disableCls">
            <img @click="togglePlaying" :src="playIcon" alt="" class="auto">
          </div>
          <div class="icon i-right"  :class="disableCls">
            <img @click="next" src="../../common/image/next.png" alt="" class=" auto">
          </div>
          <div class="icon i-right ">
            <img src="../../common/image/good.png" alt="" class="auto" >
          </div>
        </div>

      </div>
      <!-- 下部 end -->
    </div>
    </transition>
    <!-- 缩小屏 -->
    <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" v-if="currentSong.al">
          <img  :class="cdCls" width="40" height="40" :src="currentSong.al.picUrl">
        </div>
        <div class="text" v-if="currentSong.ar">
          <h2 class="name no-wrap" v-html="currentSong.name"></h2>
          <p class="desc no-wrap" v-html="currentSong.ar[0].name"></p>
        </div>

        <div class="control">
          <progress-cricle :radius="radius" :percent='percent'>
         <img @click.stop="togglePlaying" :src="playIcon" alt="" class="auto icon-mini">
         </progress-cricle>
        <!-- <progress-circle >

          </progress-circle> -->
        </div>
        <div class="control" >
          <i class="icon-playlist"></i>
        </div>
    </div>
    </transition>
    <audio ref='audio'
    preload="auto"
    @canplay="ready"
    @error="error"
    @timeupdate="updataTime"
    @ended="end"
    ></audio>

  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import animations from "create-keyframe-animation"
    // 滚动
  import Scroll from '../../base/scroll/scroll.vue'
  // 导入进度条
  import ProgressBar from '../../base/progress-bar/progress-bar.vue'
  // 导入进度条小圆圈
  import ProgressCricle from  '../../base/progress-circle/progress-circle.vue'
  import axios from 'axios'
  // 导入模式
  import {playMode} from '../../common/js/config.js'
  // 导入洗牌函数
  import {shuffle} from '../../base/util/util.js'
  // 整理歌词的组件
  import Lyric from 'lyric-parser'

  export default {
    name: 'player',
    data(){
      return{
        songReady:false,
        currentTime:0,
        radius:30,
        currentLyric:null,
        currentNum:0,
        currentShow:'cd',
        playingLysic:''
      }
    },
    created(){
      this.touch = {}
     
    },
    computed: {
      cdCls(){
        return this.playing? 'play' : 'play pause'
      },
      playIcon(){
        return this.playing? require('../../common/image/pause.png'):require('../../common/image/play.png')
      },
      disableCls(){
        return this.songReady?'':'disable'
      },
     percent(){
       return this.currentTime/(this.currentSong.dt/1000)
     },
     // 改变播放模式的图片
     iconMode(){
       return this.mode === playMode.sequence? require('../../common/image/loop.png'):this.mode === playMode.loop ? require('../../common/image/once.png'):require('../../common/image/sep.png')
     },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      back() {
       this.setFullScreen(false)
      },
      open(){
       this.setFullScreen(true)
      },
      enter(el,done){
        const {x,y,scale} = this._getPosAndScale()
        let animation = {
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
             transform:`translate3d(0,0,0) scale(1.1)`
          },
          100:{
            transform:`translate3d(0,0,0) scale(1)`
          }

        }
        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration:400,
            easing:'linear'
          }
        })
         animations.runAnimation(this.$refs.cdWrapper,'move')
      },
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      // leave(el,done){
      //     this.$refs.cdWrapper.style.transition = 'all 0.4s'
      //     const {x,y,scale} = this._getPosAndScale()
      //     this.$refs.cdWrapper.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`
      // },
      // afterLeave(){
      //   this.$refs.cdWrapper.style.transition=' '

      // },
      togglePlaying(){
        if(!this.songReady){
          return
        }
        this.setPlayingState(!this.playing)
         if(this.currentLyric){
           this.currentLyric.togglePlay()
         }
      },
      next(){
        if(!this.songReady){
          return
        }
        let index = this.currentIndex + 1
        if(index === this.playlist.length){
          index = 0
        }
        if(this.playlist.length === 1){
          this.loop()
        }else{
           this.setCurrentIndex(index)
           if(!this.playing){
           this.togglePlaying()
           }
        }

        this.songReady = false
      },
      prev(){
        if(!this.songReady){
          return
        }
        // 当前列表长度只为1
        if(this.playlist.length === 1){
          this.loop()
        }else{
           let index = this.currentIndex - 1
          if(index === -1){
            index = this.playlist.length-1
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }
           this.songReady = false
      },
      ready(){
        this.songReady = true
      },
      error(){
        this.songReady = true
      },
      updataTime(e){
          this.currentTime = e.target.currentTime
      },
      formatTotal(interval){
        interval = interval/1000 | 0
        const minute = interval/60 | 0
        const second =this._pad(interval % 60)
        return `${minute}:${second}`
      },
      formatCurrent(interval){
        interval = interval | 0
        const minute = interval/60 | 0
        const second =this._pad(interval % 60)
        return `${minute}:${second}`
      },
      onProgressBarChange(percent){
        const currentTime = this.currentSong.dt*percent
        this.$refs.audio.currentTime = this.currentSong.dt/1000 * percent
        if(!this.playing){
          this.togglePlaying()
        }
        // 重新跳回开始位置
        if(this.currentLyric){
          this.currentLyric.seek(currentTime)
        }
      },
      changeMode(){
        const mode = (this.mode+1)%3
        this.setPlayMode(mode)
        let list = null
        if(mode === playMode.random){
            list = shuffle(this.sequenceList)
        }else{
            list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      resetCurrentIndex(list){
          let index = list.findIndex((item)=>{
            return item.id === this.currentSong.id
          })
          this.setCurrentIndex(index)
      },
      end(){
        if(this.mode === playMode.loop){
         this.loop()
        }else{
          this.next()
        }
      },
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 重新跳回开始位置
        if(this.currentLyric){
          this.currentLyric.seek(0)
        }
      },
      // 点击中间体开始点击事件
      middleTouchStart(e){
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      // 点击中间体滑动事件
      middleTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if(Math.abs(deltaY)>Math.abs(deltaX)){
          return
        }
        const left = this.currentShow === 'cd'? 0 :-window.innerWidth
        const offsetWidth =Math.min(0,Math.max(-window.innerWidth,left+deltaX))
        // 滑动的距离占屏幕宽度的比
        this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style.transitionDuration = 0
        this.$refs.middleL.style.opacity =1- this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0

      },
      // 点击后松开事件
      middleTouchEnd(){
          let offsetWidth
          let opacity
          // 左右滑动
          if(this.currentShow ==='cd'){
            if(this.touch.percent>0.1){
              offsetWidth = -window.innerWidth
              this.currentShow = 'lyric'
              opacity = 0
            }else{
              opacity = 1
              offsetWidth = 0
            }
          }else{
            if(this.touch.percent<0.9){
              offsetWidth = 0
              this.currentShow = 'cd'
              opacity = 1
            }else{
              offsetWidth=-window.innerWidth
              opacity = 0
            }
          }
          this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
          // 动画效果
          this.$refs.lyricList.$el.style.transitionDuration = '300ms'
          this.$refs.middleL.style.opacity = opacity
          this.$refs.middleL.style.transitionDuration = 0
      },
      // 不足10补0
      _pad(num,n=2){
        let len = num.toString().length
        while(len<n){
          num = '0'+ num
          len++
        }
        return num
      },
      _getPosAndScale(){
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerHeight*0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth/2-paddingLeft)
        const y = window.innerHeight - paddingTop-width/2 -paddingBottom
        return{
          x,
          y,
          scale
        }
      },
      // 音频链接
      _gethozi(){
       // console.log(this.currentSong.id)
        axios({
          url:'http://www.arthurdon.top:3000/song/url?id='+this.currentSong.id,
          method:'GET'
        })
        .then((result)=>{
         this.currentSong.url= result.data.data[0].url
         //console.log( result.data.data[0].url)
        })
        .catch((error) => {
         // console.log('歌手详情获取错误(可能网络出错)')
        })
      },
      // 获取歌词
      _getlyric(){
        axios({
          url:'http://www.arthurdon.top:3000/lyric?id='+this.currentSong.id,
          method:'GET'
        })
        .then((result)=>{
          this.currentLyric = new Lyric(result.data.lrc.lyric,this.hangleLyric)
          if(this.playing){
            this.currentLyric.play()
          }
         // this.currentSong.lyric = result.data.lrc.lyric
          //console.log(this.currentLyric)
         //console.log( result.data.data[0].url)
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLysic = ''
          this.currentNum = 0
         // console.log('歌手详情获取错误(可能网络出错)')
        })
      },
      // 回调函数
      hangleLyric({lineNum,txt}){
        this.currentNum = lineNum
        if(lineNum>5){
          let lineEl = this.$refs.lyricLine[lineNum-5]
          this.$refs.lyricList.scrollToElement(lineEl,1000)
        }else{
            this.$refs.lyricList.scrollTo(0,0,1000)
        }
        this.playingLysic = txt
      },
      ...mapMutations({
        setFullScreen:"SET_FULL_SCREEN",
        setPlayingState:'SET_PLAYING',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode:'SET_PLAY_MODE',
        setPlaylist:'SET_PLAY_LIST'
      })
    },
    watch:{
      currentSong(newSong,oldSong){
        if(newSong.id === oldSong.id){
          return
        }
        // 清除计时器，切歌时不再乱动
        if(this.currentLyric){
           this.currentLyric.stop()
        }
        this._gethozi()
        setTimeout(()=>{
          this.$refs.audio.src=this.currentSong.url
          this.$nextTick(()=>{
            this.$refs.audio.play()
            this._getlyric()
        })
        },500)

      },
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
           newPlaying?audio.play():audio.pause()
        })


      }

    },
    components:{
     ProgressBar,
     ProgressCricle,
     Scroll

    }
  }
</script>

<style scoped lang="less">
  @import '../../common/less/variable.less';
  @import '../../common/less/mixin.less';

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;

      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }

      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          width: 22px;
          left: 6px;
          z-index: 50;

          // background-color: #008800;
          .icon-back {
            padding: 9px;
            transform: rotate(-90deg);
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }

        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }

      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;

              &.play {
                animation: rotate 20s linear infinite;
              }

              &.pause {
                animation-play-state: paused
              }

              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;

            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            widows: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 32px;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current{
                color: @color-text;
              }
            }
          }
        }

      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        // background-color: red;

        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;

            &.active {
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
    }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;

          .time {
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;

            &.time-l {
              text-align: left;
              margin-left: 6px;
            }

            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1
          }
        }
        .operators {
          display: flex;
          align-items: center;
          // justify-content:center;
          .icon {
            flex: 1;
            color: @color-theme;
             img{
               padding-left: 13px;
               width: 30px;
             }
            &.disable {
              color: @color-theme-d;
            }
          }
          .i-left {
           float: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            width: 40px;
          }

          .i-right {
            text-align: left;
          }

          .icon-favorite {
            color: @color-sub-theme;
          }

        }
    }
    &.normal-enter-active,&.normal-leave-active{
      transition: all 0.4s;
      .top,.bottom{
        transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
      }
    }
    &.normal-enter,&.normal-leave-to{
      opacity: 0;
      .top{
        transform: translate3D(0,-100px,0);
      }
      .bottom{
         transform: translate3D(0,100px,0);
      }
    }
  }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      width: 100%;
      height: 60px;
      background: @color-highlight-background;
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0;
      }
      .icon{
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
         img{
           border-radius: 50% ;
            &.play{
              animation: rotate 10s linear infinite;
            }
           &.pause{
            animation-play-state: paused;
            }
         }

      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          font-size: @font-size-medium;
          color: @color-text;
          }
        .desc{

          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: @color-theme;
        }
        .icon-mini{
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }

      }

    }
 @keyframes rotate{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
  }

</style>
