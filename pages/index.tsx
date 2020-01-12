import React from 'react'
import { NextPage } from 'next'
import { Paper } from '@material-ui/core'
import DefaultLayout from '~/layouts/DefaultLayout'

const IndexPage: NextPage = () => {
    return (
        <DefaultLayout>
            <Paper variant="outlined">
                <h1>Hello Next.js 👋</h1>
            </Paper>
        </DefaultLayout>
    )
}

export default IndexPage
