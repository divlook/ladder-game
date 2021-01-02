import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core'
import * as Sentry from '~/plugins/sentry'
import { GoogleAnalytics } from '~/plugins/google-analytics'

process.on('unhandledRejection', err => void Sentry.captureException(err))
process.on('uncaughtException', err => void Sentry.captureException(err))

class MyDocument extends Document {
    static async getInitialProps(ctx: any) {
        const sheets = new ServerStyleSheets()
        const originalRenderPage = ctx.renderPage

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App: any) => (props: any) => sheets.collect(<App {...props} />),
            })

        const initialProps = await Document.getInitialProps(ctx)

        return {
            ...initialProps,
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        }
    }

    render() {
        return (
            <Html lang="ko">
                <Head>
                    <GoogleAnalytics />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
