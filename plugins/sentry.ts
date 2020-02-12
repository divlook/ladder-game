import * as Sentry from '@sentry/browser'
import { version } from '~/package.json'


export const init = () => {
    Sentry.init({
        dsn: 'https://97a415ab381141079079160d82fcbdd7@sentry.io/2451725',
        environment: process.env.NODE_ENV,
        release: version,
    })
}

export const withScope = (scope) => void Sentry.withScope(scope)
export const captureException = (error) => Sentry.captureException(error)
