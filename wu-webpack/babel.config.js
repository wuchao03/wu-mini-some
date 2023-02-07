module.exports = {
  presets: [
    // '@babel/preset-env',   //默认配置
    // 在这里修改 @babel/preset-env 的配置
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'entry',
        corejs: {
          version: '3.8', // 你的core-js版本号前两位
          proposals: true,
        },
      },
    ],
    // 其他的保持不变
    '@babel/preset-react'
  ],
}