import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { Typography, Box, Grid, makeStyles } from '@material-ui/core'
import { InitialState } from '~/reducers/index.type'
import { useLifecycle } from '~/hooks/lifecycle'

export interface State {
    isPaintingLadder: boolean
    isPaintedLadder: boolean
    mapWidth: number
    mapHeight: number
}

export const defaultOption = {
    mapMinHeight: 300,
}

export const initialState: State = {
    isPaintingLadder: false,
    isPaintedLadder: false,
    mapWidth: 0,
    mapHeight: defaultOption.mapMinHeight,
}

const useStyles = (state: State) =>
    makeStyles(theme => ({
        root: {
            width: '100%',
            minHeight: state.mapHeight,
        },
        ladders: {
            width: state.mapWidth,
            minHeight: state.mapHeight,
        },
        ladderItem: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
        },
        ladderItemHeader: {
            textAlign: 'center',
            marginBottom: theme.spacing(2),
        },
        ladderItemFooter: {
            textAlign: 'center',
            marginTop: theme.spacing(2),
        },
        ladderItemBlock: {
            position: 'relative',
            backgroundColor: '#9e7662',
            width: 10,
            height: 32,
            '&:first-child': {
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
            },
            '&:last-child': {
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
            },
            '&:nth-child(2n):not(:last-child):not(:first-child)': {
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: '#795548',
                '&:hover, &.active': {
                    zIndex: 1,
                    boxShadow: '0 0 8px 4px rgba(255, 255, 255, 0.4), 0 0 12px 12px rgb(158, 118, 98, 0.6)',
                },
            },
        },
        ladderItemHandle: {
            cursor: 'pointer',
        },
        cursorGrap: {
            cursor: 'grab',
        },
        cursorGrabbing: {
            cursor: 'grabbing',
        },
        cursorNoDrop: {
            cursor: 'no-drop',
        },
    }))

const LadderGame: React.FC<InitialState> = props => {
    const { useCreated, useMounted } = useLifecycle({ useLog: true, logLabel: 'LadderGame' })
    const [state, setState] = useState(initialState)
    const classes = useStyles(state)()

    const wrapperRef = useRef<HTMLDivElement>(null)

    const methods = {
        calcMapSize() {
            setState({
                ...state,
                mapWidth: wrapperRef.current?.clientWidth || 0,
                mapHeight: Math.max(state.mapHeight, wrapperRef.current?.clientHeight || 0),
            })
        },
        paintLadder() {
            setState({
                ...state,
                isPaintingLadder: true,
            })
            return new Promise(resolve => {
                setTimeout(() => {
                    setState({
                        ...state,
                        isPaintingLadder: false,
                        isPaintedLadder: true,
                    })
                    resolve()
                }, 1000)
            })
        },
        handleClick(e) {
            e.persist()
            const isHandle = e.target?.classList?.contains?.(classes.ladderItemHandle)
            console.log('isHandle', isHandle)
        },
    }

    useCreated(() => {
        methods.calcMapSize()
        wrapperRef.current?.addEventListener('selectstart', e => e.preventDefault())
    })

    useMounted(() => {
        console.log(state)
        methods.paintLadder()
    })

    return (
        <div ref={wrapperRef} className={classes.root}>
            {(() => {
                if (state.isPaintingLadder) {
                    return <Typography>사다리가 그려지는 중 입니다. 기다려주세요.</Typography>
                } else if (state.isPaintedLadder && !state.isPaintingLadder) {
                    return (
                        <Grid className={classes.ladders} container spacing={2} justify="space-evenly">
                            {Array.from({ length: props.ladderQty }).map((row, key) => {
                                return (
                                    <Grid key={key} item>
                                        <Box className={classes.ladderItemHeader}>
                                            <Typography>{props.players[key] || `참가자 ${key + 1}`}</Typography>
                                        </Box>
                                        <Box className={classes.ladderItem}>
                                            {Array.from({ length: 21 }).map((row, key) => {
                                                // TODO: link는 1쌍당 1개만 가능
                                                // TODO: link로 생성된 막대기 클릭시 링크 해제

                                                const isHandler = key % 2 !== 0
                                                return (
                                                    <Box
                                                        key={key}
                                                        className={clsx(classes.ladderItemBlock, {
                                                            [classes.ladderItemHandle]: isHandler,
                                                        })}
                                                        onClick={methods.handleClick}
                                                    />
                                                )
                                            })}
                                        </Box>
                                        <Box className={classes.ladderItemFooter}>
                                            <Typography>{props.rewards[key] || `보상 ${key + 1}`}</Typography>
                                        </Box>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    )
                } else {
                    return null
                }
            })()}
        </div>
    )
}

export default LadderGame
