import * as types from '~/reducers/index.type'

export const changeGoal = () => {
    return {
        type: types.CHANGE_GOAL,
        payload: {},
    }
}

export const changeLadderQty = (ladderQty: types.ladderQty) => {
    return {
        type: types.CHANGE_LADDER_QTY,
        payload: {
            ladderQty,
        },
    }
}

export const changeName = () => {
    return {
        type: types.CHANGE_NAME,
        payload: {},
    }
}
