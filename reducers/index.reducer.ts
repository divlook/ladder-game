import * as types from '~/reducers/index.type'

export const initialState: types.InitialState = {
    ladderQty: 0,
    players: [],
    rewards: [],
}

export default (state: types.InitialState, action: types.Action) => {
    switch (action.type) {
        case types.CHANGE_REWARD: {
            const { index, rewardName } = action.payload

            state.rewards.splice(index, 1, rewardName)

            return state
        }

        case types.CHANGE_LADDER_QTY: {
            const { ladderQty } = action.payload
            return {
                ...state,
                ladderQty,
            }
        }

        case types.CHANGE_NAME: {
            const { index, playerName } = action.payload

            state.players.splice(index, 1, playerName)

            return state
        }

        case types.RESET_ALL: {
            for (const key in state) {
                if (Array.isArray(state[key])) {
                    state[key].splice(0, state[key].length)
                } else {
                    state[key] = initialState[key]
                }
            }

            return state
        }

        default: {
            throw new Error()
        }
    }
}
