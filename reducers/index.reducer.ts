import * as types from '~/reducers/index.type'

export const initialState: types.InitialState = {
    ladderQty: 0,
    players: [],
    goals: [],
}

export default (state: types.InitialState, action: types.Action) => {
    switch (action.type) {
        case types.CHANGE_GOAL: {
            return {
                ...state,
            }
        }

        case types.CHANGE_LADDER_QTY: {
            return {
                ...state,
                ladderQty: action.payload.qty,
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
