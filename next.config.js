/* eslint-disable */

const path = require('path')
const { PHASE_PRODUCTION_BUILD, PHASE_EXPORT } = require('next/constants')
const isProd = process.env.NODE_ENV === 'production'
require('./lib/loadenv')('plugin')

module.exports = phase => {
    const configWrappers = []
    const LADDER_IS_BUILT = [PHASE_EXPORT, PHASE_PRODUCTION_BUILD].some(currentPhase => currentPhase === phase)

    if (phase === PHASE_PRODUCTION_BUILD) {
        configWrappers.push(require('@zeit/next-source-maps'))
    }

    return configWrappers.reduce((config, wrapper) => wrapper(config), {
        /**
         * Environment Variables
         */
        env: {
            LADDER_PLUGIN_SENTRY_DSN: process.env.LADDER_PLUGIN_SENTRY_DSN,
            LADDER_PLUGIN_LOGROCKET_ID: process.env.LADDER_PLUGIN_LOGROCKET_ID,
            LADDER_PLUGIN_GA_ID: process.env.LADDER_PLUGIN_GA_ID,
            LADDER_IS_BUILT,
        },

        /**
         * CDN Support with Asset Prefix
         */
        assetPrefix: './',

        /**
         * Build directory
         */
        distDir: isProd ? 'build' : '.next',

        /**
         * Static HTML
         *
         * @see https://nextjs.org/docs/api-reference/next.config.js/exportPathMap
         */
        exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
            return {
                // "생성될 pathname": { page: "pages의 경로", query?: InitialProps }
                '/': { page: '/' },
            }
        },

        /**
         * URL 뒤에 Slash 존재 여부
         *
         * @see https://nextjs.org/docs/api-reference/next.config.js/exportPathMap#adding-a-trailing-slash
         * @example
         * exportTrailingSlash ? "/about/index.html" : "/about.html"
         */
        exportTrailingSlash: true,

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
    })
}
