/* eslint-disable */

const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const withSourceMaps = require('@zeit/next-source-maps')
require('./lib/loadenv')('plugin')

const configWrappers = [withSourceMaps]

const nextConfig = {
    /**
     * Environment Variables
     */
    env: {
        LADDER_PLUGIN_SENTRY_DSN: process.env.LADDER_PLUGIN_SENTRY_DSN,
    },

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
}

module.exports = configWrappers.reduce((config, wrapper) => wrapper(config), nextConfig)
