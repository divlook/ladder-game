import React, { useRef, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { InitialState } from '~/reducers/index.type'

const LadderGame: React.FC<InitialState> = props => {
    const defaultOption = {
        minHeight: 300,
    }
    const initialState = {
        mounted: false,
        width: 0,
        height: defaultOption.minHeight,
        isPaintingLadder: false,
        isPaintedLadder: false,
    }

    const wrapperRef = useRef<HTMLDivElement>(null)
    const [state, setState] = useState(initialState)

    const calcMapSize = () => {
        console.log(wrapperRef.current?.clientWidth)
    }

    useEffect(() => {
        if (state.mounted) {
            calcMapSize()
        }
        console.log(state)
    })

    if (!state.mounted) setState(state => ({ ...state, mounted: true }))

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
