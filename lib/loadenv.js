/* eslint-disable */

const path = require('path')
const dotenv = require('dotenv')

/**
 *
 * @param {'deploy'} envName
 */
module.exports = envName => {
    const localEnv = dotenv.config({
        path: path.resolve(process.cwd(), `${envName}.env.local`),
    })
    const originEnv = dotenv.config({
        path: path.resolve(process.cwd(), `${envName}.env`),
    })

    return {
        ...originEnv.parsed,
        ...localEnv.parsed,
    }
}
