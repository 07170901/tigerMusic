<template>
  <div class="singer">

    <listview
    :data='singeritem'
    @select='selectSinger'
    ></listview>
    <router-view></router-view>
  </div>

</template>

<script>
  import axios from 'axios'
  import Listview from '../../base/listview/listview.vue'

  export default {
    name: 'singer',
    data() {
      return {
        singeritem:[],
        asingeritem:[],
        songs:[]
      }
    },
    created() {
          // 热门推荐
          this._getsingerhot()
          // 索引
          let chatString = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
          // 异步加载数据
          for (let i = 0; i<chatString.length; i++) {
              this._getsingerlists(chatString,i)
          }
            setTimeout(()=>{
               this.singeritem= this.asingeritem.sort(function(a,b){
                //console.log('a==>',a.title)
               // console.log('b==>',b.title)
               return a.id - b.id
             })
            }, 3000);
    },
    methods: {
      // 传递id
      selectSinger(singeritem){
        // console.log(this.$store.state.singerId)
         this.$router.push({
            path: `/singer/${singeritem.id}`
        })
        //this.getsinger(item.id)
        // setTimeout(()=>{
        //   this.$store.state.singer = this.songs
        //   console.log(this.songs)

        // },500)

      },
      // 获取数据
          _getsingerlists(chatString,index) {
           let listsdate = {}
            axios({
              url: 'http://www.arthurdon.top:3000/artist/list?cat=1001&limit=30&initial=' + chatString[index],
              method: 'get',
            })
            .then((response) => {
              listsdate.id = index
              listsdate.title = chatString[index].toLocaleUpperCase()
              listsdate.item = response.data.artists
              this.asingeritem.push(listsdate)
            })
            .catch((error) => {
              console.log('歌手列表获取错误(可能网络出错)')
            })

        },
        // 热门
        _getsingerhot(){
          let d = {}
          axios({
              url: 'http://www.arthurdon.top:3000/top/artists',
              method: 'get',
            })
            .then(response => {
              d.title = '热门'
              d.item = response.data.artists
              this.asingeritem.unshift(d)
            })
        }
      },
      watch:{
          '$route' () {
             // console.log(this.songs)
           },
      },
      components:{
        Listview
      }
    }
</script>

<style lang="less" scoped>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
