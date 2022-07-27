import Vue from 'vue';
import VueRouter from 'vue-router';
import loginLayout from '@/layout/Login.vue';
import mainLayout from '@/layout/Main.vue';
// 登录页面框架
const loginLayoutRouter = {
  path: '/login',
  name: 'loginLayout',
  redirect: '/login/index',
  component: loginLayout,
  children: []
};
// 主页面框架
const mainLayoutRouter = {
  path: '/',
  component: mainLayout,
  redirect: '/home',
  children: [],
  beforeEnter: ((to, from, next) => {
    // 校验权限
    next();
    // if (to.name !== 'login') {
    //   const isAdmin = window.sessionStorage.isLogin;
    //   if(isAdmin) {
    //     next();
    //   }else{
    //     next({name: 'login',query:{redirect: to.fullPath}});
    //   }
    // }else{
    //   next();
    // }
  })
};
// 未匹配默认跳转路由
const emptyRouter = {
  path: '*',
  redirect: '/home',
};
Vue.use(VueRouter);
/**
 * 路由拆分自动导入 合并modules文件夹下所有路由js
 */
const routerContext = require.context('./modules/', true, /\.js$/);
routerContext.keys().forEach((routerPath) => {
  const router = routerContext(routerPath).default || routerContext(routerPath);
  if(routerPath.indexOf('./login') === -1) {
    mainLayoutRouter.children.push(...router);
  }else{
    loginLayoutRouter.children.push(...router);
  }
});
const routes = [loginLayoutRouter,mainLayoutRouter,emptyRouter];
console.log(routes);
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});
export default router;
