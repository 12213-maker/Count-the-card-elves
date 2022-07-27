/*
 * @Author: your name
 * @Date: 2022-02-14 17:42:23
 * @LastEditTime: 2022-02-17 14:17:04
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \gz-index\ai-ui\.eslintrc.js
 */
// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
  },
  env: {
    browser: true,
  },
  extends: ["plugin:vue/essential"],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    // // 关键字
    // 'no-var': 2, // 禁止使用var关键字，const或者let替代
    // 'no-const-assign': 2, // 禁止对const 关键字重新赋值
    // 'no-new-object': 2, // 禁止new关键字创建对象，请使用字面量方式
    // 'no-array-constructor': 2, // 禁止new关键字创建数组，请使用字面量方式
    // 'object-shorthand': 1, // 使用对象属性方法速记语法，key和变量名相同时
    // // 'quote-props': 2, // 只用引号引无效标识符的属性
    // 'array-callback-return': 1, // 数组操作回调函数中需要return返回
    // 'prefer-destructuring': 2, // 当对象多个属性引用时，使用对象解构
    // // 字符串
    // 'no-eval': 2, // 禁止使用eval
    // 'no-useless-escape': 2, // 禁止非必要的转义字符
    // 'quotes': [2, 'single'], // 字符串使用单引号
    // 'prefer-template': 2, // 优先使用模板字符串构建字符串
    // 'template-curly-spacing': 2, // 字符串模板变量无空格
    // // 函数
    // 'space-before-blocks': 1, // 函数花括号前空格
    // 'no-param-reassign': 2, // 禁止改变函数参数原始值
    // 'prefer-arrow-callback': 2, // 优先使用箭头函数
    // 'arrow-spacing': 2, // 使用箭头函数
    // 'arrow-parens': 2,
    // 'arrow-body-style': 2,
    // // 模块管理
    // 'no-duplicate-imports': 2, // 不要重复引用相同路径模块
    // 'no-iterator': 2, // 不要使用迭代器，用高阶函数map,reduce等替代
    // 'no-restricted-syntax': 2,
    // // 变量
    // 'prefer-const': 2, // 优先使用const
    // 'eqeqeq': 2, // 比较运算符使用完全（等于，大于，小于
    // 'no-mixed-operators': 2, // 多个运算符混合使用，用括号分割
    // // 代码块
    // 'nonblock-statement-body-position': 2, // 多行代码块用大括号包裹
    // 'no-else-return': 2, // 移除非必要的else return
    // // 符号
    // 'spaced-comment': 1, // 注释符与内容间空格隔开
    // 'indent': [1, 2], // 两个空格缩进
    // 'space-infix-ops': 2, // 运算符之间用空格隔开
    // 'newline-per-chained-call': 0, // 多个链式调用以.开头换行
    // 'no-whitespace-before-property': 2,
    // 'array-bracket-spacing': 2, // 不要在中括号内添加空格
    // 'object-curly-spacing': 2, // 在大括号内添加空格
    // 'max-len': [2, 200], // 最大长度限制200字符
    // 'comma-style': 2, // 行开头不要使用逗号
    // 'semi': 2, // 行尾使用分号
    // // 命名
    // 'camelcase': 0, // 对象，函数名称等采用驼峰命名
    // // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-unused-vars': 2, // 禁止声明未曾使用的变量
    // 'no-alert': 'error',
    // 'no-param-reassign': 'off', // 禁止给参数重新赋值
    // 'linebreak-style': [0, 'error', 'windows'],
  },
};
