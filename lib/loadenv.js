/* eslint-disable */

const path = require('path')
const dotenv = require('dotenv')

/**
 *
 * @param {'deploy' | 'plugin'} envName
 */
module.exports = envName => {
    const localEnv = dotenv.config({
        path: path.resolve(process.cwd(), 'configs', `${envName}.env.local`),
    })
    const originEnv = dotenv.config({
        path: path.resolve(process.cwd(), 'configs', `${envName}.env`),
    })

    return {
        ...originEnv.parsed,
        ...localEnv.parsed,
    }
}
