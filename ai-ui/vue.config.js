const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const fs = require("fs");
const path = require("path");

// const myTheme = path.resolve(__dirname, "./src/assets/css/vant.less");

function resolve(dir) {
  return path.join(__dirname, dir);
}

// 递归创建文件夹
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
}
module.exports = {
  publicPath: process.env.BASE_URL,
  // 配置多页输出
  pages: {
    index: {
      entry: ["src/main.js"],
    },
  },
  // 指定入口文件-需要注释掉pages对象，否则无效
  // vue-cli-service build --target app ./src/views/scene/index.js.js
  devServer: {
    port: "8888",
    host: "0.0.0.0",
    open: true, // 自动打开浏览器
    publicPath: "", // 请求路径配置
    before(app) {
      // 配置本地mock数据,拦截url中带debug参数
      app.all("*", (req, res) => {
        const { url, params } = req;
        if (
          url.indexOf("debug") !== -1 &&
          url.indexOf(process.env.VUE_APP_REQUEST_URL) !== -1
        ) {
          // 接口代理
          console.log(params);
          const mockFile = `./mock/_cashData/${params[0]
            .split("/")
            .join("/")}.json`;
          fs.readFile(mockFile, "utf-8", (error, data) => {
            if (error) {
              res.send({
                code: -1,
                data: null,
                msg: `读取文件失败,内容是${error.message}`,
              });
              return console.log(`读取文件失败,内容是${error.message}`);
            }
            res.send(data);
          });
        } else {
          app.next();
        }
      });
    },
    // 配置反向代理
    proxy: {
      [process.env.VUE_APP_REQUEST_URL]: {
        target: "http://gz-index.asiainfo.work/",
        //target: "http://10.5.19.23:8080",
        changeOrigin: true,
        /*pathRewrite: {
          [`^${process.env.VUE_APP_REQUEST_URL}`]: "",
        },*/
        onProxyRes(proxyRes, req) {
          let body = [];
          proxyRes.on("data", (chunk) => {
            body.push(chunk);
          });
          proxyRes.on("end", () => {
            body = JSON.parse(Buffer.concat(body).toString());
            if (body.code && body.code === "0") {
              // 写入缓存mock文件
              const mockCashPath = `./mock/_cashData/${req._parsedUrl.pathname}.json`;
              if (
                !fs.existsSync(mockCashPath.split("/").slice(0, -1).join("/"))
              ) {
                mkdirsSync(mockCashPath.split("/").slice(0, -1).join("/"));
              }
              fs.writeFileSync(mockCashPath, JSON.stringify(body));
            }
          });
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'text-color': 'red',
          hack: `true; @import "${path.resolve(
            __dirname,
            "src/assets/css/vant.less"
          )}";`,
        },
      },
    },

    sourceMap: process.env.NODE_ENV === "development",
  },
  productionSourceMap: false,
  configureWebpack: () =>
    // 为了兼容IE，在每个入口文件中提前使用babel-polyfill
    // Object.keys(config.entry).forEach((key) => {
    //   config.entry[key].unshift('babel-polyfill');
    // });
    ({
      resolve: {
        alias: {
          "@": path.join(__dirname, "src"),
          vue$: "vue/dist/vue",
        },
      },
      optimization: {
        minimizer: [
          // 删除打包后生成的console
          new TerserPlugin({
            terserOptions: {
              warnings: false,
              compress: {
                drop_console: true,
                drop_debugger: true,
              },
            },
          }),
        ],
      },
      plugins: [
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/,
          threshold: 10240, // 对超过10k的数据进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        }),
      ],
    }),
  // eslint-loader 是否在保存的时候检查
  lintOnSave: "error",
  // 需要babel转换的第三方库（node_modules）
  transpileDependencies: [],
};
