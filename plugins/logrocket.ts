import * as LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { NODE_ENV, LADDER_VERSION, LOGROCKET_ID, USE_SENTRY, USE_LOGROCKET } from '~/lib/constants'

export const initLogRocket = () => {
    if (USE_LOGROCKET) {
        LogRocket.init(LOGROCKET_ID, {
            release: `${NODE_ENV}@${LADDER_VERSION}`,
        })
        setupLogRocketReact(LogRocket)
    }
    return {
        withSentry,
    }
}

export const withSentry = Sentry => {
    if (USE_LOGROCKET && USE_SENTRY) {
        LogRocket.getSessionURL(sessionURL => {
            Sentry.configureScope(scope => {
                scope.setExtra('sessionURL', sessionURL)
            })
        })
    }
}
