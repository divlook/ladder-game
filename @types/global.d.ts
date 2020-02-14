declare namespace NodeJS {
    export interface ProcessEnv {
        LADDER_PLUGIN_SENTRY_DSN: string
        LADDER_PLUGIN_LOGROCKET_ID: string
        LADDER_PLUGIN_GA_ID: string
        LADDER_IS_BUILT: boolean
    }
}
