/**
 * @Description: 根据业务页面自动生成路由
 * @author Yuxue Zhang
 * @date 2020/12/23
*/
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

class AutoRouter {
  /**
   * 根据业务页面自动生成路由
   * @param {String} watchDir 业务页面路径 'src/views'
   * @param {String} templateRouterPath 路由模板文件路径 'template/router.txt'
   * @param {String} targetRouterPath 路由生成路径 'template/router.js'
   */
  constructor (watchDir, templateRouterPath, targetRouterPath) {
    this.watchDir = watchDir;
    this.templateRouterPath = templateRouterPath;
    this.targetRouterPath = targetRouterPath;
  }
  
  // 初始化
  init () {
    /**
     * 监听文件新增删除，配置路由
     * 匹配views文件夹下所有vue文件，排除components业务组件
     */
    chokidar.watch(this.watchDir).on('all', (event, path) => {
      if (
        ['add', 'unlink'].indexOf(event) !== -1 &&
        path.indexOf('.vue') !== -1 &&
        path.indexOf('components') === -1
      ) {
        console.log(event, path);
        this.autoFactRouter(this.templateRouterPath, this.targetRouterPath);
      }
    });
  }
  
  /**
   * 根据模板自动生成路由文件
   * @param {*} templatePath 模板路径
   * @param {*} targetPath 生成文件路径
   */
  autoFactRouter (templatePath, targetPath) {
    fs.readFile(templatePath, 'utf-8', (error, data) => {
      //  用error来判断文件是否读取成功
      if (error) return console.error(`读取路由模板失败：${error.message}`);
      // 读取所有的路由
      const files = this.getFilesSync(this.watchDir);
      const routerBodys = [];
      files.forEach((filePath) => {
        const compPath = filePath
          .replace(`${this.watchDir}/`, '')
          .replace(/\.vue$/, '');
        const result = `{
             path: '/${compPath.toLowerCase()}',
             name: '${compPath.replace(/\//g, '-').toLowerCase()}',
             component: () => import(/* webpackChunkName: "${compPath.toLowerCase()}" */ '${filePath.replace(/src/g,
  '@'
)}'),
             children: []
           }`;
        routerBodys.push(result);
      });
      const content = data.replace(
        '<%routers%>',
        `[${routerBodys.toString()}]`
      );
      fs.writeFile(targetPath, content, (err) => {
        if (err) throw err;
        console.log('路由写入成功');
      });
    });
  }
  
  /**
   * 读取文件夹下所有文件、文件夹
   * @param {String} fileDir 文件夹路径
   */
  getFilesSync (fileDir) {
    const fileList = [];
    this.readDir = (entry) => {
      const dirInfo = fs.readdirSync(entry);
      dirInfo.forEach((item) => {
        const location = path.join(entry, item);
        const info = fs.statSync(location);
        if (info.isDirectory()) {
          this.readDir(location);
        } else {
          fileList.push(location);
        }
      });
    };
    this.readDir(fileDir);
    return fileList;
  }
}

module.exports = AutoRouter;
