import * as Sentry from '@sentry/browser'
import { NODE_ENV, LADDER_VERSION, SENTRY_DSN, USING_SENTRY } from '~/lib/constants'

export const init = () => {
    if (USING_SENTRY) {
        Sentry.init({
            dsn: SENTRY_DSN,
            environment: NODE_ENV,
            release: LADDER_VERSION,
        })
    }
}

export const withScope = (callback: (scope: Sentry.Scope) => void) => {
    if (USING_SENTRY) Sentry.withScope(callback)
}

export const captureException = error => {
    return USING_SENTRY ? Sentry.captureException(error) : ''
}

export const configureScope = (callback: (scope: Sentry.Scope) => void) => {
    if (USING_SENTRY) Sentry.configureScope(callback)
}
