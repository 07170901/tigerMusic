import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import animate from 'animate.css'
// 懒加载(vue第三年插件)
import VueLazyload from 'vue-lazyload'
import './common/less/index.less'

import fastclick from 'fastclick'

Vue.config.productionTip = false
// 取消点击后三百毫秒的延时
fastclick.attach(document.body)
// 注册懒加载插件
Vue.use(VueLazyload,{
  loading:require('./common/image/tiger.jpg')
})
//Vue.use(animate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
