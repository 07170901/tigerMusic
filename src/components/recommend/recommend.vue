<template>
  <div class="recommend" v-if="reRender" ref='recommends' >
    <!-- 传入 歌曲列表数据-->
    <scroll class="recommend-content"  ref='scroll' :probeType='probeType' :data='discList'>
      <!-- 注意：要div包裹要滚动的数据 -->
      <div>
      <div v-if="recommend&&recommend.length" class="slide-wrapper">
        <slider>
          <div v-for="(item,index) in recommend" :key='index'>
            <a :href="item.url">
              <img class="needsclick" @load="loadImg" :src="item.imageUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list" ref='recommendList'>
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li v-for="(item,index) in discList" :key='index' class="item" @click='selectItem(item.id)'>
              <div class="icon">
                <!-- v-lazy 懒加载 -->
                <img width="60" height="60" v-lazy="item.picUrl" alt="">
              </div>
                <div class="text">
                  <h2 class="name no-wrap">{{item.copywriter}}</h2>
                  <p class="desc no-wrap">{{item.name}}</p>
                </div>
          </li>
        </ul>
      </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="fade">
     <router-view></router-view>
       </transition>
  </div>


</template>

<script>
  import Scroll from '../../base/scroll/scroll.vue'
  import Slider from '../../base/slider/slider.vue'
  import Loading from '../../base/loading/loading.vue'
  import {getRecommend} from '../../api/recommend.js'
  import {playlistMixin} from '../../common/js/mixin.js'
  import axios from 'axios'
  export default {
    mixins:[playlistMixin],
    data() {
      return {
        recommend: [],
        discList:[],
        reRender: false
      }
    },
    // 解决vue中使用swiper的loop循环失效和路由跳转回来后自动轮播失效需要手动滑动才能重新开始轮播
    activated() {
      this.reRender = false;
      setTimeout(()=>{
         this.reRender = true;
      },100)
    },
    created() {
       this.probeType = 3
       this._getRecommend()
      setTimeout(()=>{
         this._getDisList()
      },1000)
    },
    methods: {
     handlePlaylist(discList){
      setTimeout(()=>{
       const bottom = discList.length>0 ?'50px':''
       this.$refs.recommends.style.bottom = bottom
      // console.log(this.$refs.recommends)
       this.$refs.scroll.refresh()
        },1000)

     },
      selectItem(songId){
        this.$router.push({path:`/recommend/${songId}`})
      },
      _getRecommend() {
        axios({
          url: 'http://www.arthurdon.top:3000/banner',
          method: 'get',
        })
        .then(response => {
          this.recommend=response.data.banners

           //console.log(this.discList)  //可以获取
        })
        .catch((error) => {
          //console.log('歌单列表获取错误(可能网络出错)')
        })
        // getRecommend().then((res) => {
        //   this.recommend = res.bigPics
        //  // console.log(res.bigPics)
        // })
      },
      // 获取歌曲列表
     _getDisList(){
        axios({
          url: 'http://www.arthurdon.top:3000/personalized',
          method: 'get',
        })
        .then(response => {

          this.discList=response.data.result
           //console.log(this.discList)  //可以获取
        })
        .catch((error) => {
          //console.log('歌单列表获取错误(可能网络出错)')
        })
     },
     // 处理图片改变时，列表显示不完整
     loadImg(){
       // 一次性刷新
       if(!this.checkImg){
        // 调用重新新刷新
         this.$refs.scroll.refresh()
         this.checkImg = true
       }
     }
    },
    components: {
      Slider,
      Scroll,
      Loading

    }
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';
  @import '../../common/less/mixin.less';
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slide-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list {
        ul{
          padding: 0;
        }
        .list-title {
          height: 50px;
          line-height: 60px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-theme;
        }
        .item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 10px 20px;
           .icon{
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
         }
          .text{
            display: fixed;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;
          }
          .name{
            margin-bottom: 10px;
            color: @color-text;
          }
          .desc{
            color: @color-text-d;
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
 .fade-enter-active, .fade-leave-active {
   transition: opacity .5s;
 }
 .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
   opacity: 0;
 }
</style>
