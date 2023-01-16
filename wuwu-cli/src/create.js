const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');
// 下载目录
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
let downloadGit = require('download-git-repo');
// 可以把异步的api转换成promise
downloadGit = promisify(downloadGit);

const MetalSmith = require('metalsmith'); // 遍历文件夹
// consolidate统一了所有的模板引擎
let { render } = require('consolidate').ejs;

render = promisify(render); // 包装渲染方法

let ncp = require('ncp');
const { downloadDirectory } = require('./constants');

ncp = promisify(ncp);

// 1).获取仓库列表
const fetchRepoList = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  // https://api.github.com/orgs/wuwu-cli/repos   orgs就是组织，如果是用户的话users。repos获取所有的仓库
  const { data } = await axios.get('https://api.github.com/users/wuchao03/repos');
  return data;
};

const fetchTagList = async (repo) => {
  // tags选择仓库的版本，contents选择仓库里的内容文件
  const { data } = await axios.get(`https://api.github.com/repos/wuchao03/${repo}/tags`);
  return data;
};

// 封装loading效果
const wrapFetchAddLoding = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start(); // 开始loading
  const result = await fn(...args);
  spinner.succeed(); // 结束loading
  return result;
};

// 下载目录
const download = async (repo, tag) => {
  let api = `wuchao03/${repo}`; // 下载项目
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`; // 将模板下载到对应的目录中
  await downloadGit(api, dest);
  return dest; // 返回下载的最终目录
};

module.exports = async (projectName) => {
  let repos = await wrapFetchAddLoding(fetchRepoList, 'fetching template ...')();

  // 选择模板
  repos = repos.map((item) => item.name);
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos, // 选择模式
  });
  console.log(repo);

  // 通过当前选择的项目 拉取对应的版本
  let tags = await wrapFetchAddLoding(fetchTagList, 'fetching tags ...')(repo);
  tags = tags.map((item) => item.name);
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choice tag template to create project',
    choices: tags,
  });
  // console.log(repo, tag); //下载模板
  // 把模板放到一个临时目录里 存好，以备后期使用
  const target = await wrapFetchAddLoding(download, 'download template')(repo, tag);
  // 简单模板
  // 将下载的文件拷贝到当前执行命令的目录下
  // await ncp(target, path.join(path.resolve(), projectName));
  // 复杂模板
  // 把git上的项目下载下来，如果有ask文件就是一个复杂的模板，我们需要用户选择，选择后编译模板
  // metalsmith只要是模板编译 都需要这个模块
  // 没有ask文件说明不需要编译
  if (!fs.existsSync(path.join(target, 'ask.js'))) {
    await ncp(target, path.join(path.resolve(), projectName));
  } else {
    await new Promise((resovle, reject) => {
      MetalSmith(__dirname)
        .source(target) // 遍历下载的目录
        .destination(path.join(path.resolve(), projectName)) // 输出渲染后的结果
        .use(async (files, metal, done) => {
          // 弹框询问用户
          const result = await Inquirer.prompt(require(path.join(target, 'ask.js')));
          const data = metal.metadata();
          Object.assign(data, result); // 将询问的结果放到metadata中保证在下一个中间件中可以获取到
          delete files['ask.js'];
          done();
        })
        .use((files, metal, done) => {
          Reflect.ownKeys(files).forEach(async (file) => {
            let content = files[file].contents.toString(); // 获取文件中的内容
            if (file.includes('.js') || file.includes('.json')) { // 如果是js或者json才有可能是模板
              if (content.includes('<%')) { // 文件中用<% 我才需要编译
                content = await render(content, metal.metadata()); // 用数据渲染模板
                files[file].contents = Buffer.from(content); // 渲染好的结果替换即可
              }
            }
          });
          done();
        })
        .build((err) => { // 执行中间件
          if (!err) {
            resovle();
          } else {
            reject();
          }
        });
    });
  }
};
