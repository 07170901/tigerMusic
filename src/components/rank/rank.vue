<template>
  <div class="rank" >
      <ul v-if="topList.artist&&topList.singer&&topList">
        <li class="list clearfix" v-for="(item,index) in topList.artist" :key='index' @click="clickTopList(item.id)">
          <div>
            <div class="listImg fl">
              <img class="auto" :src="item.coverImgUrl" alt="">
            </div>
            <div class="listSongs fl">
              <p class="one-wrap" v-for="(item1,index1) in item.tracks" :key='index1'>{{index1+1}} &nbsp; {{item1.first}}--{{item1.second}}</p>
            </div>
          </div>
        </li>
       <li class="list clearfix">
          <div>
            <div class="listImg fl">
              <img class="auto" :src="topList.singer.coverUrl" alt="">
            </div>
            <div class="listSongs fl">
              <p class="one-wrap" v-for="(item,index) in topList.singer.artists" :key='index'>{{index+1}} &nbsp; {{item.first}}</p>
            </div>
          </div>
        </li>
      </ul>

        <transition name="fade" mode="in-out">
         <router-view></router-view>
           </transition>
              <!-- 加载中动画 -->
      <div class="loading-container" v-show="isFlag">
          <loading></loading>
        </div>

  </div>
</template>

<script>
  import axios from 'axios'
    import loading from '../../base/loading/loading.vue'
  export default{
    name:'rank',
    data(){
      return{
         topList:{},
         isFlag:false
      }
    },
    components:{
       loading
    },
    created() {
      this.isFlag = true
      this._getToplist()
      setTimeout(()=>{
          this.topList =  this.$store.state.topList
          this.isFlag=false
      },1000)
    },
    methods:{
      _getToplist(){
        let topList = {}
        axios({
          url:'http://www.arthurdon.top:3000/toplist/detail',
          method:'get'
        }).then((result)=>{
            topList.artist=result.data.list.slice(0,4)
            topList.singer=result.data.artistToplist
            this.$store.state.topList = topList
            // console.log(result)
        })
        .catch((error)=>{
           //console.log('排行榜数据获取失败')
        })
      },
      _getTop(){
        //榜单详情
        // http://www.arthurdon.top:3000/playlist/detail?id=19723756
      },
      clickTopList(topListId){
        this.$router.push({path:`/rank/${topListId}`})
        //console.log(topListId)
      }


    }
  }
</script>

<style lang="less" scoped>
      @import '../../common/less/variable.less';
      .rank{
        .list{
          margin: 10px 20px;
          background-color: @color-highlight-background;
            .listImg{
              width: 80px;
            }
            .listSongs{
              width: calc(100% - 80px - 30px);
              font-size: @font-size-small;
               // background-color: #000088;
               margin:10px 0 0 20px;
              p{
                color: @color-text-d;
                padding: 2px 0;
                margin: 0px 0 4px;
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
        transition: opacity .2s;
      }
      .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
      }
      // .slide-fade-enter-active {
      //   transition: all .3s ease;
      // }
      // .slide-fade-leave-active {
      //   transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
      // }
      // .slide-fade-enter, .slide-fade-leave-to
      // /* .slide-fade-leave-active for below version 2.1.8 */ {
      //   transform: translateX(10px);
      //   opacity: 0;
      // }
</style>
