import * as types from '~/reducers/index.type'

interface Action<P = Payload> {
    type: string
    payload?: P
}

interface Payload {
    [key: string]: any
}

export const initialState: {
    ladderQty: number
    players: any[]
    goals: string[]
} = {
    ladderQty: 0,
    players: [],
    goals: [],
}

export default (state: typeof initialState, action: Action) => {
    switch (action.type) {
        case types.CHANGE_GOAL: {
            return {
                ...state,
            }
        }

        case types.CHANGE_LADDER_QTY: {
            return {
                ...state,
            }
        }

        case types.CHANGE_NAME: {
            return {
                ...state,
            }
        }

        default: {
            throw new Error()
        }
    }
}
