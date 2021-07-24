import * as LogRocket from 'logrocket'

export const log = (...args) => {
    if (process.env.LADDER_IS_BUILT) {
        LogRocket.log(...args)
    } else {
        console.log(...args)
    }
}
