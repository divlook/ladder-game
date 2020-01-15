export const CHANGE_GOAL = 'CHANGE_GOAL'
export const CHANGE_LADDER_QTY = 'CHANGE_LADDER_QTY'
export const CHANGE_NAME = 'CHANGE_NAME'

export type ladderQty = number

export interface InitialState {
    ladderQty: ladderQty
    players: any[]
    goals: string[]
}

export interface Action {
    type: string
    payload?: any
}
