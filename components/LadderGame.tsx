import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { Typography, Box, Grid, Button } from '@material-ui/core'
import { InitialState } from '~/reducers/index.type'
import { useLifecycle } from '~/hooks/lifecycle'
import { MapData, MidLine, State } from '~/components/LadderGame.interface'
import { colors, useStyles } from '~/components/LadderGame.style'

/*
TODO:

// 클릭=터치
// block은 1:1로만 연결가능
// block이 1:1로 연결되면 midLine이 생성됨.
// midLine은 [prevStep ,nextStep] 데이터를 가지고 있어야됨. 좌표를 저장하는 방법은 2가지가 있음
// - 1. useMemo를 사용하여 mapData가 변경될 때마다 새로 계산하는 방법
// - 2. new Map()을 사용하여 변경할때마다 해당 hash만 변경하는 방법
// 연결되면 isLinked가 true가 되고 더이상 클릭할 수 없음.
// midLine을 취소할 수 있으며, 취소하면 원상복귀시켜야 됨.
// 보상은 midLine이 다 그려진 뒤 게임이 시작되기전에 순서를 랜덤으로 섞어야됨
// resultLine은 mapData의 0부터 시작해서 nextStep을 따라 그려져야됨
resultLine이 그려질 때 애니메이션 추가
결과 데이터 저장
확률 표시

싱글모드, 멀티모드
유저정보 입력
호스트가 게임 생성
다른 유저들이 게임에 참가

FIXME:
useReducer로 변경하고 파일 분리
methods는 useCallback 또는 action으로 분리
*/

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
    gameStep: 0,
    completedLineIndexs: [],
    colorIndex: 0,
    rewards: [],
}

let __uid = 0

