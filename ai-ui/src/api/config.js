import axios from 'axios';
import { Dialog } from 'vant';
import { urlParser } from '@/utils';
import router from "@/router/autoRouter";
import store from '@/store/index.js';



// 请求默认配置
axios.defaults.baseURL = process.env.VUE_APP_REQUEST_URL;
axios.defaults.withCredentials = false;
// 本地mock地址
axios.defaults.headers['Content-Type'] = 'application/json';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// 拦截器
axios.interceptors.request.use((req) => {
  console.log(req.url.split('/')[1]);
  // console.warn(req)
  if (req.url.split('/')[1] == 'task') {
    req.url = req.url;
  } else {
    req.url = '/kpi' + req.url;
  }
  if (req.data) {
    req.data.uuid = `${new Date().getTime()}`;
    if (req.data.userId && req.url !== '/kpi/tokenValidate') {
      req.data.userId = sessionStorage.getItem('userId');
    }
  } else if (req.params) {
    req.params.uuid = `${new Date().getTime()}`;
    if (req.params.userId) {
      req.params.userId = sessionStorage.getItem('userId');
    }
  }
  
  const token = sessionStorage.getItem('token');
  if (token) {
    req.headers['Authorization'] = token;
  }
  // req.data.paramUserInfo = {
  //   userAccount: sessionStorage.userAccount || ''
  // };
  // if(req.method === 'get') {
  //   req.url += `?${serialize(req.data)}`;
  // }
  // req.url += '?debug';
  const urlQuery = urlParser(location.href);
  // 判断url是否包含debug字段，用于mock
  if (Object.keys(urlQuery).includes('debug')) {
    req.url += '&debug';
  }
  req.headers.Accept = '*/*';
  // req.headers.token = sessionStorage.token;
  return req;
});
axios.interceptors.response.use(
  (res) => {
    // console.log('返回值==>', res);
    if (res.status === 200) {
      if (res.data.code == 0) {
        return res.data;
      } else if (res.data.code == 401) {
        store.commit('setAuthenticated', false);
        router.push('/404/index');
      }

      // return Promise.reject(res.data);
    }
    return Promise.reject(res);
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 配置服务
axios.services = {
  // 服务名称
  investigate: 'app',
};
export default axios;