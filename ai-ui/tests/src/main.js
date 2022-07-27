import Vue from "vue";
import App from "./App.vue";
// 静态配置路由
// import router from './router/staticRouter';
// 自动配置路由-根据页面关系配置
import router from "./router/autoRouter";
import store from "./store";


import "vue-easytable/libs/theme-default/index.css";
import VueEasytable from "vue-easytable";
Vue.use(VueEasytable);


/*import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)*/


/*
import {Toast} from 'vant';
Toast.setDefaultOptions({
  position: 'bottom'
});
*/
import Vant from "vant";
import "vant/lib/index.less";

import "@/assets/css/common.less";

// 自动注册公共组件
import "./components/index";

Vue.use(Vant);

import dayjs from "dayjs";
Vue.prototype.$dayjs = dayjs;
Vue.config.productionTip = false;

const whiteLists = ['404-index'];

router.beforeEach((to, from, next) => {
	if (whiteLists.includes(to.name) || store.state.authenticated) {
		next();
	} else {
		next(`/404/index`);
	}
})

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
