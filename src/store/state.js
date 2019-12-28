import {playMode} from '../common/js/config.js'
export const state = {
  //歌手及歌手热门歌曲
   singer:{},
   hotsongs:[],

   //专辑及专辑歌曲
   songRecommend:{},
   songs:[],

   //排行榜及歌曲
   topList:[],

   //播放器
   singers:{},
   playing:false,
   // 是否全屏
   fullScreen: false,
   playlist:[],
   sequenceList:[],
   
   // 播放模式
   mode:playMode.sequence,
   // 控制前后切歌
   currentIndex:-1

}
