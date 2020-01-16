export const CHANGE_REWARD = 'CHANGE_REWARD'
export const CHANGE_LADDER_QTY = 'CHANGE_LADDER_QTY'
export const CHANGE_NAME = 'CHANGE_NAME'
export const RESET_ALL = 'RESET_ALL'

export type ladderQty = number
export type playerName = string
export type rewardName = string

export interface InitialState {
    ladderQty: ladderQty
    players: any[]
    rewards: string[]
}

export interface Action {
    type: string
    payload?: any
}
