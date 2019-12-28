<template>
     <music-list>
     </music-list>
</template>

<script>
  import musicList from '../../base/musicList/music-list.vue'
  import axios from 'axios'
  export default {
    name:'singerdetail',
    data(){
      return{
          songs:null
      }
    },
    created() {
      this.songsId = this.$route.params.id
      // console.log(this.$route.params.id)
       this._getsinger(this.songsId)

    },
    methods:{
      _getsinger(songsId) {
        if(!songsId){
          this.$router.push('/singer')
          return
        }
        axios({
          url:'http://www.arthurdon.top:3000/artists?id='+songsId,
          method:'GET'
        })
        .then((result)=>{
         this.$store.state.singer = result.data.artist
         this.$store.state.hotsongs = result.data.hotSongs
         this.songs = result.data
        })
        .catch((error) => {
          //console.log('歌手详情获取错误(可能网络出错)')
        })
      }
    },
    components:{
      musicList
    }
  }
</script>

<style lang="less" scoped>

</style>
