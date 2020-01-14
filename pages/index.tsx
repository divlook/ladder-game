import React from 'react'
import { NextPage } from 'next'
import { Typography } from '@material-ui/core'
import DefaultLayout from '~/layouts/DefaultLayout'

/*
사다리 수를 입력 받는다
이름을 입력 받는다
결과를 입력 받는다
막대기를 그린다
사용자가 중간 막대기를 그린다
게임을 시작한다 (동시 or 클릭순)
다시하기 or 처음으로
*/

const IndexPage: NextPage = () => {
    return (
        <DefaultLayout>
            <Typography component="h1" variant="h4" align="center">
                Hello Next.js 👋
            </Typography>
        </DefaultLayout>
    )
}

export default IndexPage
