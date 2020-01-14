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

        /**
         * plugins
         */
        config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))

        /**
         * alias
         */
        config.resolve.alias = {
            ...config.resolve.alias,
            '~': path.resolve(__dirname, './'),
        }

        return config
    },
}
