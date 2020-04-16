const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
// 多页面配置
// const MutiPageConfig = require('./MultiPage.config')
// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/NodeJs/dist/' : '/', // 默认'/'，部署应用包时的基本 URL
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  filenameHashing: true, // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  lintOnSave: process.env.NODE_ENV !== 'production', // 保存时eslint检测规范
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本,可以在 Vue 组件中使用 template
  productionSourceMap: false, // 生产环境的 source map
  transpileDependencies: [], // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件,想要Babel转译，请列出
  parallel: require('os').cpus().length > 1,
  pwa: {},
  css: { // css相关配置
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {
      less: {// less允许js
        javascriptEnabled: true
      }
    }
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
  },
  // multiple-pages 多页面模式下构建应用
  // pages: MutiPageConfig.MutiPageConfig,
  devServer: {
    open: true, // 项目构建成功之后，自动弹出页面
    overlay: {
      warnings: false,
      errors: true
    },
    setup: function (app) { // 支持POST请求
      app.post('/selection/payment-method', function (req, res) {
        res.redirect('/selection/payment-method')
      })
    },
    // 代理
    proxy: {
      '/api': {
        target: `https://michaelidssrv.com:44365`, // 设置你调用的接口域名和端口号
        ws: true,
        changeOrigin: true, // 跨域
        secure: false, // https
        pathRewrite: {
          '^/api': '' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://10.1.5.11:8080/xxx/duty?time=2017-07-07 14:57:22'，直接写‘/api/xxx/duty?time=2017-07-07 14:57:22’即可
        }
      },
      '/dev-api': {
        target: `https://michaelidssrv.com:44365`,
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api': ''
        }
      }
    }
  },
  // 会通过 webpack-merge 合并到最终的配置中
  configureWebpack: (config) => {
    // 设置别名
    // config.resolve.alias['img'] = path.resolve(__dirname, '../src/assets/images');
    // config.resolve.alias['styles'] = path.resolve(__dirname, '../src/assets/styles');
    if (process.env.NODE_ENV === 'production') { // 为生产环境修改配置...
      config.mode = 'production'
      // 入口文件
      // config.entry.app = ['./src/main.js'];
      // 删除console插件
      let plugins = [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            },
            output: {
              // 去掉注释内容
              comments: false
            }
          },
          sourceMap: false,
          parallel: true
        })
      ]
      // 重新配置插件
      config.plugins = [...config.plugins, ...plugins]
    } else { // 为开发环境修改配置...
      config.mode = 'development'
      config.devtool = 'source-map'
    }
    // 添加 loader
    // config.module.rules.push({
    //   // 处理less
    //   test: /\.less$/,
    //   exclude: /node_modules/,
    //   use: [{
    //     loader:"style-loader",
    //     sourceMap: true
    //   }, {
    //     loader:"css-loader",
    //     sourceMap: true
    //   }, {
    //     loader:"less-loader",
    //     sourceMap: true
    //   }]
    // })
    /* // 添加例外（不打包）
    config.externals = {
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios'
    } */
  },
  // 允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    // 删除html5 预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // 修复HMR
    config.resolve.symlinks(true)
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report')
        .use(BundleAnalyzerPlugin, [{
          analyzerMode: 'static'
        }])
    }
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development',
      config => {
        config.plugin('ScriptExtHtmlWebpackPlugin')
          .after('html')
          .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }]).end()
        // 公共资源提取，
        // vendors提取的是第三方公共库(满足提取规则的node_modules里面的且页面引入的)，这些文件会打到dist/js/chunk-vendors.js里面
        // 提取规则是每个页面都引入的才会打到chunk-vendors.js里面(如vue.js)
        // 控制条件是minChunks字段，所以该字段的值是当前activity/src/projects里面的html的个数
        config.optimization.splitChunks({
          chunks: 'async', // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
          // minSize: 30000, // 最小尺寸，30000
          // minChunks: 1, // 最小 chunk ，默认1
          // maxAsyncRequests: 5, // 最大异步请求数， 默认5
          // maxInitialRequests : 3, // 最大初始化请求书，默认3
          // automaticNameDelimiter: '~',// 打包分隔符
          // name: function(){}, // 打包后的名称，此选项可接收 function
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数,
              priority: 10, // 优先级配置项
              chunks: 'initial' // 'all'|'async'|'initial'(全部|按需加载|初始加载)的chunks
            },
            elementUI: {
              name: 'chunk-elementUI', // split elementUI into a single package
              priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
            },
            // common提取的应该是除了vendors提取后，剩余的满足条件的公共静态模块
            // 不需要common，所以将common置为{}，覆盖默认common配置
            commons: {
              name: 'common',
              test: resolve('src/components'), // can customize your rules
              minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数
              priority: 5, // 优先级配置项
              chunks: 'all',
              reuseExistingChunk: true
            }
          }
        })
        // 提取webpack运行时的代码
        config.optimization.runtimeChunk({
          name: 'manifest'
        })
        // 打包文件带hash
        config.output.filename('[name].[hash:16].js').end()
      })
  }
}
