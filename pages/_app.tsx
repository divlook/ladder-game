import React from 'react'
import App from 'next/app'
import Head from 'next/head'
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
        return (
            <>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="x-ua-compatible" content="IE=edge" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

                    <meta name="keywords" content="사다리게임, ladder game, 사다리타기" />
                    <meta name="description" content="간단한 사다리타기 게임입니다." />
                    <meta name="author" content="divlook" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Ladder Game" />
                    <meta property="og:description" content="간단한 사다리타기 게임입니다." />
                    <meta property="og:image" content="https://ladder.divlook.dev/img/thumbnail_small.png" />
                    <meta property="og:url" content="https://ladder.divlook.dev/" />
                </Head>
                <Component {...pageProps} />
            </>
        )
    }
}

export default MyApp
