import { MapData } from '~/components/LadderGame.interface'
import * as types from '~/components/LadderGame.type'

export const createMapData = (ladderQty: number) => {
    return {
        type: types.CREATE_MAP_DATA,
        payload: { ladderQty },
    }
}

export const updateMapSize = (mapWidth?: number, mapHeight?: number) => {
    return {
        type: types.UPDATE_MAP_SIZE,
        payload: { mapWidth, mapHeight },
    }
}

export const startGeneratingMidline = (startPoint: MapData) => {
    return {
        type: types.START_GENERATING_MIDLINE,
        payload: { startPoint },
    }
}

export const cancelGeneratingMidline = () => {
    return {
        type: types.CANCEL_GENERATING_MIDLINE,
        payload: {},
    }
}

export const finishGeneratingMidline = (endPoint: MapData) => {
    return {
        type: types.FINISH_GENERATING_MIDLINE,
        payload: { endPoint },
    }
}

export const removeMidline = (midLineIndex: number) => {
    return {
        type: types.REMOVE_MIDLINE,
        payload: { midLineIndex },
    }
}

export const prepareGame = (rewards: string[]) => {
    return {
        type: types.PREPARE_GAME,
        payload: { rewards }
    }

}

export const playGame = (lineIndex: number) => {
    return {
        type: types.PLAY_GAME,
        payload: { lineIndex },
    }
}

export const reGame = () => {
    return {
        type: types.RE_GAME,
        payload: {},
    }
}

export const reset = () => {
    return {
        type: types.RESET,
        payload: {},
    }
}

export const autoConnect = (ladderQty: number) => {
    return {
        type: types.AUTO_CONNECT,
        payload: { ladderQty },
    }
}
