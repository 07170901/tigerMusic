<template>
  <div class="slider" ref='slider'>
    <div class="slider-group" ref='sliderGroup'>
      <!-- 插槽 -->
      <slot></slot>
    </div>
    <!-- 小圆点 -->
    <div class="dots">
      <!-- 遍历小圆点 如果当前的currentPageIndex等于下标时触发 -->
      <span class="dot" v-for='(item,index) in dots' :class="{active:currentPageIndex===index}" :key='index'></span>
    </div>
  </div>
</template>

<script>
  // 导入插件better-scroll
  import BScroll from 'better-scroll'
  // 导入addClass的dom方法
  import {
    addClass
  } from '../../common/js/dom.js'
  export default {
    name: 'slider',
    props: {
      // 是否连续
      loop: {
        type: Boolean,
        default: true
      },
      // 是否自动播放
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 播放间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        //当前是第几个
        currentPageIndex: 0
      }
    },
    mounted() {
      // 浏览器刷新时间17毫秒
      setTimeout(() => {
        //计算宽度
        this._setSliderWidth()
        //初始化dot
        this._initDots()
        // 运用better-scroll插件，来设置轮播
        this._initSlider()
        // 设置自动播放
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      //添加监听事件（resize）==>改变大小
      window.addEventListener('resize', () => {
        //还没初始化的时候，啥都不做
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      // 计算Sliderde
      _setSliderWidth(isResize) {
        // 获取slider的个数(轮播图的个数)
        this.children = this.$refs.sliderGroup.children
        // console.log(this.children.length)
        // 定义总长度
        let width = 0
        // 获取单个slider的长度
        let sliderWidth = this.$refs.slider.clientWidth
        // 遍历所有slider，并且给每一个child添加类名
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          // 给子添加宽度
          child.style.width = sliderWidth + 'px'
          // 添加到总宽度中
          width += sliderWidth
        }
         //如果自动轮播的话就会添加额外两个图片的宽度（主要实现无缝轮播）
        if (this.loop & !isResize) {
          width += 2 * sliderWidth
        }
        // 给sliderGroup添加宽度
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 获取小圆点的个数
      _initDots() {
        //获取slider的个数，自动生出
        this.dots = new Array(this.children.length)
      },
      // 可以控制左右滑动
      _initSlider() {
          // 插件better-scroll中的属性与方法
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: true,
            threshold: 0.3,
            speed: 400,
          },
          // click: true
        })
        //每次切换下一张时会触发这个事件
        this.slider.on('scrollEnd', () => {
          //获取每一张图片的下标
          let pageIndex = this.slider.getCurrentPage().pageX
          // console.log(this.slider.getCurrentPage())
          // if(this.loop){
          //   pageIndex -= 1
          // }
          this.currentPageIndex = pageIndex
          // console.log(pageIndex)
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      //设置自动播放的方法
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        //如果等于最后图的下标，则跳到0
        if (pageIndex === this.children.length - 1) {
          pageIndex = 0
        }
        // console.log(this.children.length)
        this.timer = setTimeout(() => {
          //better-scroll方法 pageIndex横向   0 纵向
          // console.log(pageIndex)
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)

      }
    },
    //优化
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';

  .slider {
    min-height: 1px;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;

        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }

        img {
          display: block;
          width: 100%;
        }
      }
    }

    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;

      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: @color-text-l;

        &.active {
          width: 20px;
          border-radius: 5px;
          background-color: @color-text-ll;
        }
      }
    }
  }
</style>
