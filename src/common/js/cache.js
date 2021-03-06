// 保存搜索结果
import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertArray(arr,val,compare,maxLen){
  const index = arr.findIndex(compare)
  if(index==0){
    return
  }
  if(index>0){
    arr.splice(index,1)
  }
  arr.unshift(val)
  if(maxLen&&arr.length>maxLen){
    arr.pop()
  }
}

export function saveSeach(query){
      let searches = storage.get(SEARCH_KEY,[])
      insertArray(search,query,(item)=>{
        return item === query
      },SEARCH_MAX_LENGTH)
      storage.set(SEARCH_KEY,searches)
      return searches
}
export function loadSearch(){
  return storage.get(SEARCH_KEY,[])
}