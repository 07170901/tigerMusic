// 因为jsonp 是export default
import jsonp from '../common/js/jsonp'
import {commonParams} from './config.js'

export function getRecommend(){
   const url = 'http://www.yinyuetai.com/mv/get-bigpic'
   const data =Object.assign({},commonParams)
   return jsonp(url,data)
}
export function getTop(){
   const url = 'https://music.163.com/api/playlist/detail'
   const data =Object.assign({},commonParams,{
     id:19723756
   })
   return jsonp(url,data)
}
