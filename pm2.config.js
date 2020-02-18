/* eslint-disable */

const path = require('path')
const { getServerNames } = require('./lib/utils-node')
const serverNames = getServerNames()
const deployConfigs = serverNames.reduce((result, serverName) => {
    const env = require('./lib/loadenv')(`deploy/${serverName}`)

    const NODE_ENV = process.env.NODE_ENV || 'production'
    const LADDER_DEPLOY_SSH_KEY = env.LADDER_DEPLOY_SSH_KEY
    const LADDER_DEPLOY_USER = env.LADDER_DEPLOY_USER
    const LADDER_DEPLOY_HOST = env.LADDER_DEPLOY_HOST
    const LADDER_DEPLOY_REMOTE = env.LADDER_DEPLOY_REMOTE || 'origin'
    const LADDER_DEPLOY_BRANCH = env.LADDER_DEPLOY_BRANCH || 'master'
    const LADDER_DEPLOY_REPO = env.LADDER_DEPLOY_REPO
    const LADDER_DEPLOY_PATH = env.LADDER_DEPLOY_PATH

    const deployConfig = {
        key: LADDER_DEPLOY_SSH_KEY,
        user: LADDER_DEPLOY_USER,
        host: LADDER_DEPLOY_HOST,
        ref: `${LADDER_DEPLOY_REMOTE}/${LADDER_DEPLOY_BRANCH}`,
        repo: LADDER_DEPLOY_REPO,
        path: path.join(LADDER_DEPLOY_PATH, NODE_ENV),
        'pre-setup': `mkdir -p ${path.join(LADDER_DEPLOY_PATH, NODE_ENV)}`,
        'post-deploy': `npm install --only=prod --no-optional && pm2 startOrRestart pm2.config.js --env ${NODE_ENV} && pm2 save`,
    }

    result[serverName] = deployConfig

    return result
}, {})


module.exports = {
    apps: [
        {
            name: 'ladder-game (FE)',
            script: 'npm run start -- --port 3000',

            // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_test: {
                NODE_ENV: 'test',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            time: true,
            error_file: '/dev/null',
            out_file: '/dev/null',
            log_file: './log/fe.log',
        },
    ],

    deploy: {
        ...deployConfigs,
    },
}
