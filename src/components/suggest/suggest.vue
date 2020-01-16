<template>
  <scroll class="suggest"
  :data="resultSong"
  :beforeScroll='beforeScroll'
  @beforeScroll='listScroll'>
      <ul class="suggest-list">

        <li class="suggest-item" @click="selectItem(item)"  v-for='(item,index) in resultSong' :key='index'>
          <div class="name one-wrap">
            <span class="text ">{{item.name}}--{{item.artists[0].name}}</span>
          </div>
        </li>
      </ul>
      <div v-show="resultSong==undefined" class="no-result-wrapper">
          <no-result title="抱歉,暂无搜索结果"></no-result>
      </div>
  </scroll>
</template>

<script>
    import axios from 'axios'
    import Scroll from '../../base/scroll/scroll.vue'
    import {mapActions} from 'vuex'
    import NoResult from '../../base/no-result/no-result.vue'
  export default{
      props:{
        query:{
          type:String,
          default:''
        }
      },
      data(){
        return{
          resultSong:[],
          beforeScroll:true
        }
      },
      methods:{
        _getSearchSong(query){
          axios({
            method:'get',
            url:'http://www.arthurdon.top:3000/search?keywords='+query
          }).then((result)=>{
                 this.resultSong= result.data.result.songs
                // console.log(this.resultSong)
          })
        },
        listScroll(){
          this.$emit('listScroll')
        },
        selectItem(item){
          // this.$router.push({path:`/recommend/${item.id}`})
           this.insertSong(item)
          //  this.$emit('select')
        },
        ...mapActions([
          'insertSong'
        ])

      },
      watch:{
        query(newWord){
          this.resultSong=[]
          if(newWord!=''){
            this._getSearchSong(newWord)
          }

        }
      },
      components:{
        Scroll,
        NoResult
      }
  }
</script>

<style lang="less" scoped>
  @import  '../../common/less/variable';
  .suggest{
    height: 100%;
    background:@color-background;
    overflow: hidden;
    .suggest-list{
      padding: 0 30px;
      .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .name{
        flex: 1;
        font-size: @font-size-medium;
        color:@color-text-d;
      }
      .no-result-wrapper{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
