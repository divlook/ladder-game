import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { Typography, Box, Grid, makeStyles } from '@material-ui/core'
import { InitialState } from '~/reducers/index.type'
import { useLifecycle } from '~/hooks/lifecycle'

/*
TODO:

클릭=터치
block은 1:1로만 연결가능
block이 1:1로 연결되면 midLine이 생성됨.
midLine은 [prevStep ,nextStep] 데이터를 가지고 있어야됨. 좌표를 저장하는 방법은 2가지가 있음
- 1. useMemo를 사용하여 mapData가 변경될 때마다 새로 계산하는 방법
- 2. new Map()을 사용하여 변경할때마다 해당 hash만 변경하는 방법
연결되면 isLinked가 true가 되고 더이상 클릭할 수 없음.
midLine을 취소할 수 있으며, 취소하면 원상복귀시켜야 됨.
보상은 midLine이 다 그려진 뒤 게임이 시작되기전에 순서를 랜덤으로 섞어야됨
resultLine은 mapData의 0부터 시작해서 nextStep을 따라 그려져야됨

*/

export interface MapData {
    uid: number
    el: HTMLDivElement | null
    isHandle: boolean
    isLinked: boolean
    prevLadder: MapData | null
    nextLadder: MapData | null
    prevStep: MapData | null
    nextStep: MapData | null
}

export interface State {
    isPaintingLadder: boolean
    isPaintedLadder: boolean
    mapData: MapData[][]
    mapWidth: number
    mapHeight: number
    ladderBlockCnt: number
}

export const defaultOption = {
    mapMinHeight: 300,
}

export const initialState: State = {
    isPaintingLadder: false,
    isPaintedLadder: false,
    mapData: [],
    mapWidth: 0,
    mapHeight: defaultOption.mapMinHeight,
    ladderBlockCnt: 21,
}

const useStyles = (state: State) =>
    makeStyles(theme => ({
        root: {
            width: '100%',
            minHeight: state.mapHeight,
            position: 'relative',
        },
        ladders: {
            position: 'relative',
            zIndex: 1,
            minWidth: state.mapWidth,
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
        },
        ladderItemHandle: {
            cursor: 'pointer',
            width: 12,
            height: 12,
            borderRadius: 2,
            backgroundColor: '#795548',
            '&:hover, &.active': {
                zIndex: 1,
                boxShadow: '0 0 8px 4px rgba(255, 255, 255, 0.4), 0 0 12px 12px rgb(158, 118, 98, 0.6)',
            },
        },
        // cursorGrap: {
        //     cursor: 'grab',
        // },
        // cursorGrabbing: {
        //     cursor: 'grabbing',
        // },
        // cursorNoDrop: {
        //     cursor: 'no-drop',
        // },
        // TODO: 나중에 그려져야됨 (zIndex 2로 변경 필요)
        resultLines: {
            position: 'absolute',
            zIndex: 0,
            width: '100%',
            height: '100%',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        resultLineItem: {
            position: 'absolute',
            left: 10,
            top: 10,
            width: 10,
            height: 10,
            backgroundColor: 'red',
        },
    }))

let mapDataUid = 0

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
            const { ladderQty } = props
            const { mapData } = state

            setState({
                ...state,
                isPaintingLadder: true,
            })

            return new Promise(resolve => {
                for (let x = 0; x < ladderQty; x++) {
                    mapData[x] = []
                    for (let y = 0; y < state.ladderBlockCnt; y++) {
                        mapData[x][y] = methods.createMapData()

                        if (y > 0) {
                            const prev = mapData[x][y - 1]
                            prev.nextLadder = mapData[x][y]
                            prev.nextStep = mapData[x][y]
                            mapData[x][y].prevLadder = prev
                            mapData[x][y].prevStep = prev
                        }

                        if (y > 0 && y < state.ladderBlockCnt - 1) {
                            mapData[x][y].isHandle = y % 2 !== 0
                        }
                    }
                }

                setTimeout(() => {
                    setState({
                        ...state,
                        mapData,
                        isPaintingLadder: false,
                        isPaintedLadder: true,
                    })
                    resolve()
                }, 1000)
            })
        },
        handleClick: (x, y) => e => {
            e.persist()
            console.group('item')
            console.log('x', x)
            console.log('y', y)
            console.log(state.mapData[x][y])
            console.groupEnd()
        },
        bindMapItem: (x, y) => el => {
            state.mapData[x][y].el = el
        },
        createMapData(el = null): MapData {
            return {
                uid: ++mapDataUid,
                el,
                isHandle: false,
                isLinked: false,
                nextLadder: null,
                nextStep: null,
                prevLadder: null,
                prevStep: null,
            }
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
                        <React.Fragment>
                            <Grid className={classes.ladders} container spacing={2} justify="space-evenly">
                                {state.mapData.map((xVal, xIndex) => {
                                    return (
                                        <Grid key={xIndex} item>
                                            <Box className={classes.ladderItemHeader}>
                                                <Typography>{props.players[xIndex] || `참가자 ${xIndex + 1}`}</Typography>
                                            </Box>
                                            <Box className={classes.ladderItem}>
                                                {xVal.map((yVal, yIndex) => {
                                                    return (
                                                        <div
                                                            key={yIndex}
                                                            ref={methods.bindMapItem(xIndex, yIndex)}
                                                            className={clsx(classes.ladderItemBlock, {
                                                                [classes.ladderItemHandle]: yVal.isHandle,
                                                            })}
                                                            onClick={methods.handleClick(xIndex, yIndex)}
                                                        />
                                                    )
                                                })}
                                            </Box>
                                            <Box className={classes.ladderItemFooter}>
                                                <Typography>{props.rewards[xIndex] || `보상 ${xIndex + 1}`}</Typography>
                                            </Box>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            <div className={classes.resultLines}>
                                <div className={classes.resultLineItem} />
                            </div>
                        </React.Fragment>
                    )
                } else {
                    return null
                }
            })()}
        </div>
    )
}

export default LadderGame
