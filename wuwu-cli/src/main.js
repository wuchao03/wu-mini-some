const program = require('commander');
// console.log(process.argv);
// 解析用户传递过来的参数
// program.parse(process.argv);
const path = require('path');
const figlet = require('figlet');
const { version } = require('./constants');

const actionsMap = {
  create: { // 创建模板
    description: 'create project',
    alias: 'cr',
    examples: [
      'wuwu-cli create <project-name>',
    ],
  },
  config: { // 配置配置文件
    description: 'config info',
    alias: 'c',
    examples: [
      'wuwu-cli config get <k>',
      'wuwu-cli config set <k> <v>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};
// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  program
    .command(action) // 命令的名称
    .alias(actionsMap[action].alias) // 命令的别名
    .description(actionsMap[action].description) // 命令的描述
    .action(() => { // 动作
      if (action === '*') {
        console.log(actionsMap[action].description);
      } else {
        // console.log(action);
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

// 监听help命令打印帮助信息
// program.on('--help', () => {
//   console.log('Examples');
//   Object.keys(actionsMap).forEach((action) => {
//     (actionsMap[action].examples || []).forEach((example) => {
//       console.log(`${example}`);
//     });
//   });
// });
program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log(`\r\n${figlet.textSync('wuwucli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })}`);
    // 新增说明信息
    // console.log(`\r\nRun ${chalk.cyan('roc <command> --help')} show details\r\n`);
  });

program.version(version).parse(process.argv);
