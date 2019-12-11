// 因为jsonp 是export default
import jsonp from '../common/js/jsonp'
import {commonParams} from './config.js'

export function getRecommend(){
   const url = 'http://www.yinyuetai.com/mv/get-bigpic'
   const data =Object.assign({},commonParams)
   return jsonp(url,data)
}