const LadderGame: React.FC<InitialState> = props => {
    const { useCreated, useMounted, useBeforeDestroy } = useLifecycle({ useLog: true, logLabel: 'LadderGame' })
    const [state, setState] = useState(initialState)
    const classes = useStyles(state)()

    const mapRef = useRef<HTMLDivElement>(null)
    const resultRef = useRef<HTMLDivElement>(null)

    const methods = {
        calcMapSize() {
            if (mapRef.current) {
                state.mapWidth = mapRef.current?.scrollWidth || 0
                state.mapHeight = Math.max(state.mapHeight, mapRef.current?.scrollHeight || 0)
                setState(state)
                return true
            } else {
                return false
            }
        },
        paintLadder() {
            const { ladderQty } = props
            const { mapData } = state

            state.isPaintingLadder = true

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

            state.mapData = mapData
            state.isPaintingLadder = false
            state.isPaintedLadder = true
            setState(state)
        },
        calcMidLineStyle: (startPoint: MapData, endPoint: MapData) => {
            const toTheSameTop = (startPoint?.el?.offsetTop || 0) === (endPoint?.el?.offsetTop || 0)
            const toTheBottom = (startPoint?.el?.offsetTop || 0) < (endPoint?.el?.offsetTop || 0)
            const toTheRight = (startPoint?.el?.offsetLeft || 0) < (endPoint?.el?.offsetLeft || 0)

            const leftPoint = toTheRight ? startPoint : endPoint
            const rightPoint = toTheRight ? endPoint : startPoint

            if (leftPoint?.el !== null && rightPoint?.el !== null) {
                const defaultMidLineOption = {
                    width: 8,
                }
                const style = {
                    display: 'block',
                    top: 0,
                    left: 0,
                    width: defaultMidLineOption.width,
                    height: defaultMidLineOption.width,
                    transform: 'rotate(0deg)',
                }

                if (toTheSameTop) {
                    const margin = (leftPoint.el.offsetWidth - defaultMidLineOption.width) / 2
                    const addLine = leftPoint.el.offsetWidth - margin * 2
                    style.width = Math.abs(leftPoint.el.offsetLeft - rightPoint.el.offsetLeft) + addLine
                    style.left = leftPoint.el.offsetLeft + margin
                    style.top = leftPoint.el.offsetTop + margin
                } else {
                    const margin = (leftPoint.el.offsetWidth - defaultMidLineOption.width) / 2
                    const addLine = leftPoint.el.offsetWidth - margin * 2
                    const width = Math.abs(leftPoint.el.offsetLeft - rightPoint.el.offsetLeft) + addLine
                    const height = Math.abs(leftPoint.el.offsetTop - rightPoint.el.offsetTop) + addLine
                    const angle = (Math.atan(height / width) * 180) / Math.PI

                    style.width = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
                    style.left = leftPoint.el.offsetLeft - (style.width - width) / 2
                    style.top = leftPoint.el.offsetTop + height / 2
                    style.transform = `rotate(${angle}deg)`

                    // 방향에 따라 추가 연산
                    if ((!toTheBottom && toTheRight) || (!toTheRight && toTheBottom)) {
                        style.top += height * -1
                        style.transform = `rotate(${angle * -1}deg)`
                    }
                    if ((toTheBottom && toTheRight) || (!toTheBottom && !toTheRight)) {
                        style.top -= defaultMidLineOption.width / 2
                    }
                    if ((!toTheBottom && toTheRight) || (toTheBottom && !toTheRight)) {
                        style.top += defaultMidLineOption.width / 2
                    }

                    // margin 추가
                    style.left += margin
                    style.top += margin
                }

                return style
            }
            return undefined
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
                const midLine: MidLine = {
                    uid: ++__uid,
                    el: null,
                    blocks: [],
                    style: undefined,
                }

                const startPoint = state.generatingMidLinePoint
                const endPoint = state.mapData[x][y]

                // startPoint, endPoint 서로 연결
                startPoint.isLinked = true
                endPoint.isLinked = true
                startPoint.linkedBlock = endPoint
                endPoint.linkedBlock = startPoint
                startPoint.midLine = midLine
                endPoint.midLine = midLine
                midLine.blocks = [startPoint, endPoint]
                midLine.style = methods.calcMidLineStyle(startPoint, endPoint)

                // state에 저장
                state.midLineData.push(midLine)
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
        playGame: key => () => {
            if (resultRef.current && !state.completedLineIndexs.includes(key)) {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                canvas.width = state.mapWidth
                canvas.height = state.mapHeight

                if (ctx) {
                    const coordinates: [number, number][] = []
                    const color = colors[state.colorIndex % colors.length]

                    let prevBlockUid = 0
                    let current: MapData | null = state.mapData[key][0]

                    ctx.lineWidth = 3
                    ctx.lineJoin = 'round'
                    ctx.strokeStyle = color
                    ctx.fillStyle = color

                    while (current !== null) {
                        let next: MapData | null = null
                        if (current.nextBlock) {
                            if (coordinates.length === 0) {
                                // 시작
                                coordinates.push([
                                    (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - ctx.lineWidth) / 2,
                                    current.el?.offsetTop || 0,
                                ])

                                next = current.nextBlock
                            } else if (current.linkedBlock) {
                                if (current.isHandle) {
                                    coordinates.push([
                                        (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - ctx.lineWidth) / 2,
                                        (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0 - ctx.lineWidth) / 2,
                                    ])
                                }

                                if (current.linkedBlock.uid === prevBlockUid) {
                                    // midLine 이동 후
                                    next = current.nextBlock
                                } else {
                                    // midLine 이동 전
                                    next = current.linkedBlock
                                }
                            } else {
                                // 일반 block
                                next = current.nextBlock
                            }
                        } else {
                            // 끝
                            coordinates.push([
                                (current.el?.offsetLeft || 0) + (current.el?.offsetWidth || 0 - ctx.lineWidth) / 2,
                                (current.el?.offsetTop || 0) + (current.el?.offsetHeight || 0),
                            ])
                        }

                        prevBlockUid = current?.uid || 0
                        current = next
                    }

                    for (let index = 0, len = coordinates.length; index < len; index++) {
                        const xy = coordinates[index]

                        if (index === 0) {
                            ctx.beginPath()
                            ctx.arc(xy[0], xy[1] - 8, 6, 0, Math.PI * 2)
                            ctx.closePath()
                            ctx.fill()
                            ctx.beginPath()
                            ctx.moveTo(xy[0], xy[1] - 3)
                            ctx.lineTo(...xy)
                        } else {
                            ctx.lineTo(...xy)
                        }

                        if (index === len - 1) {
                            ctx.lineTo(xy[0], xy[1] + 3)
                            ctx.stroke()
                            ctx.beginPath()
                            ctx.arc(xy[0], xy[1] + 8, 6, 0, Math.PI * 2)
                            ctx.closePath()
                            ctx.fill()
                        }
                    }

                    resultRef.current.append(canvas)
                }

                state.colorIndex++
                state.completedLineIndexs.push(key)
                if (state.completedLineIndexs.length === state.mapData.length) {
                    state.gameStep = 2
                }

                setState({
                    ...state,
                    gameStep: state.gameStep,
                    completedLineIndexs: state.completedLineIndexs,
                })

                return true
            } else {
                return false
            }
        },
        doReady() {
            state.gameStep = 1
            state.rewards = [...props.rewards]
            state.rewards.sort(() => Math.random() - Math.random())
            setState({ ...state })
        },
        reGame() {
            const prevMidLineData = state.midLineData.splice(0, state.midLineData.length)
            state.generatingMidLinePoint = null
            state.gameStep = 0
            state.completedLineIndexs.splice(0, state.completedLineIndexs.length)
            state.colorIndex = 0

            prevMidLineData.forEach(mapData => {
                mapData.blocks.forEach(block => {
                    block.isLinked = false
                    block.linkedBlock = null
                })
            })

            if (resultRef.current) {
                while (resultRef.current.firstChild) {
                    resultRef.current.removeChild(resultRef.current.firstChild)
                }
            }

            setState({ ...state })
        },
        handleOrientationchange: () => {
            if (methods.calcMapSize()) {
                // TODO: 회전시 midLine의 위치와 canvas가 갱신은 되나 게임이 처음부터 다시 시작되는 버그가 생김
                setState(prevState => ({
                    ...prevState,
                    midLineData: state.midLineData.map(midLine => {
                        midLine.style = methods.calcMidLineStyle(midLine.blocks[0], midLine.blocks[1])
                        return midLine
                    }),
                }))
            }
        },
    }

    useCreated(async () => {
        methods.paintLadder()

        window.addEventListener('orientationchange', methods.handleOrientationchange)
        // window.addEventListener('resize', () => { console.log('resize') })
    })

    useMounted(() => {
        methods.calcMapSize()

        console.log(state)
    })

    useBeforeDestroy(() => {
        window.removeEventListener('orientationchange', methods.handleOrientationchange)

        state.isPaintingLadder = false
        state.isPaintedLadder = false
        state.mapData.splice(0, state.mapData.length)
        state.mapWidth = 0
        state.mapHeight = defaultOption.mapMinHeight
        state.ladderBlockCnt = 21
        state.midLineData.splice(0, state.midLineData.length)
        state.generatingMidLinePoint = null
        state.gameStep = 0
        state.completedLineIndexs.splice(0, state.completedLineIndexs.length)
        state.colorIndex = 0
    })

    return (
        <div className={classes.root}>
            {(() => {
                if (state.isPaintingLadder) {
                    return <Typography>사다리가 그려지는 중 입니다. 기다려주세요.</Typography>
                } else if (state.isPaintedLadder && !state.isPaintingLadder) {
                    return (
                        <React.Fragment>
                            <div className={classes.ladders}>
                                <Grid ref={mapRef} className={classes.ladderContainer} container spacing={2}>
                                    {state.mapData.map((xVal, xIndex) => {
                                        return (
                                            <Grid key={xIndex} item>
                                                <Box className={classes.ladderItemHeader}>
                                                    <Button
                                                        className={classes.buttonItem}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={methods.playGame(xIndex)}
                                                        disabled={state.gameStep === 0 || state.completedLineIndexs.includes(xIndex)}
                                                    >
                                                        {props.players[xIndex] || `참가자 ${xIndex + 1}`}
                                                    </Button>
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
                                                    {state.gameStep === 0 && <Typography>보상 {xIndex + 1}</Typography>}
                                                    {state.gameStep > 0 && (
                                                        <Typography>{state.rewards[xIndex] || `보상 ${xIndex + 1}`}</Typography>
                                                    )}
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
                                    <div ref={resultRef} className={clsx(classes.result, { active: state.gameStep > 0 })} />
                                </Grid>
                            </div>

                            <Grid container spacing={2} className={classes.buttons} justify="center">
                                <Grid item>
                                    {state.gameStep === 0 && (
                                        <Button
                                            className={classes.buttonItem}
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            onClick={methods.doReady}
                                        >
                                            준비 완료
                                        </Button>
                                    )}
                                    {state.gameStep > 0 && (
                                        <Button
                                            className={classes.buttonItem}
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            onClick={methods.reGame}
                                        >
                                            다시하기
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
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
