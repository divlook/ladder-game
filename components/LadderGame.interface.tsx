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
}

export interface State {
    hasMapData: boolean
    mapData: MapData[][]
    mapWidth: number
    mapHeight: number
    ladderBlockCnt: number
    midLineData: MidLine[]
    generatingMidLinePoint?: MapData | null
    /**
     * 게임 단계
     * - 0: 시작전
     * - 1: 진행중
     * - 2: 완료
     */
    gameStep: number
    completedLineIndexs: number[]
    colorIndex: number
    rewards: string[]
}
