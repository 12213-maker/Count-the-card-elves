export default [
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "home" */ '@/views/404/index.vue')
  }
];