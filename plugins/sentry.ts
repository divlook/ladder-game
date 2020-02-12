import {
    init as SentryInit,
    withScope as SentryWithScope,
    captureException as SentryCaptureException,
    Scope,
} from '@sentry/browser'
import { NODE_ENV, LADDER_VERSION, SENTRY_DSN } from '~/lib/constants'

const hasSentryDSN = !!SENTRY_DSN

export const init = () => {
    if (hasSentryDSN) {
        SentryInit({
            dsn: SENTRY_DSN,
            environment: NODE_ENV,
            release: LADDER_VERSION,
        })
    }
}

export const withScope = (callback: (scope: Scope) => void) => {
    if (hasSentryDSN) SentryWithScope(callback)
}

export const captureException = error => {
    return hasSentryDSN ? SentryCaptureException(error) : ''
}
