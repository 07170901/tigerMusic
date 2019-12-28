import * as types from './mutation-types.js'
export const mutations ={
      // set_singer(state,singer){
      //   state.singer = singer
      // },
      [types.SET_SINGERS](state,singers){
          state.singers = singers
      },
      [types.SET_PLAYING](state,flag){
          state.playing = flag
      },
      [types.SET_FULL_SCREEN](state,flag){
          state.fullScreen = flag
      },
      [types.SET_PLAY_LIST](state,list){
          state.playlist = list
      },
      [types.SET_SEQUENCE_LIST](state,list){
          state.sequenceList = list
      },
      [types.SET_PLAY_MODE](state,mode){
          state.mode = mode
      },
      [types.SET_CURRENT_INDEX](state,index){
          state.currentIndex = index
      }
}
