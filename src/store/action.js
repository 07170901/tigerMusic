import * as types from './mutation-types.js'
import {playMode} from '../common/js/config.js'
import {shuffle} from '../base/util/util.js'

// 寻找ID是否一致,用来对应查找关系
function findIndex(list,song){
  return list.findIndex((item)=>{
    return item.id === song.id
  })
}
 export const selectPlay =function({commit,state},{list,index}){
  commit(types.SET_SEQUENCE_LIST,list)

  if(state.mode===playMode.random){
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST,randomList)
    index = findIndex(randomList,list[index])
  }else{
      commit(types.SET_PLAY_LIST,list)
  }

  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true)
}
