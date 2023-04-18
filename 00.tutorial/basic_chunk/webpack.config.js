const path = require('path')

// 两个入口，分 chunk 输出

module.exports = {
  mode: 'development',
  entry: {
    // key 就是 chunk 名
    main: './src/index.js',
    sum: './src/sum.js'
  },
  output: {
    // [name] 就是 chunk 名
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
