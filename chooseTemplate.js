const inquirer = require('inquirer')
const templates = require('./templates')

const choices = templates.map(o => ({
  name: o.name,
  value: o.url
}))

async function chooseTemplate () {
  const promptList = [
    {
      type: 'list', // type决定交互的方式，比如当值为input的时候就是输入的形式，list就是单选，checkbox是多选...
      name: 'template',
      message: '选择一个需要创建的工程化模板',
      choices
    }
  ]
  const answers = await inquirer.prompt(promptList) // 执行命令行交互，并将交互的结果返回
  const { template: url } = answers
  const template = templates.find(o => o.url === url).name
  return template
}

module.exports = chooseTemplate
