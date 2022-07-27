/**
 * 自动化配置路由-根据页面中配置parent字段组建路由嵌套关系
 */
import Vue from "vue";
import Router from "vue-router";
import loginLayout from "@/layout/Login.vue";
import mainLayout from "@/layout/Main.vue";

const requireComponent = require.context("@/views", true, /\.vue$/);
/*var loginLayoutRouter = {
  path: "/",
  name: "validate",
  component: loginLayout,
  redirect: "/validate/index",
  children: [],
};*/
// 主页面框架，所有自动配置的路由都放到此处
const mainLayoutRouter = {
  path: "/",
  component: mainLayout,
  redirect: "/404/index",
  children: []
};
// 未匹配默认跳转路由
const emptyRouter = {
  path: "*",
  redirect: "/",
};
// 路由自动化注册
// important!!!!!匹配规则：子路由在页面中配置parent字段指定父路由名称（路径，/转-，所有大写转小写）
try {
  // 记录所有子路由页面(含parent字段)
  const childrenComponents = [];
  requireComponent.keys().forEach((filePath) => {
    // 剔除业务组件components文件夹下vue文件
    if (filePath.indexOf("components") !== -1) {
      return;
    }
    const componentConfig = requireComponent(filePath);
    const componentItem = componentConfig.default || componentConfig;
    // if (!componentItem.name) {
    //   throw new Error(`${filePath} 请添加name字段`)
    // }
    // const component = Vue.component(componentItem.name, componentItem)
    const componentPath = filePath
      .replace(/^\.\//, "")
      .replace(/\.vue$/, "")
      .toLowerCase(); // 剥去文件名开头的 `./` 和`.vue`结尾的扩展名
    const componentName = componentPath.replace(/\//g, "-").toLowerCase();
    const chunckNames = filePath.replace(/^\.\//, "");
    const result = {
      path: "/" + componentPath, // home/detail
      name: componentName, // home-detail
      // component: () => component
      component: () =>
        import(/* webpackChunkName: "[request]" */ `@/views/${chunckNames}`),
      children: [],
    };
    // 优先添加非子路由页面
    if (componentItem.parent) {
      childrenComponents.push({
        path: componentPath,
        parentName: componentItem.parent,
        component: result,
      });
    } else {
      if (componentPath.indexOf("login/") === -1) {
        mainLayoutRouter.children.push(result);
      } else {
        loginLayoutRouter.children.push(result);
      }
    }
  });
  // 挂载子路由到父路由，若未找到提示parent配置错误
  let index = 0;
  let tempChildcompsLength = childrenComponents.length;
  while (index < childrenComponents.length) {
    const child = childrenComponents[index];
    const parent = findParentByName([mainLayoutRouter], child.parentName);
    if (parent) {
      if (!parent.children) parent.children = [];
      parent.children.push(child.component);
      childrenComponents.splice(index, 1);
    } else {
      index++;
    }
    // 循环到最后一项，判定childrenComponents是否有变化
    // 若没有，说明剩下的页面parent都没有找到
    if (index === childrenComponents.length) {
      if (tempChildcompsLength !== childrenComponents.length) {
        tempChildcompsLength = childrenComponents.length;
        index = 0;
      } else {
        // 根据parent没有找到父元素
        const page404 = childrenComponents.map((it) => {
          return it.path;
        });
        alert(`页面parent未找到，请检查: \n${page404.join("\n")}`);
      }
    }
  }
} catch (error) {
  alert(error.message);
}

/**
 * 根据父路由name查找父路由
 * @param {Array} routers 需要查找的路由数组
 * @param {String} parentName 父组件name
 */
function findParentByName(routers, parentName) {
  let parent = null;

  function findParent(routers, parentName) {
    try {
      routers.forEach((route) => {
        if (route.name === parentName) {
          parent = route;
          throw new Error();
        } else if (route.children && route.children.length) {
          findParent(route.children, parentName);
        }
      });
    } catch (err) {}
  }

  findParent(routers, parentName);
  return parent;
}

// const routes = [loginLayoutRouter, mainLayoutRouter, emptyRouter];
const routes = [ mainLayoutRouter, emptyRouter];
console.log(routes);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



Vue.use(Router);
export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes,
});
