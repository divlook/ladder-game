import { State, MapData, MidLine } from '~/components/LadderGame.interface'
import * as types from '~/components/LadderGame.type'
import * as actions from '~/components/LadderGame.action'

const useDispatch = (reducer, initialState) => {
    return (action) => {
        Object.assign(initialState, reducer(initialState, action))
    }
}

export const defaultOption = {
    mapMinHeight: 300,
}

export const LadderGameInitialState: State = {
    hasMapData: false,
    mapData: [],
    mapWidth: 0,
    mapHeight: defaultOption.mapMinHeight,
    ladderBlockCnt: 21,
    midLineData: [],
    generatingMidLinePoint: null,
    gameStep: 0,
    completedLineIndexs: [],
    rewards: [],
}

export const LadderGameInitializer = (state: State) => {
    for (const key in state) {
        Array.isArray(state[key]) && state[key].splice(0, state[key].length)
    }
    return state
}

let __uid = 0

export const LadderGameReducer = (state: State, action: {type: string, payload?: any}) => {
    switch (action.type) {
        case types.CREATE_MAP_DATA: {
            const ladderQty: number = action.payload.ladderQty


            for (let x = 0; x < ladderQty; x++) {
                state.mapData[x] = []
                for (let y = 0; y < state.ladderBlockCnt; y++) {
                    state.mapData[x][y] =  {
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

                    if (y > 0) {
                        const prev = state.mapData[x][y - 1]
                        prev.nextBlock = state.mapData[x][y]
                        state.mapData[x][y].prevBlock = prev
                    }

                    if (y > 0 && y < state.ladderBlockCnt - 1) {
                        state.mapData[x][y].isHandle = y % 2 !== 0
                    }
                }
            }

            if (Array.isArray(state.mapData)) {
                state.mapData.splice(0, state.mapData.length, ...state.mapData)
            }

            return {
                ...state,
                hasMapData: state.mapData.length > 0,
            }
        }

        case types.UPDATE_MAP_SIZE: {
            const mapWidth = action.payload?.mapWidth ?? 0
            const mapHeight = Math.max(state.mapHeight, action.payload?.mapHeight ?? 0)

            return {
                ...state,
                mapWidth,
                mapHeight,
            }
        }

        case types.START_GENERATING_MIDLINE: {
            const generatingMidLinePoint = action.payload.startPoint

            return {
                ...state,
                generatingMidLinePoint,
            }
        }

        case types.CANCEL_GENERATING_MIDLINE: {
            return {
                ...state,
                generatingMidLinePoint: null,
            }
        }

        case types.FINISH_GENERATING_MIDLINE: {
            const startPoint: MapData | null = state.generatingMidLinePoint ?? null
            const endPoint: MapData | null = action.payload.endPoint ?? null

            const midLine: MidLine = {
                uid: ++__uid,
                el: null,
                blocks: [],
            }

            if (startPoint && endPoint) {

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
                state.generatingMidLinePoint = null
            }

            return {
                ...state,
            }
        }

        case types.REMOVE_MIDLINE: {
            const midLineIndex = action.payload.midLineIndex

            if (state.midLineData[midLineIndex]) {
                state.midLineData[midLineIndex].blocks.forEach(row => {
                    row.isLinked = false
                    row.linkedBlock = null
                    row.midLine = null
                })
                state.midLineData.splice(midLineIndex, 1)
            }

            return {
                ...state,
            }
        }

        case types.PREPARE_GAME: {
            const rewards = action.payload.rewards

            state.gameStep = 1
            state.rewards = [...rewards].sort(() => Math.random() - Math.random())

            return {
                ...state,
            }
        }

        case types.PLAY_GAME: {
            const lineIndex = action.payload.lineIndex

            state.completedLineIndexs.push(lineIndex)

            if (state.completedLineIndexs.length === state.mapData.length) {
                state.gameStep = 2
            }

            return {
                ...state,
            }
        }

        case types.RE_GAME: {
            const prevMidLineData = state.midLineData.splice(0, state.midLineData.length)

            state.generatingMidLinePoint = null
            state.gameStep = 0
            state.completedLineIndexs.splice(0, state.completedLineIndexs.length)

            prevMidLineData.forEach(mapData => {
                mapData.blocks.forEach(block => {
                    block.isLinked = false
                    block.linkedBlock = null
                })
            })

            return {
                ...state,
            }
        }

        case types.RESET: {
            state.hasMapData = false
            state.mapData.splice(0, state.mapData.length)
            state.mapWidth = 0
            state.mapHeight = defaultOption.mapMinHeight
            state.ladderBlockCnt = 21
            state.midLineData.splice(0, state.midLineData.length)
            state.generatingMidLinePoint = null
            state.gameStep = 0
            state.completedLineIndexs.splice(0, state.completedLineIndexs.length)

            return {
                ...state,
            }
        }

        case types.AUTO_CONNECT: {
            const nextState = { ...state }
            const ladderQty = action.payload.ladderQty
            const dispatch = useDispatch(LadderGameReducer, nextState)
            const random = function(percent = 50) {
                return Math.round(Math.random() * 100) <= percent
            }

            const startIndexs = Array(ladderQty)
                .fill(null)
                .map((val, key) => key)
                .filter(() => random(80))

            if (startIndexs.length === 0) {
                startIndexs.push(Math.floor(Math.random() * Math.pow(10, ladderQty.toString().length) % ladderQty))
            }

            startIndexs.forEach(index => {
                const getNextXIndex = function(index: number) {
                    if (index === 0) return 1
                    if (index === ladderQty - 1) return index - 1
                    return index + (random(50) ? 1 : -1)
                }

                const getNextYIndex = function(index: number) {
                    const sign = (random(80) || index > 1) ? 1 : -1
                    const distance = Math.floor(Math.random() * 10 % 3) * 2
                    const nextIndex = index + distance * sign

                    if (nextIndex <= 1) {
                        return index + distance
                    }

                    return nextIndex
                }

                const connect = function(xIndex, yIndex = 1) {
                    const currentYIndex = getNextYIndex(yIndex)
                    const nextXIndex = getNextXIndex(xIndex)
                    const nextYIndex = getNextYIndex(currentYIndex)
                    const startPoint = nextState.mapData[xIndex][currentYIndex]
                    const endPoint = nextState.mapData[nextXIndex][nextYIndex]

                    if (startPoint && !startPoint.isLinked && endPoint && !endPoint.isLinked) {
                        dispatch(actions.startGeneratingMidline(startPoint))
                        dispatch(actions.finishGeneratingMidline(endPoint))
                    }

                    if (endPoint) {
                        connect(nextXIndex, nextYIndex)
                    }
                }
                connect(index)
            })

            return {
                ...nextState,
            }
        }

        default: {
            return state
        }
    }
}

export default LadderGameReducer
