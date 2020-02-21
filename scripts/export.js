'use strict'
/* eslint-disable */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')
const { getInputs } = require('../lib/utils-node')

const args = getInputs()._
const exportDirArr = ['dist']

doExport()

function doExport() {
    console.group(chalk.cyan('export'))
    try {
        const tagName = getTagName()

        if (args[0]) {
            args[0] !== exportDirArr[0] && exportDirArr.push(args[0])
        } else if (tagName) {
            exportDirArr.push(tagName)
        }

        const exportDir = exportDirArr.join('/')
        const exportPath = path.resolve(process.cwd(), exportDir)

        if (fs.existsSync(exportPath)) {
            fs.rmdirSync(exportPath, {
                recursive: true,
            })
        }

        execSync(`next export -o ${exportDir}`)
        console.log(chalk.green(`Successfully exported to "${exportDir}"`))
    } catch (error) {
        console.log(chalk.redBright('Fail to export'))
        console.log(chalk.red(error))
    }
    console.groupEnd()
}

function getTagName(commitID = '') {
    try {
        return execSync(`git tag --contains ${commitID}`).toString()
    } catch {
        return undefined
    }
}
