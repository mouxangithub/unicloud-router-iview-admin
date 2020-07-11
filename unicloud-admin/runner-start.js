const { say } = require('cfonts')
const chalk = require('chalk')

function init() {
    say('unicloudAdmin', {
        colors: ['yellow'],
        font: 'simple',
        space: true
    })
    console.log(chalk.blue('┏ 正在使用NPM安装依赖 ------------------') +'\n' )
}

init()