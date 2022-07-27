/**
 * 模板自动生成文件，请勿修改
 */
/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/index.js.vue'),
    children: []
  }, {
    path: '/me',
    name: 'complain',
    component: () => import(/* webpackChunkName: "me" */ '@/views/index.js.vue'),
    children: []
  }, {
    path: '/components/about',
    name: 'components-about',
    component: () => import(/* webpackChunkName: "components/about" */ '@/views/components/index.js.vue'),
    children: []
  }, {
    path: '/home/detail/item',
    name: 'home-detail-item',
    component: () => import(/* webpackChunkName: "home/detail/item" */ '@/views/home/detail/item.vue'),
    children: []
  }, {
    path: '/home/detail',
    name: 'home-detail',
    component: () => import(/* webpackChunkName: "home/detail" */ '@/views/home/detail.vue'),
    children: []
  }, {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/index.js.vue'),
    children: []
  }, {
    path: '/hot',
    name: 'hot',
    component: () => import(/* webpackChunkName: "hot" */ '@/views/hot.vue'),
    children: []
  }]
})

export default router
