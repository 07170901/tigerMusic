<template>
  <!-- 滚动绑定 将列表数据出给data -->
 <scroll
  class="listview"
  :data="data"
  ref='listview'
  :listen-scroll="listenScroll"
  @scroll='scroll'
  :probeType="probeType"
 >
   <ul>
     <li v-for='(group,index) in data' ref='listGroup' class="list-group" :key='index'>
       <h2 class="list-group-title">{{group.title}}</h2>
       <ul>
         <li v-for="(item,index1) in group.item" :key='index1'   class="list-group-item" @click="selectItem(item)">
           <img class="picUrl" v-lazy="item.picUrl" alt="">
           <span class="name" >{{item.name}}</span>
         </li>
       </ul>
     </li>
   </ul>
   <div class="list-shortcut" @touchstart='onShortcutTouchStart' @touchmove.stop.prevent='onShortcutTouchMove' @touchmove.stop>
     <ul>
       <li v-for="(item,index) in shortcutList"
        class="item"
        :key='index'
        :data-index='index'
        :class="{'active':currentIndex===index}"
        >{{item}}</li>
       </ul>
   </div>
   <!-- 加载中动画 -->
   <div class="loading-container" v-show="!data.length">
     <loading></loading>
   </div>
   <div class="list-fixed" ref='fixedList'>
     <h1 class="fixed-title">{{fixedTitle}}</h1>
   </div>
 </scroll>
</template>

<script>
   // 导入加载时
   import Loading from '../../base/loading/loading.vue'
   // 导入滚动条
   import Scroll from '../scroll/scroll.vue'
   // 导入获取data-*的数据
   import {getData} from '../../common/js/dom.js'
   import axios from 'axios'

   // 侧边栏的item的高度
   const HIGHT = 15
   // 上方字体的固定位置
   const FIXEDTETLE = 30
  export default {
    name:'listview',
    props:{
      // 获取传入的数据
      data:{
        type:Array,
        // 不能直接使用default:[]
        default:()=>[]
      }
    },
    computed:{
      // 获取title的首个字符作为侧边导航
      shortcutList(){
        // map 返回一个经过处理后的新数组，但不改变原数组的值
        return this.data.map((group)=>{
          // 截取首字母（大写）
          return group.title.substr(0,1).toLocaleUpperCase()
          // console.log(group.title.substr(0,1))
        })
      },
      fixedTitle(){
        //如果 this.data[this.currentIndex] 不存在，则为空
        return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
      }
    },

    data(){
      return{
        // 观测实时改变的位置
        scrollY:-1,
        currentIndex:0,
        // 滚动差
        diff:-1
      }

    },
    created() {
      // 不放在data中，只为了函数之间访问
      this.touch = {}
      this.listenScroll = true
      // 存储每一个listGroup的高度
      this.listHeight =[]
      // 改变滑动
      this.probeType = 3
    },

    methods:{
      // 点击跳转锚点
      onShortcutTouchStart(e){
        // e.target 点击当前的节点 获取 data-index的值
        let index =getData(e.target,'index')
        // console.log(index)
         if(this.touch.index === index){
           return
         }
        // 获取点击的位置(为了获取初始值的高度位置，存储在外部中的touch)
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.index = index

        this. _scrollTo(index)
       },
       // 索引栏滑动动态改变
       onShortcutTouchMove(e){
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // |0取整数
        let detal = (this.touch.y2 - this.touch.y1)/HIGHT|0
        // console.log('this.touch.y2 - this.touch.y1==>',this.touch.y2 - this.touch.y1)
        let index = parseInt(this.touch.index)+detal
        // console.log(detal)
        this._scrollTo(index)
       },
       //获取传过来的pos.y
       scroll(pos){
         this.scrollY = pos.y
       },
       // 点击进入歌手详情
       selectItem(item){
         //console.log(item)
         //向父组件发送一个自定义事件
          this.$emit('select',item)
       },
       _scrollTo(index){
         // index 为 null
         if(!index&&index !== 0){
           return
         }
         // 范围超出优化
         if(index < 0){
            index = 0
         }else if(index>this.listHeight.length-2){
            // 最后一个索引的上限
            index = this.listHeight.length-2
         }
         // 移动到指定位置
           this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
       },
       // 计算每个索引的高度位置
       _calculateHeight(){
           // 存储 listHeight 的值
           this.listHeight =[]
           // 获取的是lsit数据
           const list = this.$refs.listGroup
           // console.log(list)
           let height = 0
           // 将初始位置添加到listHeight数组中
           this.listHeight.push(height)
           // 遍历数组
           for(let i =0;i<list.length;i++){
            //  因为list[i]是dom的结构,所以可以使用clientHeight的方法
            // clientHeight 等于 自身内容的height+padding
             height += list[i].clientHeight
            // 添加到listHeight数组中
             this.listHeight.push(height)
           }
           //console.log( this.listHeight)
       }
    },
    // 监听dom发生改变时，调用重新计算
    watch:{
      //传入的数据计算
      data(){
        setTimeout(()=>{
            this._calculateHeight()
        },20)
      },
      // 观测scrolly的变化
      scrollY(newY){
          const listHeight = this.listHeight
          // 当滚动到顶部，newY>0
          if (newY > 0) {
            this.currentIndex = 0
            return
          }
           // 在中间的部分滚动
          for(let i = 0;i<listHeight.length-1;i++){
            // 上限
            let height1 =listHeight[i]
            //下限
            let height2 = listHeight[i+1]

            if(-newY>=height1&&-newY<height2){
              this.currentIndex = i
              // 距离 = 目标 - 滚动值(如果距离<30,就会触发)
              this.diff = height2+newY
              //console.log(this.currentIndex)
              return
            }
          }
          // 当滚动到底部，且-newY大于最后一个元素上限
          this.currentIndex = listHeight.length - 2
      },
      diff(newVal){
        // 监听改变的新值
        // console.log(newVal)
        // 判断位置范围的 取出fixedList的值
        let fixedList = (newVal>0&&newVal<FIXEDTETLE)?newVal-FIXEDTETLE:0
        // console.log(this.fixedList)
        // 拦截
        if(this.fixedList === fixedList){
          return
        }
        this.fixedList = fixedList
        // 移动到this.fixedList的位置
        this.$refs.fixedList.style.transform = `translate(0,${this.fixedList}px)`

      }
    },
    components:{
      Scroll,
      Loading
    }

  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';
  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .list-group{
      padding-bottom: 30px;
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .picUrl{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 30px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right:0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius:10px ;
      text-align: center;
      background: @color-background-d;
      .item{
        padding: 3px;
        line-height: 10px;
        color: @color-text-l;
        font-size: @font-size-small;
        &.active{
          color:#ffcd32;;
        }
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        margin-top: -1px;
        line-height: 30px;
        padding-left: 30px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }

    }
  }
</style>
