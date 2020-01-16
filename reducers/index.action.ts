import * as types from '~/reducers/index.type'

export const changeReward = (index: number, rewardName: types.rewardName) => {
    return {
        type: types.CHANGE_REWARD,
        payload: {
            index,
            rewardName,
        },
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

export const changeName = (index: number, playerName: types.playerName) => {
    return {
        type: types.CHANGE_NAME,
        payload: {
            index,
            playerName,
        },
    }
}

export const resetAll = () => {
    return {
        type: types.RESET_ALL,
        payload: {},
    }
}
