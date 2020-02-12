import { version } from '~/package.json'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const LADDER_VERSION = version ?? '0.1.0'
export const SENTRY_DSN = process.env.LADDER_PLUGIN_SENTRY_DSN ?? ''
