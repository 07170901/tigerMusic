<template>
  <div class="progress-bar" ref="progressBar" @click.stop="progressClick" >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  // 定义常量为可点击的移动小点
  const progressBtnWidth = 16
  export default {
    name: 'bar',
    props: {
      // 移动百分比
      percent: {
        type: Number,
        default: 0
      }
    },
    // 创建点击时的对象
    created() {
      this.touch = {}
    },
    methods: {
      // 开始触碰点击
      progressTouchStart(e) {
        //判断是否点击按下
        this.touch.initiated = true
        //记录点击的位置(距离屏幕)
        this.touch.startX = e.touches[0].pageX
        //console.log(this.touch.startX)
        //距离父盒子的开始位置（）
        this.touch.left = this.$refs.progress.clientWidth

      },
      // 点击并移动
      progressTouchMove(e) {
        // 如果没有按下，则不触发
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      // 点击后松开
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e) {
        
        const rect = this.$refs.progressBar.getBoundingClientRect()
        // console.log(rect)
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        //this._offset(e.offsetX)
        this._triggerPercent()
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      // 获取位置来改变移动
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/variable.less';

  .progress-bar {
    height: 30px;

    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);

      .progress {
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
</style>
