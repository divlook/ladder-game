'use strict'
/* eslint-disable */

const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const deployConfigDir = path.resolve(process.cwd(), './configs/deploy')

if (!fs.existsSync(deployConfigDir)) {
    fs.mkdirSync(deployConfigDir, {
        recursive: true,
    })
}

const getInputs = () => {
    return argv
}

const getServerNames = () => {
    return fs.readdirSync(deployConfigDir).reduce((result, fileName) => {
        if (fileName.includes('.example') === false) {
            const serverName = fileName.split('.')[0]
            if (result.includes(serverName) === false) result.push(serverName)
        }
        return result
    }, [])
}

module.exports = {
    getInputs,
    getServerNames,
}
