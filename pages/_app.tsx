import React from 'react'
import App from 'next/app'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

class MyApp extends App {
    getInitialProps = async (appContext: any) => {
        const appProps = await App.getInitialProps(appContext)
        return { ...appProps }
    }
    render() {
        const { Component, pageProps } = this.props
        return <Component {...pageProps} />
    }
}

export default MyApp
