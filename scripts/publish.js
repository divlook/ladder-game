'use strict'
/* eslint-disable */

const chalk = require('chalk')
const ghpages = require('gh-pages')
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

            prompt
                .run()
                .then(answer => {
                    if (answer) doPublish(answer)
                })
                .catch(console.error)
        } else {
            validServerNames.forEach(serverName => {
                doPublish(serverName)
            })
        }
    }
}

function doPublish(serverName) {
    new Promise(resolve => {
        const env = require('../lib/loadenv')(`deploy/${serverName}`)
        const LADDER_DEPLOY_REMOTE = env.LADDER_DEPLOY_REMOTE || 'origin'
        const LADDER_DEPLOY_BRANCH = env.LADDER_DEPLOY_BRANCH || 'master'
        const LADDER_DEPLOY_REPO = env.LADDER_DEPLOY_REPO
        const commitID = getCommitID()
        const publishBasePath = '.'
        const publishSrc = [
            'build/**/*',
            'public/**/*',
            'dist/**/*',
            'configs/**/*',
            '!configs/**/*.local',
            'lib/**/*.js',
            'next.config.js',
            'package-lock.json',
            'package.json',
            'pm2.config.js',
        ]
        const publishOptions = {
            src: publishSrc,
            remote: LADDER_DEPLOY_REMOTE,
            branch: LADDER_DEPLOY_BRANCH,
            repo: LADDER_DEPLOY_REPO,
            message: commitID,
        }

        ghpages.clean()
        ghpages.publish(publishBasePath, publishOptions, error => {
            publishCallback(error, serverName, publishBasePath, publishOptions)
            resolve(error)
        })
    })
}

function getCommitID() {
    try {
        return execSync(`git log -1 --pretty="%H"`).toString()
    } catch {
        return undefined
    }
}

function getTagName(commitID) {
    try {
        return execSync(`git tag --contains ${commitID ? commitID : ''}`)
            .toString()
            .split(/\n/)[0]
    } catch {
        return undefined
    }
}

async function publishCallback(error, serverName, publishBasePath, publishOptions) {
    console.group(`${chalk.cyan('ghpages')} : ${serverName}`)
    if (error) {
        console.log(chalk.redBright('Fail to publish'))
        console.log(chalk.red(error))
    } else {
        const tagName = getTagName()
        let successMsg = 'Success'

        if (tagName) {
            await new Promise(resolve => {
                ghpages.publish(
                    publishBasePath,
                    {
                        ...publishOptions,
                        tag: tagName,
                        silent: true,
                    },
                    error => {
                        if (!error) {
                            successMsg += ` ${tagName}`
                        }
                        resolve()
                    }
                )
            })
        }
        console.log(chalk.green(successMsg))
    }
    console.groupEnd()
}
