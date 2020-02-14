import { version } from '~/package.json'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const LADDER_VERSION = version ?? '0.1.0'

export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_BUILT = process.env.LADDER_IS_BUILT === true

/*
 * plugins
 */
export const SENTRY_DSN = process.env.LADDER_PLUGIN_SENTRY_DSN ?? ''
export const USING_SENTRY = SENTRY_DSN && IS_BUILT

export const LOGROCKET_ID = process.env.LADDER_PLUGIN_LOGROCKET_ID ?? ''
export const USING_LOGROCKET = LOGROCKET_ID && IS_BUILT

export const GA_ID = process.env.LADDER_PLUGIN_GA_ID ?? ''
export const USING_GA = GA_ID && IS_PRODUCTION && IS_BUILT
