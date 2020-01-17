import React, { useRef, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { InitialState } from '~/reducers/index.type'
import { useLifecycle } from '~/hooks/lifecycle'

export const defaultOption = {
    mapMinHeight: 300,
}

export const initialState = {
    isPaintingLadder: false,
    isPaintedLadder: false,
    mapWidth: 0,
    mapHeight: defaultOption.mapMinHeight,
}

const LadderGame: React.FC<InitialState> = props => {
    const { useCreated, useMounted, useUpdated } = useLifecycle()
    const [state, setState] = useState(initialState)

    const wrapperRef = useRef<HTMLDivElement>(null)

    const calcMapSize = () => {
        setState({
            ...state,
            mapWidth: wrapperRef.current?.clientWidth || 0,
            mapHeight: Math.max(state.mapHeight, wrapperRef.current?.clientHeight || 0),
        })
    }

    useCreated(() => {
        console.group('Created LadderGame')
        calcMapSize()
        console.groupEnd()
    })

    useMounted(() => {
        console.group('Mounted LadderGame')
        console.log(state)
        console.groupEnd()
    })

    useUpdated(() => {
        console.group('Updated LadderGame')
        console.groupEnd()
    })

    return (
        <div ref={wrapperRef}>
            {(() => {
                if (state.isPaintingLadder) {
                    return <Typography>사다리가 그려지는 중 입니다. 기다려주세요.</Typography>
                } else if (state.isPaintedLadder && !state.isPaintingLadder) {
                    return Array.from({ length: props.ladderQty }).map((row, key) => {
                        return (
                            <Box key={key}>
                                <Typography>{props.players[key]}</Typography>
                            </Box>
                        )
                    })
                } else {
                    return null
                }
            })()}
        </div>
    )
}

export default LadderGame
