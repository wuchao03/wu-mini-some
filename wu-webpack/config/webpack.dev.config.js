const merge = require('webpack-merge')
const common = require('./webpack.base.config')
const webpack = require('webpack')
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // 在这里添加即可；source-map作用是在浏览器控制台调试时可以追踪源码
  output: {
    filename: 'js/[name].[hash:8].js',
    // 在这里添加
    chunkFilename: 'js/[name].js',
  },
  // 在这里添加代码
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: false,
    port: 9000,
    compress: true,
    hot: true,
    inline: true,
    proxy: {
      '/proxy': {
        target: 'https://192.111:8800',
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/proxy': ''
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})