/* eslint-disable */

const chalk = require('chalk')
const { execSync } = require('child_process')
const { Select } = require('enquirer')
const { getInputs, getServerNames } = require('../lib/utils-node')

const inputServerNames = getInputs()._
const serverNames = getServerNames()
const validServerNames = inputServerNames.filter(input => serverNames.includes(input))

run()

function run() {
    if (serverNames.length > 0) {
        if (validServerNames.length === 0) {
            const prompt = new Select({
                name: 'serverName',
                message: '서버를 선택해주세요.',
                choices: serverNames,
            })

            prompt.run()
                .then(answer => {
                    if (answer) deDeploy(answer)
                })
                .catch(console.error)
        } else {
            validServerNames.forEach(serverName => {
                deDeploy(serverName)
            })
        }
    }
}

function deDeploy(serverName) {
    console.group(`${chalk.cyan('deploy')} : ${serverName}`)
    try {
        execSync(`pm2 deploy pm2.config.js ${serverName} ${process.argv.slice(2).join(' ')}`)
        console.log(chalk.green('Deploy successfully'))
    } catch (error) {
        console.log(chalk.redBright('Fail to deploy'))
        console.log(chalk.red(error))
    }
    console.groupEnd()
}
