/**
 * 配置webstorm编辑器识别@别名
 * 需要在编辑器框架 Preferences》语言 & 框架》JavaScript》Webpack指定当前文件路径
 */
'use strict';
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '.', dir);
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
    }
  },
};
