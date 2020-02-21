/* eslint-disable */

const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

const NODE_ENV = process.env.NODE_ENV || 'development'
const hasNodeEnv = typeof NODE_ENV === 'string'
const configDir = path.resolve(process.cwd(), 'configs')

/**
 * @typedef {'plugin' | 'deploy' | 'deploy/*'} EnvName
 */

/**
 * @param {string} envFileName
 */
const parseEnvFile = envFileName => {
    const envFilePath = path.join(configDir, envFileName)
    if (fs.existsSync(envFilePath)) {
        return dotenv.config({ path: envFilePath })
    } else {
        return { parsed: {} }
    }
}

/**
 * @param {EnvName} envName
 */
const loadenv = envName => {
    let localNodeEnv = { parsed: {} }
    let originNodeEnv = { parsed: {} }

    if (hasNodeEnv) {
        localNodeEnv = parseEnvFile(`${envName}.env.${NODE_ENV}.local`)
        originNodeEnv = parseEnvFile(`${envName}.env.${NODE_ENV}`)
    }

    const localEnv = parseEnvFile(`${envName}.env.local`)
    const originEnv = parseEnvFile(`${envName}.env`)

    return {
        ...originEnv.parsed,
        ...localEnv.parsed,
        ...originNodeEnv.parsed,
        ...localNodeEnv.parsed,
    }
}

module.exports = loadenv
