/* eslint-disable */

const path = require('path')
const env = require('./lib/loadenv')('deploy')

module.exports = {
    apps: [
        {
            name: 'ladder-game (FE)',
            script: 'npm run start',

            // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
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
        production: {
            key: env.LADDER_DEPLOY_SSH_KEY,
            user: env.LADDER_DEPLOY_USER,
            host: env.LADDER_DEPLOY_HOST,
            ref: env.LADDER_DEPLOY_BRANCH,
            repo: env.LADDER_DEPLOY_REPO,
            path: path.join(env.LADDER_DEPLOY_PATH, 'production'),
            'pre-setup': `mkdir -p ${path.join(env.LADDER_DEPLOY_PATH, 'production')}`,
            'post-deploy': 'npm install --only=prod && pm2 startOrRestart pm2.config.js --env production && pm2 save',
        },
    },
}
