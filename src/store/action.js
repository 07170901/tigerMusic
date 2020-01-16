import * as types from './mutation-types.js'
import {playMode} from '../common/js/config.js'
import {shuffle} from '../base/util/util.js'
import {saveSeach} from '../common/js/cache.js'

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


export const insertSong = function({commit,state},song){
	let playlist = state.playlist.concat()
	let sequenceList = state.sequenceList.concat()
	let currentIndex = state.currentIndex
  // 记录当前歌曲(正常顺序)
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待查询歌曲,并返回其索引
  let findSong = findIndex(playlist,song)
  // 因为是插入歌曲,所以索引+1
  currentIndex++
  playlist.splice(currentIndex,0,song)
  if(findSong>-1){
    if(currentIndex>findIndex){
      playlist.splice(findIndex,1)
      currentIndex--
    }else{
      playlist.splice(findIndex+1,1)
    }
  }
  // 记录当前位置(随机顺序)
  let currentSIndex = findIndex(sequenceList,currentSong)+1

  let fsIndex = findIndex(sequenceList,song)

  sequenceList.splice(currentIndex,0,song)

  if(fsIndex>-1){
    if(currentIndex>fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      sequenceList.splice(fsIndex+1,1)
  }

}
  commit(types.SET_PLAY_LIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true)
}

export const saveSearchHistory = function({commit},query){
    commit (types.SET_SEARCH_HISTORY,saveSearch(query))
}
