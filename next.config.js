const path = require('path')

module.exports = {
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
