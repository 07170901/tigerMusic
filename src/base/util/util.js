// 随机值(有范围的)
function getRandomIndex(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}
// 洗牌函数
export function shuffle(arr){
  // 创造副本
  let _arr = arr.slice()
  //遍历数组
  for(let i = 0 ;i<_arr.length;i++){
    // 每次取出一个随机下标数
    let j = getRandomIndex(0,i)
    // 交换位置
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  // 返回数组
  return _arr
}

//函数节流
 export function  debounce(func,delay){
    let timer 
    return function(...args){
      if(timer){
        clearTimeout(timer)
      }
      timer = setTimeout(()=>{
        func.apply(this,args)
      },delay)
    }
 }
