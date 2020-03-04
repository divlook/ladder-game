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
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
