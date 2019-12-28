import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/recommend',
    name: 'recommend',
    component: () => import('../components/recommend/recommend.vue'),
    children:[{
      path:':id',
      component: () => import('../base/recommendList/recommendList.vue')
    }]
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import('../components/singer/singer.vue'),
    children:[{
    path:':id',
    component: () => import('../components/singer/singerdetail.vue')
  }]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../components/search/search.vue')
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('../components/rank/rank.vue'),
    children:[{
      path:':id',
      component: () => import('../base/recommendList/recommendList.vue')
    }]
  },

  {
    path: '*',
    redirect: {
      name: 'recommend'
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
