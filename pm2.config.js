/* eslint-disable */

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
            key  : '~/Documents/pem/chad.pem',
            user: 'ubuntu',
            host: '132.145.88.159',
            ref: 'origin/master',
            repo: 'git@github.com:divlook/ladder-game.git',
            path: '/home/ubuntu/app/ladder-game/production',
            'pre-setup': 'mkdir -p /home/ubuntu/app/ladder-game/production',
            'post-deploy': 'npm install --only=prod --no-audit && pm2 reload pm2.config.js --env production',
        },
    },
}
