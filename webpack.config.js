const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 两个 chunk 都引入了 lodash，这个重复的模块会被引入到各个 chunk 中,
// 从分析出来的 bundle 图中也能看到重复的 lodash 模块

// 解决方法：
// SplitChunksPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中, 或者提取到一个新生成的 chunk
// https://webpack.docschina.org/plugins/split-chunks-plugin

module.exports = {
  mode: 'development',
  entry: {
    // 1. 如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中
    // 2. 这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来
    main: './src/index.js',
    sum: './src/sum.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  // 应用 SplitChunksPlugin 插件优化
  optimization: {
    splitChunks: {
      // chunks: 'all', // 拆分所有模块（即下面两种类型）
      // chunks: 'async', // 只拆分异步加载的模块，默认值
      // chunks: 'initial', // 只拆分初始模块，即 entry 中定义的

      // chunk 缓存组，将一堆 module 拆分到一个 chunk 下
      cacheGroups: {
        nodeModules: {
          // chunk 的文件名
          name: 'node_modules',
          // 匹配的 module 路径或 chunk 名字，
          // 当匹配到某个 chunk 的名字时，这个 chunk 里面引入的所有 module 都会选中
          // 如 node_modules 下的所有模块
          test: /[\\/]node_modules[\\/]/,
          // 要拆分的模块的类型：all、async、initial
          chunks: 'all',
          // 权重，数字越大表示优先级越高
          // 一个 module 可能会满足多个 cacheGroups 的正则匹配（一个模块可以属于多个缓存组）
          // 到底将这个 module 放在哪个缓存组取决于优先级
          priority: 1,
          // 表示被拆分出的 bundle 在拆分之前的体积的最小数值，只有 >= minSize 的 bundle 会被拆分出来（以 bytes 为单位）
          // minSize: 1000
        },
        lodash: {
          name: 'lodash-hahaha',
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          chunks: 'all',
          priority: 2
        }
        // 上面的结果是 lodash 被分配到一个 lodash-hahaha.bundle.js
        // 其余 node_modules 里的被业务代码引用过的包被分配到一个 node_modules.bundle.js
        
        // node_modules.bundle.js 753 KiB
        // lodash-hahaha.bundle.js 550 KiB
        // main.bundle.js 34.4 KiB
        // sum.bundle.js 9 KiB
      }
    }
  }
}
