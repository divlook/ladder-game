import React, { useState } from 'react'
import { NextPage } from 'next'
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import DefaultLayout from '~/layouts/DefaultLayout'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'

/*
사다리 수를 입력 받는다
이름을 입력 받는다
결과를 입력 받는다
막대기를 그린다
사용자가 중간 막대기를 그린다
게임을 시작한다 (동시 or 클릭순)
다시하기 or 처음으로
*/

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}))

const IndexPage: NextPage = () => {
    const classes = useStyles()
    const [activeStep, setActiveStep] = useState(0)
    const steps = ['몇개의 사다리가 필요하신가요?', '이름을 입력해주세요.', '보상을 입력해주세요.']

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const handleReset = () => {
        setActiveStep(0)
    }

    return (
        <DefaultLayout>
            <Typography component="h1" variant="h4" align="center">
                안녕! 👋
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography>TODO: index에 따른 컨텐츠 노출 (index: {index})</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                        Back
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                        Back
                    </Button>
                    <Button onClick={handleReset} className={classes.button}>
                        Reset
                    </Button>
                </Paper>
            )}
        </DefaultLayout>
    )
}

export default IndexPage
