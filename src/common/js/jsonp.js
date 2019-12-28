import originJsonp from 'jsonp'
export default function jsonp(url,data,option){
  // 拼接url
  url +=(url.indexOf('?')<0?'?':'&')+param(data)
       // 使用Promise
  return new Promise((resolve,reject)=>{
    originJsonp(url,data,(err,data)=>{
      if(!err){
        resolve(data)
      }else{
        reject(err)
      }
    })
  })
}
// 拼接data对象
export function param(data){

  let url = ''
  for(var k in data){
      let value = data[k] !== undefined?data[k]:''
      // encodeURIComponent() 对 URI 进行编码
      url +='&'+k+'='+encodeURIComponent(value)
  }
  // 传出[如果url不存在为空,存在则截取取值]
  return url ?url.substring(1):''
}
