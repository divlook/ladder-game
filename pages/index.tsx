import React from 'react'
import { NextPage } from 'next'
import { Paper } from '@material-ui/core'
import BasicLayout from '~/layouts/BasicLayout'

const IndexPage: NextPage = () => {
    return (
        <BasicLayout>
            <Paper variant="outlined">
                <h1>Hello Next.js 👋</h1>
            </Paper>
        </BasicLayout>
    )
}

export default IndexPage
