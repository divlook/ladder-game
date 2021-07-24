import React, { useState, useReducer, useEffect, useRef } from 'react'
import { NextPage } from 'next'
import Typography from '@material-ui/core/Typography'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core'
import { log } from '~/lib/logger'
import DefaultLayout from '~/layouts/DefaultLayout'
import IndexReducer, { initialState } from '~/reducers/index.reducer'
import * as IndexAction from '~/reducers/index.action'
import LadderGame from '~/components/LadderGame'
import Answer from '~/components/Answer'

export const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    textField: {
        marginRight: theme.spacing(1),
        '&:last-child': {
            marginRight: theme.spacing(0),
        },
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        '&:last-child': {
            marginRight: theme.spacing(0),
        },
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
    const steps = ['몇 개의 사다리가 필요하신가요?', '이름을 입력해주세요.', '보상을 입력해주세요.']
    const [activeStep, setActiveStep] = useState(0)
    const [store, dispatch] = useReducer(IndexReducer, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = e => {
        e.preventDefault()
    }

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const handleReset = () => {
        setActiveStep(0)
        dispatch(IndexAction.resetAll())
        formRef.current?.reset()
    }

    const changeLadderQty = e => {
        if (Number(e?.target?.value) > 20) e.target.value = 20
        dispatch(IndexAction.changeLadderQty(Number(e?.target?.value)))
    }

    const changeName = index => e => {
        dispatch(IndexAction.changeName(index, e?.target?.value))
    }

    const changeReward = index => e => {
        dispatch(IndexAction.changeReward(index, e?.target?.value))
    }

    useEffect(() => {
        log(store)
    }, [store])

    return (
        <DefaultLayout>
            <Typography component="h1" variant="h4" align="center">
                👋 안녕하세요!
            </Typography>

            <form ref={formRef} className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, currentStep) => {
                        let isError = false

                        return (
                            <Step key={label}>
                                <StepLabel>
                                    {label} <Answer currentStep={currentStep} store={store} />
                                </StepLabel>
                                <StepContent>
                                    {(() => {
                                        switch (currentStep) {
                                            case 0: {
                                                isError = !store.ladderQty || store.ladderQty <= 1 || store.ladderQty > 20
                                                return (
                                                    <TextField
                                                        className={classes.textField}
                                                        type="number"
                                                        label={isError ? '숫자 2이상 20이하' : ''}
                                                        error={isError}
                                                        onChange={changeLadderQty}
                                                        defaultValue={(!isError && store.ladderQty) || ''}
                                                    />
                                                )
                                            }

                                            case 1: {
                                                return (
                                                    <React.Fragment>
                                                        {Array.from({ length: store.ladderQty }).map((row, key) => {
                                                            return (
                                                                <TextField
                                                                    key={key}
                                                                    className={classes.textField}
                                                                    onChange={changeName(key)}
                                                                    defaultValue={store.players[key] || ''}
                                                                />
                                                            )
                                                        })}
                                                    </React.Fragment>
                                                )
                                            }

                                            case 2: {
                                                return (
                                                    <React.Fragment>
                                                        {Array.from({ length: store.ladderQty }).map((row, key) => {
                                                            return (
                                                                <TextField
                                                                    key={key}
                                                                    className={classes.textField}
                                                                    onChange={changeReward(key)}
                                                                    defaultValue={store.rewards[key] || ''}
                                                                />
                                                            )
                                                        })}
                                                    </React.Fragment>
                                                )
                                            }

                                            default:
                                                return null
                                        }
                                    })()}

                                    <Box className={classes.actionsContainer}>
                                        <Box>
                                            <Button disabled={currentStep === 0} onClick={handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                                disabled={isError}
                                            >
                                                Next
                                            </Button>
                                        </Box>
                                    </Box>
                                </StepContent>
                            </Step>
                        )
                    })}
                </Stepper>
            </form>

            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Box>
                        <LadderGame {...store} />
                    </Box>
                    <Box>
                        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                            Back
                        </Button>
                        <Button onClick={handleReset} className={classes.button}>
                            Reset
                        </Button>
                    </Box>
                </Paper>
            )}
        </DefaultLayout>
    )
}

export default IndexPage
