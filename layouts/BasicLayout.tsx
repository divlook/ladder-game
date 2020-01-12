import * as React from 'react'
import Head from 'next/head'
import Container from '@material-ui/core/Container'

export type Props = {
    title?: string
}

const Layout: React.FC<Props> = ({ children, title = 'Ladder Game' }) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge"></meta>
        </Head>
        <header />
        <Container>{children}</Container>
        <footer />
    </div>
)

export default Layout
