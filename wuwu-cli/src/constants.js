// 存放用户所需要的常量
const { name, version } = require('../package.json');

// 存储模板的位置
// process.env环境变量，Mac：HOME，Windows：USERPROFILE
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

const configFile = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.wuwurc`; // 配置文件的存储位置
const defaultConfig = {
  repo: 'wuchao03', // 默认拉取的仓库名
};

module.exports = {
  name,
  version,
  downloadDirectory,
};
