<template>
  <div ref='wrapper'>
    <slot></slot>
  </div>
</template>

<script>
  // 导入better-scroll
  import BScroll from 'better-scroll'

  export default{
    name:'scroll',
    props:{
      probeType:{
        type:Number,
        default:1
      },
      click:{
        type:Boolean,
        default:true
      },
       data:{
         type:Array,
         default:null
       },
       listenScroll:{
         type:Boolean,
         default:false
       },
       beforeScroll:{
         type:Boolean,
         default:false
       }
    },
    mounted(){
      setTimeout(()=>{
         // 调用初始化
         this._initScroll()
      }, 20)

    },
    methods:{
      _initScroll(){
        // 如果没有值,undefault
        if(!this.$refs.wrapper){
          return
        }

        // 参数：{Object} {x, y} 滚动的实时坐标，触发时机：滚动过程中，具体时机取决于选项中的 probeType。
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType:this.probeType,
          click:this.click,
          mouseWheel: true,//开启鼠标滚轮
          disableMouse: false,//启用鼠标拖动
          disableTouch: false//启用手指触摸
        })

         // console.log(this.scroll)
         //监听是否滚动
         if(this.listenScroll){
           let self = this
           // 向父组件传入坐标pos
           this.scroll.on('scroll',(pos)=>{
              // 触发阀组件
              //console.log(pos)
               self.$emit('scroll',pos)
           })
         }
         if(this.beforeScroll){
           this.scroll.on('beforeScroll')
         }
      },
      // 启用 better-scroll (满足条件)
      enable(){
        this.scroll && this.scroll.enable()
      },
       // 禁用 better-scroll (满足条件)
      disable(){
        this.scroll && this.scroll.disable()
      },
      // 刷新scroll 重新计算高度
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      //滚动指定位置
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
      },
      //滚动指定位置后 触发事件
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
      },
    },
    watch:{
      data(){
        setTimeout(()=>{
          this.refresh()
          //console.log(this.data)
        },20)
      }
    }

  }
</script>

<style>
</style>
