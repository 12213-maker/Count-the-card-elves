# {{projectName}}

{{description}}

## 框架说明

基于 [vue-cli 4.3](https://cli.vuejs.org/zh/guide/)，搭建前端项目模板移动端

> 按照官方要求，需要node>=8.9版本

技术栈： Vue2.x + Vue-Router + Vuex + Axios + Vant

* postcss-px-to-viewport 前端自适应
* 开启gzip压缩优化性能
* 路由自动化/动态配置
* 公共组件自动注册
* 本地开发Mock文件机制
* UI组件按需加载
* 抽离环境变量配置文件

目录结构说明

```text
├── README.md               // 说明文档
├── babel.config.js         // babel配置文件
├── config                  // 用于按约定自动生成路由配置
│   └── routerFactory.js
├── mock                    
│   └── _cashData           // 接口请求成功后缓存的文件
├── .env                    // 环境变量配置文件
├── src
│   ├── App.vue
│   ├── api
│   │   ├── config.js       // axios统一配置文件
│   │   └── login           // 分模块接口请求
│   │       └── index.js
│   ├── components          // 全局组件
│   │   ├── global          // 自动注册目录下组件
│   │   │   └── header
│   │   │       ├── Main.vue
│   │   │       └── index.js
│   │   └── index.js        // 自动注册组件脚本
│   ├── layout              // 布局
│   │   ├── Login.vue       // 登录布局
│   │   └── Main.vue        // 主要内容布局
│   ├── main.js             // 入口文件
│   ├── router              
│   │   ├── autoRouter.js   // 根据views目录结构自动化配置路由
│   │   ├── modules         // 手动配置路由模块
│   │   └── staticRouter.js // 自动读取modules路由模块并注册脚本
│   ├── store               // vuex
│   ├── utils               // 公共工具库
│   └── views               // 业务代码
├── template                // 用于自动化配置路由的模板
├── vue.config.js           // vue-cli配置文件
├── webstorm.config.js      // 用于webstorm自动识别@别名字配置
└── yarn.lock
```

## 安装
```
yarn 
或者 
npm install
```

#### 启动开发环境
```
npm run serve
```

#### 编译打包生成环境
```
npm run build
```

## 路由
框架集成两种路由方案：

1. 分模块静态导入路由配置
2. 约定结构配置，自动按照目录结构生成路由配置

#### 静态路由（适用于中小型项目）
通过 src/router/staticRouter.js 导入静态路由，读取./modules文件夹下所有js文件合并路由；

除了login文件夹下路由配置会合并到layout/Login.vue模板下，其他路由都会合并到layout/Main.vue；

#### 约定动态生成路由（适用于大型项目）
配置脚本文件为 src/router/autoRouter.js。读取业务文件夹views下非components下.vue文件（components文件夹约定为业务组件，不纳入路由配置）
根据目录路径 如 home/index.vue,路由映射为{path:'home/index',name: 'home-index'},支持嵌套；
除了login文件夹下路由配置会合并到layout/Login.vue模板下，其他路由都会合并到layout/Main.vue；

## mock模拟
通过对本地接口文件的策略性缓存，达到模拟json数据的效果；
#### 实现逻辑
假设后端接口约定结构是这样
```json
{
  "code": 0,
  "data": [],
  "msg": ""
}
```
code为0表示接口请求成功，则会截取到response返回值，并根据接口路径写入到/mock/_cashData/{path}.json;
若需自定义策略，请修改vue.config.js下逻辑
```js 
if(body.code && body.code === '0') {
  // 写入缓存mock文件
  const mockCashPath = `./mock/_cashData/${req.originalUrl}.json`;
  if(!fs.existsSync(mockCashPath.split('/').slice(0,-1).join('/'))) {
    mkdirsSync(mockCashPath.split('/').slice(0,-1).join('/'));
  }
  fs.writeFileSync(mockCashPath, JSON.stringify(body));
}
```
#### 如何使用
所有url请求中，若含有debug请求参数，则会触发mock请求；如http://localhost/login?debug

在axios配置文件 /src/api/config中有做相关判定逻辑；

## 按需加载
通过babel-plugin-import插件，实现按需加载；

默认配置vant的按需加载，其他组件库请自行配置;

> 请勿全局引入插件Vue.use(Vant),此方法引入不生效;

## 环境变量
相关配置参考[Vue Cli 环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html)
