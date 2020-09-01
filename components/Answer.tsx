import React from 'react'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core'
import { InitialState } from '~/reducers/index.type'

export interface Props {
    currentStep: number
    store: InitialState
}

export const useStyles = makeStyles(theme => ({
    answerContainer: {
        display: 'inline-flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}))

const Answers: React.FC<Props> = ({ currentStep, store }) => {
    const classes = useStyles()

    const list: (string|number)[] = []

    switch (currentStep) {
        case 0: {
            if (store.ladderQty) {
                list.push(store.ladderQty)
            }
            break
        }
        case 1: {
            store.players.forEach((row) => {
                if (row) {
                    list.push(row)
                }
            })
            break
        }
        case 2: {
            store.rewards.forEach((row) => {
                if (row) {
                    list.push(row)
                }
            })
            break
        }
        default:
            break
    }

    return (
        <span className={classes.answerContainer}>
            {list.map((row, key) => {
                return (
                    <Chip key={key} size="small" label={row} />
                )
            })}
        </span>
    )
}

export default Answers
