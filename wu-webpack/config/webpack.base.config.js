const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

// 为了代码简洁，在这里封装了一下
const cssTest = /\.css$/
const lessTest = /\.less$/
const cssModuleTest = /\.module\.css$/
const lessModuleTest = /\.module\.less$/
const baseCssUse = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  'postcss-loader'
]
const baseCssModuleUse = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: "[name]_[local]__[hash:5]"
      }
    },
  },
  'postcss-loader'
]


module.exports = {
  entry: { // 入口配置
    app: './src/index.js'
  },
  output: { // 出口配置
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../dist'),
    // 在这里添加
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
  // 接上，在这里追加
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    // 接上，追加以下代码，表示引用文件时如果没带后缀会按照此顺序依次查找
    extensions: ['.tsx', '.ts', '.js'],
  },
  // 在这里添加
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',   //模板，打包后会自动合并到dist的index.html中
      inject: 'body',
      hash: false
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
      ignoreOrder: true
    }),
    // 接上，在这里追加
    new webpack.DefinePlugin({
      // VERSION_H5: +new Date() // 这里添加了VERSION_H5
      'process.env': Object.keys(process.env).reduce(
        (env, key) => {
          env[key] = JSON.stringify(process.env[key]);
          return env;
        },
        {}
      )
    }),
  ],
  // 在这里添加代码
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        options: {
          cacheDirectory: true
        },
        loader: 'babel-loader'
      },
      // 接上，追加以下代码
      // 修改css和less的loader配置
      // 把之前的css和less的配置 替换成以下代码
      {
        test: cssTest,
        exclude: cssModuleTest,
        use: baseCssUse
      },
      {
        test: lessTest,
        exclude: lessModuleTest,
        use: [...baseCssUse, 'less-loader']
      },
      {
        test: cssModuleTest,
        use: baseCssModuleUse
      },
      {
        test: lessModuleTest,
        use: [...baseCssModuleUse, 'less-loader']
      },
      // 接上，追加以下代码
      {
        test: /\.(jpe?g|png|gif)$/i,
        options: {
          esModule: false,
          limit: 4096, // 配置低于4k的图片会转为base64格式
        },
        loader: 'url-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // 处理字体文件
        options: {
          esModule: false
        },
        loader: 'file-loader'
      },
      // 接上，追加以下代码
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
    ]
  },
}