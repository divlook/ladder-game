import React, { FC, useCallback } from 'react'
import { GA_ID, USING_GA } from '~/lib/constants'

let definedDataLayer = false
let definedGtag = false

export const gtag = (...args) => {
    if (USING_GA) {
        if (definedDataLayer === false) {
            definedDataLayer = true
            if (Array.isArray(window['dataLayer']) === false) {
                window['dataLayer'] = window['dataLayer'] || []
            }
        }

        if (definedGtag === false) {
            definedGtag = true
            if (typeof window['gtag'] !== 'function') {
                window['gtag'] = (...args) => {
                    window['dataLayer'].push(...args)
                }
            }
        }

        window['gtag'](...args)
    }
}

export function trackPageView({ title, location, path }: { title?: string; location?: string; path?: string } = {}) {
    if (USING_GA) {
        gtag('config', GA_ID, {
            ['page_title']: title ?? window?.document?.title,
            ['page_location']: location ?? window?.location?.href,
            ['page_path']: path ?? window?.location?.pathname,
        })
    }
}

export const GoogleAnalytics: FC = () => {
    const setGoogleTags = useCallback(() => {
        return {
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
            `,
        }
    }, [])

    if (USING_GA) {
        return (
            <>
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
                <script dangerouslySetInnerHTML={setGoogleTags()} />
            </>
        )
    }

    return  null
}
