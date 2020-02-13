import React from 'react'
import App from 'next/app'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import * as Sentry from '~/plugins/sentry'
import { initLogRocket } from '~/plugins/logrocket'
import { trackPageView } from '~/plugins/google-analytics'

Sentry.init()
initLogRocket().withSentry(Sentry)

class MyApp extends App {
    getInitialProps = async (appContext: any) => {
        const appProps = await App.getInitialProps(appContext)
        return { ...appProps }
    }

    componentDidMount() {
        trackPageView()
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope(scope => {
            Object.keys(errorInfo).forEach(key => {
                scope.setExtra(key, errorInfo[key])
            })

            Sentry.captureException(error)
        })

        super.componentDidCatch(error, errorInfo)
    }

    render() {
        const { Component, pageProps } = this.props
        return <Component {...pageProps} />
    }
}

export default MyApp
