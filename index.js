#! /usr/bin/env node

const { program } = require('commander') // 引入
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')

const templates = require('./templates')
const chooseTemplate = require('./chooseTemplate')

function start () {
  console.log(chalk.rgb(216, 27, 96)('\n 😈😈😈 您好, 靓仔~~'))
  console.log(chalk.cyanBright(' 🦄🦄🦄 您正在使用 fgCli 命令行工具...\n'))

  program.version(require('./package.json').version) // 输出版对应的版本号

  program
    .command('create <projectName>')
    .description('用于创建一个项目模板')
    .option('-T, --template [template]', '输入使用的模板名字')
    .action(async function (projectName, options) {
      let template = options.template
      projectName = projectName || 'untitled'

      if (!template) {
        template = await chooseTemplate() // 注意这里是一个异步方法
      }

      console.log(
        chalk.rgb(69, 39, 160)('你选择的模板是 👉'),
        chalk.bgRgb(69, 39, 160)(template)
      )

      // 下载前提示loading
      const spinner = ora({
        text: '正在下载模板...',
        color: 'yellow',
        spinner: {
          interval: 80,
          frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        }
      })
      spinner.start()

      /**
       * @downloadUrl   注意所需要的格式，不要直接复制粘贴仓库地址
       *
       * @project       项目名称
       *
       */
      const templateObj = templates.find(o => o.name === template)
      if (!templateObj) {
        console.log(
          chalk.bgRgb(220, 0, 8)(`  不存在该template：${template} `),
          '😭😭😭'
        )
        console.log('  您可以使用 list 命令查看所有支持的 template')
        return
      }
      const downloadUrl = templateObj.url
      download(downloadUrl, projectName, { clone: true }, async error => {
        if (error) {
          spinner.fail(`下载失败 😭😭😭`)
          console.log(
            chalk.bgRgb(220, 0, 8)(`  创建项目失败：${projectName} `),
            '😭😭😭'
          )
          console.log(
            '🧐🧐🧐 失败原因：',
            chalk.bgRgb(220, 0, 8)(error.message)
          )
        } else {
          spinner.succeed(`下载完成：${projectName}`)

          // await modifyPackage(projectName)

          console.log(
            '✌✌✌',
            chalk.rgb(69, 39, 160)('成功创建项目  👉  '),
            chalk.bgRgb(69, 39, 160)(projectName)
          )
        }
      })
    })

  program
    .command('list')
    .description('查看所有的模板')
    .action(function () {
      templates.forEach((temp, index) => {
        console.log(chalk.rgb(69, 39, 160)(`(${index + 1}) ${temp.name}  [${temp.description}]`))
      })
    })

  program.parse(process.argv)
}

start()
