'use strict'
/* eslint-disable */

const chalk = require('chalk')
const ghpages = require('gh-pages')
const { execSync } = require('child_process')
require('../lib/loadenv')('deploy')

const LADDER_DEPLOY_REMOTE = process.env.LADDER_DEPLOY_REMOTE || 'origin'
const LADDER_DEPLOY_BRANCH = process.env.LADDER_DEPLOY_BRANCH || 'master'
const LADDER_DEPLOY_REPO = process.env.LADDER_DEPLOY_REPO

const getCommitID = () => {
    try {
        return execSync(`git log -1 --pretty="%H"`).toString()
    } catch {
        return undefined
    }
}

const getTagName = (commitID) => {
    try {
        return execSync(`git tag --contains ${commitID}`).toString()
    } catch {
        return undefined
    }
}

// TODO: branch에 따라서 배포를 다르게 할 경우 사용
// git branch --show-current

const publishCallback = error => {
    console.group(chalk.cyan('ghpages'))
    if (error) {
        console.log(chalk.redBright('Fail to publish'))
        console.log(chalk.red(error))
    } else {
        console.log(chalk.green('Publish successfully'))
    }
    console.groupEnd()
}

const publishBasePath = '.'
const publishSrc = [
    'build/**/*',
    'configs/**/*',
    '!configs/**/*.local',
    'lib/**/*.js',
    'next.config.js',
    'package-lock.json',
    'package.json',
    'pm2.config.js',
]
const commitID = getCommitID()
const tagName = getTagName(commitID)

ghpages.clean()
ghpages.publish(
    publishBasePath,
    {
        src: publishSrc,
        remote: LADDER_DEPLOY_REMOTE,
        branch: LADDER_DEPLOY_BRANCH,
        repo: LADDER_DEPLOY_REPO,
        tag: tagName,
        message: commitID,
    },
    publishCallback
)
