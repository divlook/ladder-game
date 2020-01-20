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

TODO: 다음 작업할 것 = midLine 배열로 변경
라인 이동
*/

export interface MapData {
    uid: number
    el: HTMLDivElement | null
    x: number
    y: number
    isHandle: boolean
    isLinked: boolean
    prevBlock?: MapData | null
    nextBlock?: MapData | null
    linkedBlock?: MapData | null
    midLine?: MidLine | null
}

export interface MidLine {
    uid: number
    el: HTMLDivElement | null
    blocks: MapData[]
    style: any
}

export interface State {
    isPaintingLadder: boolean
    isPaintedLadder: boolean
    mapData: MapData[][]
    mapWidth: number
    mapHeight: number
    ladderBlockCnt: number
    midLineData: MidLine[]
    generatingMidLinePoint?: MapData | null
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
    midLineData: [],
    generatingMidLinePoint: null,
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
            '&:hover:not(.linked), &.active': {
                zIndex: 1,
                boxShadow: '0 0 8px 4px rgba(255, 255, 255, 0.4), 0 0 12px 12px rgb(158, 118, 98, 0.6)',
            },
            '&.linked': {
                cursor: 'no-drop',
            },
        },
        ladderMidLine: {
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            backgroundColor: '#795548',
            width: 8,
            height: 8,
            borderRadius: 4,
            boxShadow: '0 2px 4px 2px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
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

let __uid = 0

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
                        mapData[x][y] = methods.createMapData(x, y)

                        if (y > 0) {
                            const prev = mapData[x][y - 1]
                            prev.nextBlock = mapData[x][y]
                            mapData[x][y].prevBlock = prev
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
        connectMidLine: (x: number, y: number) => e => {
            e.persist()
            console.group('item')
            console.log('x', x, 'y', y)
            console.log(state.mapData[x][y])
            console.groupEnd()

            // handle만 조작 가능하다
            if (!state.mapData[x][y].isHandle) return

            // 이미 연결된건 조작 불가능하다
            if (state.mapData[x][y].isLinked) return

            // 같은 block을 클릭하면 취소된다
            if (state.mapData[x][y] === state.generatingMidLinePoint) {
                setState({
                    ...state,
                    generatingMidLinePoint: null,
                })
                return
            }

            // 같은 라인의 block을 클릭하면 취소된다
            if (x === state.generatingMidLinePoint?.x) {
                setState({
                    ...state,
                    generatingMidLinePoint: null,
                })
                return
            }

            // midLine 시작점을 저장한다
            if (!state.generatingMidLinePoint) {
                setState({
                    ...state,
                    generatingMidLinePoint: state.mapData[x][y],
                })
                return
            }

            // midLine을 그린다
            if (state.generatingMidLinePoint) {
                const defaultMidLineOption = {
                    width: 8,
                }

                const startPoint = state.generatingMidLinePoint
                const endPoint = state.mapData[x][y]

                const toTheSameTop = (startPoint?.el?.offsetTop || 0) === (endPoint?.el?.offsetTop || 0)
                const toTheBottom = (startPoint?.el?.offsetTop || 0) < (endPoint?.el?.offsetTop || 0)
                const toTheRight = (startPoint?.el?.offsetLeft || 0) < (endPoint?.el?.offsetLeft || 0)

                const leftPoint = toTheRight ? startPoint : endPoint
                const rightPoint = toTheRight ? endPoint : startPoint

                if (leftPoint?.el !== null && rightPoint?.el !== null) {
                    const midLine: MidLine = {
                        uid: ++__uid,
                        el: null,
                        blocks: [],
                        style: {
                            display: 'block',
                            top: 0,
                            left: 0,
                            width: defaultMidLineOption.width,
                            height: defaultMidLineOption.width,
                            transform: 'rotate(0deg)',
                        }
                    }

                    if (toTheSameTop) {
                        const margin = (leftPoint.el.offsetWidth - defaultMidLineOption.width) / 2
                        const addLine = leftPoint.el.offsetWidth - margin * 2
                        midLine.style.width = Math.abs(leftPoint.el.offsetLeft - rightPoint.el.offsetLeft) + addLine
                        midLine.style.left = leftPoint.el.offsetLeft + margin
                        midLine.style.top = leftPoint.el.offsetTop + margin
                    } else {
                        const margin = (leftPoint.el.offsetWidth - defaultMidLineOption.width) / 2
                        const addLine = leftPoint.el.offsetWidth - margin * 2
                        const width = Math.abs(leftPoint.el.offsetLeft - rightPoint.el.offsetLeft) + addLine
                        const height = Math.abs(leftPoint.el.offsetTop - rightPoint.el.offsetTop) + addLine
                        const angle = (Math.atan(height / width) * 180) / Math.PI

                        midLine.style.width = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
                        midLine.style.left = leftPoint.el.offsetLeft - (midLine.style.width - width) / 2
                        midLine.style.top = leftPoint.el.offsetTop + height / 2
                        midLine.style.transform = `rotate(${angle}deg)`

                        // 방향에 따라 추가 연산
                        if ((!toTheBottom && toTheRight) || (!toTheRight && toTheBottom)) {
                            midLine.style.top += height * -1
                            midLine.style.transform = `rotate(${angle * -1}deg)`
                        }
                        if ((toTheBottom && toTheRight) || (!toTheBottom && !toTheRight)) {
                            midLine.style.top -= defaultMidLineOption.width / 2
                        }
                        if ((!toTheBottom && toTheRight) || (toTheBottom && !toTheRight)) {
                            midLine.style.top += defaultMidLineOption.width / 2
                        }

                        // margin 추가
                        midLine.style.left += margin
                        midLine.style.top += margin
                    }

                    // startPoint, endPoint 서로 연결
                    startPoint.isLinked = true
                    endPoint.isLinked = true
                    startPoint.linkedBlock = endPoint
                    endPoint.linkedBlock = startPoint
                    startPoint.midLine = midLine
                    endPoint.midLine = midLine
                    midLine.blocks = [startPoint, endPoint]

                    // state에 저장
                    state.midLineData.push(midLine)
                }
            }

            // 수정사항 반영 및 generatingMidLinePoint 초기화
            setState({
                ...state,
                generatingMidLinePoint: null,
            })
        },
        cutMidLine: (midLine: MidLine) => () => {
            midLine.blocks.forEach(row => {
                row.isLinked = false
                row.linkedBlock = null
                row.midLine = null
            })

            const midLineIndex = state.midLineData.findIndex(row => row.uid === midLine.uid)
            state.midLineData.splice(midLineIndex, 1)

            setState({ ...state })
        },
        bindEl: data => el => {
            data.el = el
        },
        createMapData(x, y): MapData {
            return {
                uid: ++__uid,
                el: null,
                x,
                y,
                isHandle: false,
                isLinked: false,
                prevBlock: null,
                nextBlock: null,
                linkedBlock: null,
                midLine: null,
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
                                                            ref={methods.bindEl(yVal)}
                                                            className={clsx(classes.ladderItemBlock, {
                                                                [classes.ladderItemHandle]: yVal.isHandle,
                                                                active: state.generatingMidLinePoint === yVal,
                                                                linked: yVal.isLinked,
                                                            })}
                                                            onClick={methods.connectMidLine(xIndex, yIndex)}
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
                                {state.midLineData.map((midLine, midLineIndex) => {
                                    return (
                                        <div
                                            key={midLineIndex}
                                            ref={methods.bindEl(midLine)}
                                            className={classes.ladderMidLine}
                                            style={midLine.style}
                                            onClick={methods.cutMidLine(midLine)}
                                        />
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
