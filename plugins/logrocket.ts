import * as LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { NODE_ENV, LADDER_VERSION, LOGROCKET_ID, USING_SENTRY, USING_LOGROCKET } from '~/lib/constants'

export const initLogRocket = () => {
    if (USING_LOGROCKET) {
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
    if (USING_LOGROCKET && USING_SENTRY) {
        LogRocket.getSessionURL(sessionURL => {
            Sentry.configureScope(scope => {
                scope.setExtra('sessionURL', sessionURL)
            })
        })
    }
}
