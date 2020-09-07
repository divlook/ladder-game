import React from 'react'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core'
import { InitialState } from '~/reducers/index.type'

export interface Props {
    currentStep: number
    store: InitialState
}

export type AnswerItem = string | number

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

function getList(props: Props) {
    const list: AnswerItem[] = []
    const { ladderQty, players, rewards } = props.store

    switch (props.currentStep) {
        case 0: {
            if (ladderQty) {
                list.push(ladderQty)
            }
            break
        }
        case 1: {
            players.some((row) => {
                if (row) {
                    list.push(row)
                }

                return list.length === ladderQty
            })
            break
        }
        case 2: {
            rewards.some((row) => {
                if (row) {
                    list.push(row)
                }

                return list.length === ladderQty
            })
            break
        }
        default:
            break
    }

    return list
}

const Answers: React.FC<Props> = (props) => {
    const classes = useStyles()
    const list = getList(props)

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
