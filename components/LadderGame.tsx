import React, { useRef, useReducer, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import { Typography, Box, Grid, Button } from '@material-ui/core'
import { InitialState } from '~/reducers/index.type'
import { MapData } from '~/components/LadderGame.interface'
import { useStyles } from '~/components/LadderGame.style'
import { LadderGameReducer, LadderGameInitialState, LadderGameInitializer } from '~/components/LadderGame.reducer'
import * as actions from '~/components/LadderGame.action'
import { throttling } from '~/lib/utils'
import ResultCanvas from '~/components/ResultCanvas'

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
// resultLine이 그려질 때 애니메이션 추가
결과 데이터 저장
확률 표시

싱글모드, 멀티모드
유저정보 입력
호스트가 게임 생성
다른 유저들이 게임에 참가

*/

const LadderGame: React.FC<InitialState> = props => {
    const [state, dispatch] = useReducer(LadderGameReducer, LadderGameInitialState, LadderGameInitializer)
    const classes = useStyles(state)()

    const mapRef = useRef<HTMLDivElement>(null)

    const methods = {
        calcMapSize() {
            if (mapRef.current) {
                dispatch(actions.updateMapSize(mapRef.current?.scrollWidth, mapRef.current?.scrollHeight))
                return true
            } else {
                return false
            }
        },
        paintLadder() {
            const { ladderQty } = props

            dispatch(actions.createMapData(ladderQty))
        },
        calcMidLineStyle: useCallback(
            (startPoint: MapData, endPoint: MapData) => {
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
            [state.mapWidth, state.mapHeight]
        ),
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
                dispatch(actions.cancelGeneratingMidline())
                return
            }

            // 같은 라인의 block을 클릭하면 취소된다
            if (x === state.generatingMidLinePoint?.x) {
                dispatch(actions.cancelGeneratingMidline())
                return
            }

            // midLine 시작점을 저장한다
            if (!state.generatingMidLinePoint) {
                dispatch(actions.startGeneratingMidline(state.mapData[x][y]))
                return
            }

            // midLine을 그린다
            if (state.generatingMidLinePoint) {
                dispatch(actions.finishGeneratingMidline(state.mapData[x][y]))
            }
        },
        cutMidLine: (midLineIndex: number) => () => {
            dispatch(actions.removeMidline(midLineIndex))
        },
        bindEl: data => el => {
            data.el = el
        },
        playGame: key => () => {
            if (!state.completedLineIndexs.includes(key)) {
                dispatch(actions.playGame(key))
                return true
            } else {
                return false
            }
        },
        doReady() {
            dispatch(actions.prepareGame(props.rewards))
        },
        reGame() {
            dispatch(actions.reGame())
        },
        handleWindowResize: throttling(() => {
            methods.calcMapSize()
        }),
    }

    useEffect(() => {
        methods.paintLadder()
        window.addEventListener('resize', methods.handleWindowResize)

        return () => {
            window.removeEventListener('resize', methods.handleWindowResize)
        }
    }, [])

    useEffect(() => {
        state.hasMapData && methods.calcMapSize()
    }, [state.hasMapData])

    return (
        <div className={classes.root}>
            {(() => {
                if (!state.hasMapData) {
                    return <Typography>사다리가 그려지는 중 입니다. 기다려주세요.</Typography>
                } else if (state.hasMapData) {
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
                                                style={methods.calcMidLineStyle(midLine.blocks[0], midLine.blocks[1])}
                                                onClick={methods.cutMidLine(midLineIndex)}
                                            />
                                        )
                                    })}
                                    <div className={clsx(classes.result, { active: state.gameStep > 0 })}>
                                        {state.completedLineIndexs.map((lineIndex, index) => {
                                            return (
                                                <ResultCanvas
                                                    key={index}
                                                    lineIndex={lineIndex}
                                                    width={state.mapWidth}
                                                    height={state.mapHeight}
                                                    map={state.mapData}
                                                />
                                            )
                                        })}
                                    </div>
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
                }
            })()}
        </div>
    )
}

export default LadderGame
