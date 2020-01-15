/* eslint-disable */

const path = require('path')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    distDir: isProd ? 'build' : '.next',

    /**
     * @see https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
     */
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (!config.resolve) config.resolve = {}
        if (!config.resolve.alias) config.resolve.alias = {}
        if (!config.module) config.module = {}
        if (!config.module.rules) config.module.rules = []

        /*
         * plugins
         */
        config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

        /*
         * alias
         */
        config.resolve.alias = {
            ...config.resolve.alias,
            '~': path.resolve(__dirname, './'),
        }

        /*
         * rules
         */
        if (isServer) {
            config.module.rules.push({
                enforce: 'pre',
                test: /\.tsx?$/,
                exclude: [/node_modules/, /\.next/],
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    failOnWarning: false,
                    cache: false,
                },
            })
        }

        return config
    },
}
