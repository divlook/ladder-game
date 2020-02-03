import { State } from '~/components/LadderGame.interface'

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

export default (state: State, action) => {
    switch (action.type) {
        default: {
            throw new Error()
        }
    }
}
